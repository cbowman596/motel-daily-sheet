
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import RoomManager from '@/components/RoomManager';
import { RoomData } from '@/types';
import { loadRooms, saveRooms } from '@/lib/supabase';
import { initialRooms } from '@/data/initialData';

const Index = () => {
  const { signOut, user } = useAuth();
  const [rooms, setRooms] = useState<RoomData[]>(initialRooms);
  const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
        <div className="mb-4 flex justify-end">
          <Button 
            onClick={handleSaveRooms}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
        
        <div>
          <RoomManager 
            rooms={rooms}
            updateRoom={updateRoom}
            selectedRoomIds={selectedRoomIds}
            setSelectedRoomIds={setSelectedRoomIds}
            applyColorToRooms={applyColorToRooms}
            clearRoomColors={clearRoomColors}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
