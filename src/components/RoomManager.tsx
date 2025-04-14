
import React, { useMemo } from 'react';
import { RoomData } from '@/types';
import MotelRow from '@/components/MotelRow';
import ColorPicker from '@/components/ColorPicker';

interface RoomManagerProps {
  rooms: RoomData[];
  updateRoom: (id: number, field: string, value: string) => void;
  selectedRoomIds: number[];
  setSelectedRoomIds: React.Dispatch<React.SetStateAction<number[]>>;
  applyColorToRooms: (roomIds: number[], bgColor: string, textColor: string) => void;
  clearRoomColors: (roomIds: number[]) => void;
}

const RoomManager: React.FC<RoomManagerProps> = React.memo(({
  rooms,
  updateRoom,
  selectedRoomIds,
  setSelectedRoomIds,
  applyColorToRooms,
  clearRoomColors
}) => {
  const toggleRoomSelection = React.useCallback((id: number) => {
    setSelectedRoomIds(prev => 
      prev.includes(id) 
        ? prev.filter(roomId => roomId !== id) 
        : [...prev, id]
    );
  }, [setSelectedRoomIds]);

  const memoizedUpdateRoom = React.useCallback(
    (id: number, field: string, value: string) => {
      updateRoom(id, field, value);
    },
    [updateRoom]
  );

  const roomRows = useMemo(() => {
    return rooms.map((room) => (
      <MotelRow 
        key={room.id} 
        room={room} 
        updateRoom={memoizedUpdateRoom}
        isSelected={selectedRoomIds.includes(room.id)}
        onToggleSelect={toggleRoomSelection}
      />
    ));
  }, [rooms, memoizedUpdateRoom, selectedRoomIds, toggleRoomSelection]);

  return (
    <>
      <div className="px-4 py-2 border-b">
        <ColorPicker 
          selectedRooms={selectedRoomIds}
          applyColorToRooms={applyColorToRooms}
          clearRoomColors={clearRoomColors}
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-sm w-8">Select</th>
              <th className="border border-gray-300 p-2 text-sm w-8">Room #</th>
              <th className="border border-gray-300 p-2 text-sm w-10">Loc</th>
              <th className="border border-gray-300 p-2 text-sm w-24">Type</th>
              <th className="border border-gray-300 p-2 text-sm w-8">Dur</th>
              <th className="border border-gray-300 p-2 text-sm w-1/4">Name</th>
              <th className="border border-gray-300 p-2 text-sm w-8">PMT</th>
              <th className="border border-gray-300 p-2 text-sm w-16">CA/CC</th>
              <th className="border border-gray-300 p-2 text-sm w-16">Rate</th>
              <th className="border border-gray-300 p-2 text-sm w-16">Total</th>
              <th className="border border-gray-300 p-2 text-sm w-16">Check-In</th>
              <th className="border border-gray-300 p-2 text-sm w-16">Check-Out</th>
              <th className="border border-gray-300 p-2 text-sm w-1/6">Notes</th>
            </tr>
          </thead>
          <tbody>
            {roomRows}
          </tbody>
        </table>
      </div>
    </>
  );
});

RoomManager.displayName = 'RoomManager';

export default RoomManager;
