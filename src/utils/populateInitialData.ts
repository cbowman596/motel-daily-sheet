
import { initializeFirebaseData } from '@/services/firebase';
import { initialRooms, initialFooterValues } from '@/data/initialData';
import { toast } from 'sonner';

export async function populateInitialData(sheetId: string = 'default'): Promise<boolean> {
  try {
    const result = await initializeFirebaseData(initialRooms, initialFooterValues, sheetId);
    
    if (result) {
      console.log('Initial data successfully populated in Firebase');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error populating initial data:', error);
    toast.error('Failed to initialize data');
    return false;
  }
}
