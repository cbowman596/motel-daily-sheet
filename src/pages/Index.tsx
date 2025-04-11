
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
import { useAuth } from '@/contexts/AuthContext';
import { saveRooms, loadRooms, saveFooterValues, loadFooterValues } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

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
  
  // Auth state
  const { user, signOut } = useAuth();
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Print reference
  const printRef = useRef<HTMLDivElement>(null);

  // Load data from Supabase when user is authenticated
  useEffect(() => {
    const loadDataFromSupabase = async () => {
      if (user && !dataLoaded) {
        try {
          // Load rooms
          const roomsResult = await loadRooms(user.id);
          if (roomsResult.success && roomsResult.data.length > 0) {
            setRooms(roomsResult.data);
            toast.success('Room data loaded from cloud');
          }
          
          // Load footer values
          const footerResult = await loadFooterValues(user.id);
          if (footerResult.success && footerResult.data) {
            setFooterValues(footerResult.data);
            toast.success('Footer data loaded from cloud');
          }
          
          setDataLoaded(true);
        } catch (error) {
          console.error('Error loading data from Supabase:', error);
          toast.error('Failed to load data from cloud');
        }
      }
    };
    
    loadDataFromSupabase();
  }, [user, setRooms, setFooterValues, dataLoaded]);

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
  
  // Save data to Supabase
  const saveDataToSupabase = async () => {
    if (!user) return;
    
    try {
      // Save rooms
      const roomsResult = await saveRooms(rooms, user.id);
      if (!roomsResult.success) throw new Error('Failed to save rooms');
      
      // Save footer values
      const footerResult = await saveFooterValues(footerValues, user.id);
      if (!footerResult.success) throw new Error('Failed to save footer values');
      
      toast.success('Data saved to cloud successfully');
    } catch (error) {
      console.error('Error saving data to Supabase:', error);
      toast.error('Failed to save data to cloud');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Motel Manager</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Logged in as: {user?.email}
            </span>
            <Button size="sm" variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
            <Button size="sm" onClick={saveDataToSupabase} className="bg-green-600 hover:bg-green-700">
              Save to Cloud
            </Button>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-md" ref={printRef}>
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
    </div>
  );
};

export default Index;
