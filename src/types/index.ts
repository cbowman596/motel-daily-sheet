// Define RoomData interface directly in types file rather than importing it
export interface RoomData {
  id: number;
  type: string;
  roomNumber: string;
  name: string;
  pmt: string;
  cacc: string; // New field for Cash/Credit Card
  rate: string;
  total: string;
  checkIn: string;
  checkOut: string;
  vehicleDesc: string;
  backgroundColor?: string;
  textColor?: string;
  location?: string;
  roomType?: string;
}

export interface FooterValues {
  showers: string;
  bhd: string;
  refunds: string;
  motel: string;
  returns: string;
  airbnb: string;
  cash: string;
  card: string;
  gt: string;
}
