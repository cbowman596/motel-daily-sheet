
import React from 'react';
import { toast } from 'sonner';
import { RoomData, FooterValues } from '@/types';
import { initialRooms, initialFooterValues } from '@/data/initialData';
import ActionButtons from '@/components/ActionButtons';
import PrintHandler from '@/components/PrintHandler';

interface DataManagerProps {
  rooms: RoomData[];
  setRooms: React.Dispatch<React.SetStateAction<RoomData[]>>;
  footerValues: FooterValues;
  setFooterValues: React.Dispatch<React.SetStateAction<FooterValues>>;
  roomTotals: {
    nightly: number;
    weekly: number;
    monthly: number;
    airbnb: number;
  };
  month: string;
  day: number;
  selectedRoomIds: number[];
  setSelectedRoomIds: React.Dispatch<React.SetStateAction<number[]>>;
}

const DataManager: React.FC<DataManagerProps> = ({ 
  rooms, 
  setRooms, 
  footerValues, 
  setFooterValues,
  roomTotals,
  month,
  day,
  selectedRoomIds,
  setSelectedRoomIds
}) => {
  const [saveStatus, setSaveStatus] = React.useState('');

  const applyColorToRooms = (roomIds: number[], bgColor: string, textColor: string) => {
    setRooms(rooms.map(room => 
      roomIds.includes(room.id) 
        ? { ...room, backgroundColor: bgColor, textColor: '#000000' } 
        : room
    ));
    setSelectedRoomIds([]);
  };
  
  const clearRoomColors = (roomIds: number[]) => {
    setRooms(rooms.map(room => 
      roomIds.includes(room.id) 
        ? { ...room, backgroundColor: undefined, textColor: undefined } 
        : room
    ));
    setSelectedRoomIds([]);
  };

  const handleSave = () => {
    // Local storage saving is handled automatically by the useLocalStorage hook
    setSaveStatus('Saved!');
    setTimeout(() => setSaveStatus(''), 2000);
  };
  
  const handleDataImport = (importedRooms: RoomData[], importedFooterValues: FooterValues) => {
    setRooms(importedRooms);
    setFooterValues(importedFooterValues);
    toast.success('Data imported successfully');
  };

  const handleReset = () => {
    // Preserve yellow highlighted rows and specific fields
    setRooms(prevRooms => prevRooms.map((currentRoom, index) => {
      // Get the initial room data for this position
      const initialRoom = initialRooms[index];
      
      // Special case for rooms 28-30 and Cabin/Loft (rooms 31-32)
      if (currentRoom.roomNumber === '28' || 
          currentRoom.roomNumber === '29' || 
          currentRoom.roomNumber === '30' || 
          currentRoom.roomNumber === 'Cabin' || 
          currentRoom.roomNumber === 'Loft') {
        // Preserve these rooms entirely
        return currentRoom;
      }
      
      // For yellow highlighted rows (only rooms specifically marked as yellow, not textColor black)
      if (currentRoom.backgroundColor === '#fcd34d' || 
          currentRoom.backgroundColor === 'yellow') {
        // Preserve the row but reset non-preserved fields
        return {
          ...initialRoom,
          // Keep the following fields
          roomNumber: currentRoom.roomNumber,
          location: currentRoom.location,
          roomType: currentRoom.roomType,
          // Keep the highlighting
          backgroundColor: currentRoom.backgroundColor,
          textColor: currentRoom.textColor
        };
      }
      
      // For all other rooms, completely reset to initial state but preserve only room number, location, and roomType
      return {
        ...initialRoom,
        roomNumber: currentRoom.roomNumber,
        location: currentRoom.location,
        roomType: currentRoom.roomType,
        // Explicitly clear any background colors and set to undefined
        backgroundColor: undefined,
        textColor: undefined
      };
    }));
    
    // Reset footer values
    setFooterValues(initialFooterValues);
    
    toast.success('Sheet reset with preserved data');
  };

  return (
    <div className="max-w-6xl mx-auto mt-4">
      <div className="flex justify-between items-center">
        <div className={`text-green-600 font-medium ${saveStatus ? 'animate-save-flash' : 'opacity-0'}`}>
          {saveStatus}
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <PrintHandler 
            rooms={rooms}
            footerValues={footerValues}
            month={month}
            day={day}
            roomTotals={roomTotals}
          />
          <ActionButtons 
            handleSave={handleSave} 
            handlePrint={() => {}} // PrintHandler handles this
            handleReset={handleReset}
            roomsData={rooms}
            footerValues={footerValues}
            handleDataImport={handleDataImport} 
          />
        </div>
      </div>
    </div>
  );
};

export default DataManager;
