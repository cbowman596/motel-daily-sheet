
import { RoomData, FooterValues } from '@/types';

// Compress and encode data to a URL-safe string
export const encodeDataToUrl = (rooms: RoomData[], footerValues: FooterValues): string => {
  try {
    // Create a minimal version of the data to reduce URL size
    const minimalData = {
      r: rooms.map(room => ({
        i: room.id,
        t: room.type || '',
        n: room.name || '',
        rn: room.roomNumber,
        p: room.pmt || '',
        rt: room.rate || '',
        tt: room.total || '',
        ci: room.checkIn || '',
        co: room.checkOut || '',
        v: room.vehicleDesc || '',
        bg: room.backgroundColor,
        tc: room.textColor,
        l: room.location,
        rt2: room.roomType
      })),
      f: footerValues
    };
    
    // Convert to JSON, compress using base64
    const jsonStr = JSON.stringify(minimalData);
    const encodedData = btoa(jsonStr);
    
    return encodedData;
  } catch (error) {
    console.error('Error encoding data to URL:', error);
    return '';
  }
};

// Decode data from URL and reconstruct the full objects
export const decodeDataFromUrl = (encodedData: string): { rooms: RoomData[], footerValues: FooterValues } | null => {
  try {
    // Decode base64 string
    const jsonStr = atob(encodedData);
    const minimalData = JSON.parse(jsonStr);
    
    // Rebuild full room data objects
    const rooms: RoomData[] = minimalData.r.map((r: any) => ({
      id: r.i,
      type: r.t || '',
      roomNumber: r.rn,
      name: r.n || '',
      pmt: r.p || '',
      rate: r.rt || '',
      total: r.tt || '',
      checkIn: r.ci || '',
      checkOut: r.co || '',
      vehicleDesc: r.v || '',
      backgroundColor: r.bg,
      textColor: r.tc,
      location: r.l,
      roomType: r.rt2
    }));
    
    return {
      rooms,
      footerValues: minimalData.f
    };
  } catch (error) {
    console.error('Error decoding URL data:', error);
    return null;
  }
};
