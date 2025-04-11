
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import RoomManager from '@/components/RoomManager';
import UserManager from '@/components/Auth/UserManager';
import { RoomData } from '@/types';

const Index = () => {
  const { signOut, nameUser } = useAuth();
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);

  // Add functions required for RoomManager props
  const updateRoom = (id: number, field: string, value: string) => {
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === id ? { ...room, [field]: value } : room
      )
    );
  };

  const applyColorToRooms = (roomIds: number[], bgColor: string, textColor: string) => {
    setRooms(prevRooms => 
      prevRooms.map(room => 
        roomIds.includes(room.id) 
          ? { ...room, bgColor, textColor } 
          : room
      )
    );
  };

  const clearRoomColors = (roomIds: number[]) => {
    setRooms(prevRooms => 
      prevRooms.map(room => 
        roomIds.includes(room.id) 
          ? { ...room, bgColor: '', textColor: '' } 
          : room
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Motel Manager</h1>
          <div className="flex items-center gap-4">
            {nameUser && <span>Welcome, {nameUser.name}</span>}
            <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <UserManager />
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
