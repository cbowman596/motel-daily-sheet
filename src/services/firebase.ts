
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue } from "firebase/database";
import { RoomData, FooterValues } from "@/types";

// Your Firebase configuration
// Replace these with your actual Firebase project values
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your Firebase API key
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com", 
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Save data to Firebase
export const saveDataToFirebase = async (
  roomsData: RoomData[], 
  footerValues: FooterValues,
  sheetId: string = "default"
): Promise<void> => {
  try {
    const dataRef = ref(database, `sheets/${sheetId}`);
    await set(dataRef, {
      rooms: roomsData,
      footerValues: footerValues,
      lastUpdated: new Date().toISOString()
    });
    return Promise.resolve();
  } catch (error) {
    console.error("Error saving data to Firebase:", error);
    return Promise.reject(error);
  }
};

// Load data from Firebase
export const loadDataFromFirebase = async (
  sheetId: string = "default"
): Promise<{rooms: RoomData[], footerValues: FooterValues} | null> => {
  try {
    const dataRef = ref(database, `sheets/${sheetId}`);
    const snapshot = await get(dataRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return {
        rooms: data.rooms,
        footerValues: data.footerValues
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error loading data from Firebase:", error);
    return null;
  }
};

// Listen for real-time updates (optional)
export const subscribeToDataUpdates = (
  sheetId: string = "default",
  callback: (data: {rooms: RoomData[], footerValues: FooterValues} | null) => void
) => {
  const dataRef = ref(database, `sheets/${sheetId}`);
  
  return onValue(dataRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      callback({
        rooms: data.rooms,
        footerValues: data.footerValues
      });
    } else {
      callback(null);
    }
  });
};
