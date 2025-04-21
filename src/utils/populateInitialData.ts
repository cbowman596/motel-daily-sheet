
import { saveDataToFirebase, loadDataFromFirebase } from '@/services/firebase';
import { initialRooms, initialFooterValues } from '@/data/initialData';
import { toast } from 'sonner';

export async function populateInitialData(sheetId: string = 'default'): Promise<boolean> {
  try {
    // Check if data already exists in Firebase
    const existingData = await loadDataFromFirebase(sheetId);
    
    // If no data exists or we want to overwrite it
    if (!existingData) {
      await saveDataToFirebase(initialRooms, initialFooterValues, sheetId);
      console.log('Initial data successfully populated in Firebase');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error populating initial data:', error);
    return false;
  }
}
