
// Define RoomData interface directly in types file rather than importing it
export interface RoomData {
  id: number;
  type: string;
  roomNumber: string;
  name: string;
  pmt: string;
  rate: string;
  total: string;
  checkIn: string;
  checkOut: string;
  vehicleDesc: string;
  backgroundColor?: string;
  textColor?: string;
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
