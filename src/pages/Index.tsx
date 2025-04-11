
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import RoomManager from '@/components/RoomManager';
import DataManager from '@/components/DataManager';
import { RoomData, FooterValues } from '@/types';
import { loadRooms, saveRooms } from '@/lib/supabase';
import { initialRooms, initialFooterValues } from '@/data/initialData';
import MotelHeader from '@/components/MotelHeader';
import MotelFooter from '@/components/MotelFooter';

const Index = () => {
  const { signOut, user } = useAuth();
  const [rooms, setRooms] = useState<RoomData[]>(initialRooms);
  const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [month, setMonth] = useState<string>(new Date().toLocaleString('default', { month: 'long' }));
  const [day, setDay] = useState<number>(new Date().getDate());
  const [footerValues, setFooterValues] = useState<FooterValues>(initialFooterValues);

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  const fetchRooms = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, success } = await loadRooms(user.id);
    if (success && data && data.length > 0) {
      setRooms(data);
    }
    setLoading(false);
  };

  const updateRoom = (id: number, field: string, value: string) => {
    setRooms(prev => 
      prev.map(room => 
        room.id === id ? { ...room, [field]: value } : room
      )
    );
  };

  const updateFooterValue = (field: string, value: string) => {
    setFooterValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyColorToRooms = (roomIds: number[], bgColor: string, textColor: string) => {
    setRooms(prev => 
      prev.map(room => 
        roomIds.includes(room.id) 
          ? { ...room, backgroundColor: bgColor, textColor: textColor } 
          : room
      )
    );
  };

  const clearRoomColors = (roomIds: number[]) => {
    setRooms(prev => 
      prev.map(room => 
        roomIds.includes(room.id) 
          ? { ...room, backgroundColor: null, textColor: null } 
          : room
      )
    );
  };

  const handleSaveRooms = async () => {
    if (!user) return;
    
    setLoading(true);
    await saveRooms(rooms, user.id);
    setLoading(false);
  };

  // Calculate totals for different room types
  const roomTotals = rooms.reduce(
    (acc, room) => {
      if (room.type === 'W') acc.weekly++;
      else if (room.type === 'M') acc.monthly++;
      else if (room.name?.toLowerCase().includes('airbnb')) acc.airbnb++;
      else acc.nightly++;
      return acc;
    },
    { nightly: 0, weekly: 0, monthly: 0, airbnb: 0 }
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Motel Manager</h1>
          <div className="flex items-center gap-4">
            {user && <span>Welcome, {user.email}</span>}
            <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex justify-between">
          <MotelHeader 
            month={month} 
            setMonth={setMonth} 
            day={day} 
            setDay={setDay}
            totals={roomTotals}
          />
        </div>
        
        <div className="mb-4">
          <RoomManager 
            rooms={rooms}
            updateRoom={updateRoom}
            selectedRoomIds={selectedRoomIds}
            setSelectedRoomIds={setSelectedRoomIds}
            applyColorToRooms={applyColorToRooms}
            clearRoomColors={clearRoomColors}
          />
        </div>
        
        <div className="mb-4">
          <MotelFooter 
            values={footerValues}
            updateFooterValue={updateFooterValue}
          />
        </div>
        
        <DataManager 
          rooms={rooms}
          setRooms={setRooms}
          footerValues={footerValues}
          setFooterValues={setFooterValues}
          roomTotals={roomTotals}
          month={month}
          day={day}
          selectedRoomIds={selectedRoomIds}
          setSelectedRoomIds={setSelectedRoomIds}
        />
      </main>
    </div>
  );
};

export default Index;
