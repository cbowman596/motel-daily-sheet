
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { RoomData, FooterValues } from "@/types";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLoUeSnQLzFfQYrf3kCPKyc9hrzDaf8vk",
  authDomain: "motel-daily-sheet.firebaseapp.com",
  databaseURL: "https://motel-daily-sheet-default-rtdb.firebaseio.com",
  projectId: "motel-daily-sheet",
  storageBucket: "motel-daily-sheet.firebasestorage.app",
  messagingSenderId: "608019576618",
  appId: "1:608019576618:web:de089347c767c74d525053",
  measurementId: "G-3JCS7K1NVG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Initialize Analytics
try {
  const analytics = getAnalytics(app);
  console.log("Firebase Analytics initialized successfully");
} catch (error) {
  console.log("Analytics initialization failed:", error);
  // Analytics might fail in environments without browser support
}

// Save data to Firebase
export const saveDataToFirebase = async (
  roomsData: RoomData[], 
  footerValues: FooterValues,
  sheetId: string = "default"
): Promise<void> => {
  try {
    // Ensure all fields, including empty ones, are explicitly included in the data
    const processedRooms = roomsData.map(room => ({
      ...room,
      name: room.name ?? '',
      location: room.location ?? '',
      roomType: room.roomType ?? '',
      pmt: room.pmt ?? '',
      cacc: room.cacc ?? '',
      rate: room.rate ?? '',
      total: room.total ?? '',
      checkIn: room.checkIn ?? '',
      checkOut: room.checkOut ?? '',
      vehicleDesc: room.vehicleDesc ?? '',
      key: room.key ?? '',
      type: room.type ?? '',
    }));
    
    const dataRef = ref(database, `sheets/${sheetId}`);
    await set(dataRef, {
      rooms: processedRooms,
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

// Helper function to initialize data if it doesn't exist in Firebase
export const initializeFirebaseData = async (
  initialRooms: RoomData[],
  initialFooterValues: FooterValues,
  sheetId: string = "default"
): Promise<boolean> => {
  try {
    const existingData = await loadDataFromFirebase(sheetId);
    
    if (!existingData) {
      await saveDataToFirebase(initialRooms, initialFooterValues, sheetId);
      console.log("Initialized Firebase data successfully");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error initializing Firebase data:", error);
    return false;
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
