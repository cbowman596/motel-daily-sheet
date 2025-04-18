
import React, { useState } from 'react';
import { toast } from 'sonner';
import { RoomData, FooterValues } from '@/types';
import { initialRooms, initialFooterValues } from '@/data/initialData';
import ActionButtons from '@/components/ActionButtons';
import PrintHandler from '@/components/PrintHandler';

interface DataManagerProps {
  rooms: RoomData[];
  setRooms: (rooms: RoomData[]) => void;
  footerValues: FooterValues;
  setFooterValues: (footerValues: FooterValues) => void;
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
  const [saveStatus, setSaveStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Firebase storage hook will handle the saving
      // Just trigger a state update to save
      setRooms([...rooms]);
      setFooterValues({...footerValues});
      
      setSaveStatus('Saved!');
      setTimeout(() => setSaveStatus(''), 2000);
      toast.success('Data saved to cloud storage');
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save data');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDataImport = (importedRooms: RoomData[], importedFooterValues: FooterValues) => {
    setRooms(importedRooms);
    setFooterValues(importedFooterValues);
    toast.success('Data imported successfully');
  };

  const handleReset = () => {
    // Create the new rooms array directly instead of using a function parameter
    const resetRooms = rooms.map(currentRoom => {
      return {
        id: currentRoom.id,
        roomNumber: currentRoom.roomNumber,
        location: currentRoom.location,
        roomType: currentRoom.roomType,
        backgroundColor: undefined,
        textColor: undefined,
        name: '',
        pmt: '',
        cacc: '',
        rate: '',
        total: '',
        checkIn: '',
        checkOut: '',
        vehicleDesc: '',
        key: '',
        type: ''
      };
    });
    
    // Set the rooms with the new array directly
    setRooms(resetRooms);
    
    // Set footer values directly
    setFooterValues({...initialFooterValues});
    
    toast.success('Sheet has been reset');
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
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
};

export default DataManager;
