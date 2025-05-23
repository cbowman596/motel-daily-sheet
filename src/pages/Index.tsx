
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
  
  // Room and footer data state with local storage
  const [rooms, setRooms] = useLocalStorage<RoomData[]>('motelRooms', initialRooms);
  const [footerValues, setFooterValues] = useLocalStorage<FooterValues>('motelFooterValues', initialFooterValues);
  const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);
  const [roomTotals, setRoomTotals] = useState({ nightly: 0, weekly: 0, monthly: 0, airbnb: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  // Print reference
  const printRef = useRef<HTMLDivElement>(null);

  // Set loading state
  useEffect(() => {
    // Simulate loading for a brief moment to maintain UX consistency
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // Check for URL parameters on mount and handle shared data once
  useEffect(() => {
    const checkForUrlData = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedData = urlParams.get('data');
        
        if (!encodedData) return;
        
        // Clear local storage when loading shared URL data
        localStorage.clear();
        
        // Decode and apply the data
        const decodedData = decodeDataFromUrl(encodedData);
        if (decodedData) {
          setRooms(decodedData.rooms);
          setFooterValues(decodedData.footerValues);
          
          // Apply date information if available
          if (decodedData.month) {
            setMonth(decodedData.month);
          }
          
          if (decodedData.day) {
            setDay(decodedData.day);
          }
          
          toast.success('Data loaded from URL successfully');
        }
        
        // Clean up the URL by removing the query parameter
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      } catch (error) {
        console.error('Error loading data from URL:', error);
        toast.error('Failed to load data from URL');
      }
    };
    
    // Check URL data only after loading state is complete
    if (!isLoading) {
      checkForUrlData();
    }
  }, [isLoading, setRooms, setFooterValues]);
  
  // Calculate room totals
  useEffect(() => {
    const totals = {
      nightly: 0,
      weekly: 0,
      monthly: 0,
      airbnb: 0
    };
    
    rooms.forEach(room => {
      // Count rooms based on their type field
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
  
  // Import data handler with date support
  const handleImportData = (
    importedRooms: RoomData[], 
    importedFooterValues: FooterValues,
    importedMonth?: string,
    importedDay?: number
  ) => {
    setRooms(importedRooms);
    setFooterValues(importedFooterValues);
    
    if (importedMonth) {
      setMonth(importedMonth);
    }
    
    if (importedDay && importedDay > 0 && importedDay <= 31) {
      setDay(importedDay);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {isLoading ? (
        <div className="max-w-6xl mx-auto bg-white shadow rounded-md p-8 text-center">
          <div className="animate-pulse text-xl">Loading data...</div>
        </div>
      ) : (
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
      )}
      
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
        importData={handleImportData}
      />
    </div>
  );
};

export default Index;
