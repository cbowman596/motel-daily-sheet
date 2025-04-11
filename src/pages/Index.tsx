
import React, { useState, useRef, useEffect } from 'react';
import MotelHeader from '@/components/MotelHeader';
import MotelFooter from '@/components/MotelFooter';
import RoomManager from '@/components/RoomManager';
import DataManager from '@/components/DataManager';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { initialRooms, initialFooterValues } from '@/data/initialData';
import { RoomData, FooterValues } from '@/types';
import { decodeDataFromUrl } from '@/utils/urlUtils';
import { toast } from 'sonner';

const Index = () => {
  // Date state
  const today = new Date();
  const [month, setMonth] = useState(today.toLocaleString('default', { month: 'long' }));
  const [day, setDay] = useState(today.getDate());
  
  // Room and footer data state
  const [rooms, setRooms] = useLocalStorage<RoomData[]>('motelRooms', initialRooms);
  const [footerValues, setFooterValues] = useLocalStorage<FooterValues>('motelFooterValues', initialFooterValues);
  const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);
  const [roomTotals, setRoomTotals] = useState({ nightly: 0, weekly: 0, monthly: 0, airbnb: 0 });
  
  // Print reference
  const printRef = useRef<HTMLDivElement>(null);

  // Check for URL parameters on mount
  useEffect(() => {
    const checkForUrlData = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedData = urlParams.get('data');
        
        if (encodedData) {
          const decodedData = decodeDataFromUrl(encodedData);
          
          if (decodedData) {
            setRooms(decodedData.rooms);
            setFooterValues(decodedData.footerValues);
            toast.success('Data loaded from URL successfully');
            
            // Clear the URL parameter to avoid reloading on refresh
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
          }
        }
      } catch (error) {
        console.error('Error loading data from URL:', error);
        toast.error('Failed to load data from URL');
      }
    };
    
    checkForUrlData();
  }, [setRooms, setFooterValues]);
  
  // Calculate room totals
  useEffect(() => {
    const totals = {
      nightly: 0,
      weekly: 0,
      monthly: 0,
      airbnb: 0
    };
    
    rooms.forEach(room => {
      if (room.type === 'N') {
        totals.nightly++;
      } else if (room.type === 'W') {
        totals.weekly++;
      } else if (room.type === 'M') {
        totals.monthly++;
      } else if (room.type === 'A') {
        totals.airbnb++;
      }
    });
    
    setRoomTotals(totals);
  }, [rooms]);
  
  // Room update handler
  const updateRoom = (id: number, field: string, value: string) => {
    setRooms(rooms.map(room => 
      room.id === id ? { ...room, [field]: value } : room
    ));
  };

  // Footer update handler
  const updateFooterValue = (field: string, value: string) => {
    setFooterValues({ ...footerValues, [field]: value });
  };
  
  // Color application handler
  const applyColorToRooms = (roomIds: number[], bgColor: string, textColor: string) => {
    setRooms(rooms.map(room => 
      roomIds.includes(room.id) 
        ? { ...room, backgroundColor: bgColor, textColor: '#000000' } 
        : room
    ));
    setSelectedRoomIds([]);
  };
  
  // Color clearing handler
  const clearRoomColors = (roomIds: number[]) => {
    setRooms(rooms.map(room => 
      roomIds.includes(room.id) 
        ? { ...room, backgroundColor: undefined, textColor: undefined } 
        : room
    ));
    setSelectedRoomIds([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-md" ref={printRef}>
        <MotelHeader 
          month={month} 
          setMonth={setMonth} 
          day={day}
          setDay={setDay}
          totals={roomTotals}
        />
        
        <RoomManager 
          rooms={rooms}
          updateRoom={updateRoom}
          selectedRoomIds={selectedRoomIds}
          setSelectedRoomIds={setSelectedRoomIds}
          applyColorToRooms={applyColorToRooms}
          clearRoomColors={clearRoomColors}
        />
        
        <div className="p-4 border-t">
          <MotelFooter values={footerValues} updateFooterValue={updateFooterValue} />
        </div>
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
    </div>
  );
};

export default Index;
