
import { useState, useEffect, useCallback } from 'react';
import { saveDataToFirebase, loadDataFromFirebase } from '@/services/firebase';
import { toast } from 'sonner';

// Custom hook for using Firebase as storage
export function useFirebaseStorage<T>(key: string, initialValue: T, sheetId: string = "default"): [T, (value: T) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load data from Firebase on initial mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await loadDataFromFirebase(sheetId);
        
        if (data) {
          if (key === 'motelRooms') {
            setStoredValue(data.rooms as unknown as T);
          } else if (key === 'motelFooterValues') {
            setStoredValue(data.footerValues as unknown as T);
          }
        }
      } catch (error) {
        console.error(`Error loading ${key} from Firebase:`, error);
        toast.error(`Failed to load data from cloud. Using default values.`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [key, sheetId]);

  // Save to Firebase
  const setValue = useCallback(async (value: T) => {
    try {
      setStoredValue(value);
      
      // Determine which part of the data we're updating
      if (key === 'motelRooms') {
        const currentData = await loadDataFromFirebase(sheetId);
        await saveDataToFirebase(
          value as any,
          currentData?.footerValues || initialValue as any,
          sheetId
        );
      } else if (key === 'motelFooterValues') {
        const currentData = await loadDataFromFirebase(sheetId);
        await saveDataToFirebase(
          currentData?.rooms || initialValue as any,
          value as any,
          sheetId
        );
      }
      
      toast.success('Data saved to cloud successfully');
    } catch (error) {
      console.error(`Error saving ${key} to Firebase:`, error);
      toast.error('Failed to save data to cloud');
    }
  }, [key, sheetId, initialValue]);

  return [storedValue, setValue, isLoading];
}
