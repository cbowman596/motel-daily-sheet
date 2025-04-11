
import React, { useEffect, memo } from 'react';
import { cn } from '@/lib/utils';
import { RoomData } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';

interface MotelRowProps {
  room: RoomData;
  updateRoom: (id: number, field: string, value: string) => void;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
}

const MotelRow: React.FC<MotelRowProps> = memo(({ room, updateRoom, isSelected, onToggleSelect }) => {
  const getRowStyle = () => {
    if (room.backgroundColor) {
      return {
        backgroundColor: room.backgroundColor,
        color: '#FFFFFF'
      };
    }
    return {};
  };
  
  const getRowClass = () => {
    if (room.backgroundColor) return 'text-white';
    if (room.type === 'W') return 'bg-motel-purple text-white';
    if (room.type === 'M') return 'bg-motel-blue text-white';
    if (Number(room.roomNumber) === 16 || Number(room.roomNumber) === 27) return 'bg-motel-yellow text-black';
    return '';
  };

  // Pre-calculate these values to avoid recalculating them in multiple places
  const location = React.useMemo(() => {
    if (room.location) return room.location;
    
    const roomNum = Number(room.roomNumber);
    if (roomNum >= 1 && roomNum <= 6) return 'FB';
    if (roomNum >= 7 && roomNum <= 12) return 'BR';
    if (roomNum >= 13 && roomNum <= 19) return 'FT';
    if (roomNum >= 20 && roomNum <= 26) return 'BT';
    if (roomNum >= 28 && roomNum <= 30) return 'ST';
    if (roomNum === 27) return 'LFT';
    if (roomNum === 16) return 'CAB';
    return '';
  }, [room.location, room.roomNumber]);
  
  const roomType = React.useMemo(() => {
    if (room.roomType) return room.roomType;
    
    const roomNum = Number(room.roomNumber);
    if (roomNum === 1) return '1K Kit';
    if ([6, 13, 19].includes(roomNum)) return '2Q Kit';
    if ([2, 3, 4, 5, 7, 8, 14, 15, 17, 18, 20, 21, 22].includes(roomNum)) return '1Q Kit';
    if ([24, 25, 26, 28, 29, 30].includes(roomNum)) return '1Q';
    if ([9, 10, 11].includes(roomNum)) return '1F Kit';
    if ([12, 16].includes(roomNum)) return '1F';
    if (room.roomNumber === 'Cabin') return '1Q Kit';
    if (room.roomNumber === 'Loft') return '1Q';
    return '';
  }, [room.roomType, room.roomNumber]);
  
  // Run effects only when needed values change
  useEffect(() => {
    if (!room.location) {
      updateRoom(room.id, 'location', location);
    }
  }, [room.id, location, room.location, updateRoom]);

  useEffect(() => {
    if (!room.roomType) {
      updateRoom(room.id, 'roomType', roomType);
    }
  }, [room.id, roomType, room.roomType, updateRoom]);

  // Separate effect for rate calculation
  useEffect(() => {
    if (room.type === 'N' && room.rate) {
      const baseRate = parseFloat(room.rate) || 0;
      const total = (baseRate * 1.049).toFixed(2);
      if (total !== room.total) {
        updateRoom(room.id, 'total', total);
      }
    }
  }, [room.type, room.rate, room.id, room.total, updateRoom]);

  // Memoize handlers to prevent recreating them on each render
  const handleChange = React.useCallback((field: string, value: string) => {
    updateRoom(room.id, field, value);
  }, [room.id, updateRoom]);
  
  // Memoize styles to prevent recalculation on each render
  const rowStyle = React.useMemo(() => getRowStyle(), [room.backgroundColor]);
  const rowClass = React.useMemo(() => getRowClass(), [room.backgroundColor, room.type, room.roomNumber]);
  
  const inputStyle = React.useMemo(() => ({
    color: (room.backgroundColor || room.type === 'W' || room.type === 'M') ? '#FFFFFF' : 'inherit'
  }), [room.backgroundColor, room.type]);
  
  return (
    <tr 
      className={cn(
        "border border-gray-300 font-medium",
        rowClass,
        isSelected ? 'ring-2 ring-blue-500' : ''
      )}
      style={rowStyle}
    >
      <td className="border border-gray-300 p-1 text-center w-8">
        <div className="flex items-center justify-center">
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={() => onToggleSelect(room.id)}
            className="mr-1"
          />
        </div>
      </td>
      <td className="border border-gray-300 p-1 text-center w-8">
        <input 
          type="text" 
          value={room.roomNumber} 
          onChange={(e) => handleChange('roomNumber', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={inputStyle}
          readOnly
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-10">
        <input 
          type="text" 
          value={room.location || location} 
          onChange={(e) => handleChange('location', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={inputStyle}
          maxLength={3}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-24">
        <input 
          type="text" 
          value={room.roomType || roomType} 
          onChange={(e) => handleChange('roomType', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={inputStyle}
          maxLength={8}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-8">
        <input 
          type="text" 
          value={room.type} 
          onChange={(e) => handleChange('type', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={inputStyle}
          maxLength={2}
        />
      </td>
      <td className="border border-gray-300 p-1 w-1/4">
        <input 
          type="text" 
          value={room.name} 
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full bg-transparent focus:outline-none font-medium"
          style={inputStyle}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-8">
        <input 
          type="text" 
          value={room.pmt} 
          onChange={(e) => handleChange('pmt', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={inputStyle}
          maxLength={2}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-20">
        <input 
          type="text" 
          value={room.rate} 
          onChange={(e) => handleChange('rate', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={inputStyle}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-16">
        <input 
          type="text" 
          value={room.total} 
          onChange={(e) => handleChange('total', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={inputStyle}
          readOnly={room.type === 'N'}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-16">
        <input 
          type="text" 
          value={room.checkIn} 
          onChange={(e) => handleChange('checkIn', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={inputStyle}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-16">
        <input 
          type="text" 
          value={room.checkOut} 
          onChange={(e) => handleChange('checkOut', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={inputStyle}
        />
      </td>
      <td className="border border-gray-300 p-1 w-1/4">
        <input 
          type="text" 
          value={room.vehicleDesc} 
          onChange={(e) => handleChange('vehicleDesc', e.target.value)}
          className="w-full bg-transparent focus:outline-none font-medium"
          style={inputStyle}
        />
      </td>
    </tr>
  );
});

MotelRow.displayName = 'MotelRow';

export default MotelRow;
