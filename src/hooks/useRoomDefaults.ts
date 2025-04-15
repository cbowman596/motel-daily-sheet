
import { useMemo } from 'react';

export const useRoomDefaults = (roomNumber: string | number) => {
  const defaultLocation = useMemo(() => {
    const roomNum = Number(roomNumber);
    if (roomNum >= 1 && roomNum <= 6) return 'FB';
    if (roomNum >= 7 && roomNum <= 12) return 'BR';
    if (roomNum >= 13 && roomNum <= 19) return 'FT';
    if (roomNum >= 20 && roomNum <= 26) return 'BT';
    if (roomNum >= 28 && roomNum <= 30) return 'ST';
    if (roomNum === 27) return 'LFT';
    if (roomNum === 16) return 'CAB';
    return '';
  }, [roomNumber]);

  const defaultRoomType = useMemo(() => {
    const roomNum = Number(roomNumber);
    if (roomNum === 1) return '1K Kit';
    if ([6, 13, 19].includes(roomNum)) return '2Q Kit';
    if ([2, 3, 4, 5, 7, 8, 14, 15, 17, 18, 20, 21, 22].includes(roomNum)) return '1Q Kit';
    if ([24, 25, 26, 28, 29, 30].includes(roomNum)) return '1Q';
    if ([9, 10, 11].includes(roomNum)) return '1F Kit';
    if ([12, 16].includes(roomNum)) return '1F';
    if (roomNumber === 'Cabin') return '1Q Kit';
    if (roomNumber === 'Loft') return '1Q';
    return '';
  }, [roomNumber]);

  return { defaultLocation, defaultRoomType };
};
