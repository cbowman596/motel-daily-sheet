
import { RoomData as OriginalRoomData } from '@/components/MotelRow';

// Extend the RoomData type to include color information
export interface RoomData extends Omit<OriginalRoomData, 'id'> {
  id: number;
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
