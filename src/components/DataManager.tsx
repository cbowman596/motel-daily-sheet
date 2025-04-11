
import React from 'react';
import { toast } from 'sonner';
import { RoomData, FooterValues } from '@/types';
import { initialRooms, initialFooterValues } from '@/data/initialData';
import ActionButtons from '@/components/ActionButtons';
import PrintHandler from '@/components/PrintHandler';
import { Button } from '@/components/ui/button';

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
        ? { ...room, backgroundColor: bgColor, textColor: textColor } 
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
    setSaveStatus('Saved!');
    toast.success('Sheet data saved successfully!');
    setTimeout(() => setSaveStatus(''), 2000);
  };
  
  const handleDataImport = (importedRooms: RoomData[], importedFooterValues: FooterValues) => {
    setRooms(importedRooms);
    setFooterValues(importedFooterValues);
  };

  const handleReset = () => {
    setRooms(initialRooms);
    setFooterValues(initialFooterValues);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap gap-2 justify-center mt-4">
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
      <div className={`text-green-600 font-medium text-center mt-2 ${saveStatus ? 'animate-save-flash' : 'opacity-0'}`}>
        {saveStatus}
      </div>
    </div>
  );
};

export default DataManager;
