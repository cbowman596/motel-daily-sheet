
import React, { memo, useState, useCallback } from 'react';
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
  // Store the local input values to prevent lag
  const [localInputs, setLocalInputs] = useState({
    name: room.name || '',
    location: room.location || '',
    roomType: room.roomType || '',
    type: room.type || '',
    pmt: room.pmt || '',
    rate: room.rate || '',
    total: room.total || '',
    checkIn: room.checkIn || '',
    checkOut: room.checkOut || '',
    vehicleDesc: room.vehicleDesc || '',
  });
  
  // Calculate styles once
  const rowStyle = React.useMemo(() => {
    if (room.backgroundColor) {
      return {
        backgroundColor: room.backgroundColor,
        color: room.textColor || '#FFFFFF'
      };
    }
    return {};
  }, [room.backgroundColor, room.textColor]);
  
  const rowClass = React.useMemo(() => {
    if (room.backgroundColor) return 'text-white';
    if (room.type === 'W') return 'bg-motel-purple text-white';
    if (room.type === 'M') return 'bg-motel-blue text-white';
    if (Number(room.roomNumber) === 16 || Number(room.roomNumber) === 27) return 'bg-motel-yellow text-black';
    return '';
  }, [room.backgroundColor, room.type, room.roomNumber]);
  
  // Simplified input style logic to ensure text is visible
  const inputStyle = React.useMemo(() => {
    // Default to black text for standard rows
    let textColor = '#000000';
    
    // If the row has a background color or is a specific type, use white text
    if (room.backgroundColor || room.type === 'W' || room.type === 'M') {
      textColor = '#FFFFFF';
    }
    
    // Special case for yellow rows
    if (Number(room.roomNumber) === 16 || Number(room.roomNumber) === 27) {
      textColor = '#000000';
    }
    
    return { color: textColor };
  }, [room.backgroundColor, room.type, room.roomNumber]);

  // Properly determine total column text color based on background
  const totalInputStyle = React.useMemo(() => {
    // For colored backgrounds (purple, blue), use white text
    if ((room.type === 'W') || 
        (room.type === 'M') || 
        (room.backgroundColor && ['#6c5fc7', '#3b82f6'].includes(room.backgroundColor))) {
      return { color: '#FFFFFF' };
    }
    
    // For yellow background or room numbers 16 and 27, use black text
    if (Number(room.roomNumber) === 16 || 
        Number(room.roomNumber) === 27 || 
        (room.backgroundColor && room.backgroundColor === '#fcd34d')) {
      return { color: '#000000' };
    }
    
    // Default to black text
    return { color: '#000000' };
  }, [room.backgroundColor, room.type, room.roomNumber]);
  
  // Pre-calculate these values to avoid recalculating them in multiple places
  const defaultLocation = React.useMemo(() => {
    const roomNum = Number(room.roomNumber);
    if (roomNum >= 1 && roomNum <= 6) return 'FB';
    if (roomNum >= 7 && roomNum <= 12) return 'BR';
    if (roomNum >= 13 && roomNum <= 19) return 'FT';
    if (roomNum >= 20 && roomNum <= 26) return 'BT';
    if (roomNum >= 28 && roomNum <= 30) return 'ST';
    if (roomNum === 27) return 'LFT';
    if (roomNum === 16) return 'CAB';
    return '';
  }, [room.roomNumber]);
  
  const defaultRoomType = React.useMemo(() => {
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
  }, [room.roomNumber]);
  
  // Update local inputs when props change
  React.useEffect(() => {
    setLocalInputs(prev => ({
      ...prev,
      name: room.name || prev.name,
      location: room.location || prev.location,
      roomType: room.roomType || prev.roomType,
      type: room.type || prev.type,
      pmt: room.pmt || prev.pmt,
      rate: room.rate || prev.rate,
      total: room.total || prev.total,
      checkIn: room.checkIn || prev.checkIn,
      checkOut: room.checkOut || prev.checkOut,
      vehicleDesc: room.vehicleDesc || prev.vehicleDesc,
    }));
  }, [room]);
  
  // Apply defaults for location and room type
  React.useEffect(() => {
    if (!room.location) {
      updateRoom(room.id, 'location', defaultLocation);
    }
  }, [room.id, defaultLocation, room.location, updateRoom]);

  React.useEffect(() => {
    if (!room.roomType) {
      updateRoom(room.id, 'roomType', defaultRoomType);
    }
  }, [room.id, defaultRoomType, room.roomType, updateRoom]);

  // Calculate total from rate for nightly and weekly rooms
  React.useEffect(() => {
    if ((room.type === 'N' || room.type === 'W') && room.rate) {
      const baseRate = parseFloat(room.rate) || 0;
      const total = (baseRate * 1.049).toFixed(2);
      if (total !== room.total) {
        updateRoom(room.id, 'total', total);
      }
    }
  }, [room.type, room.rate, room.id, room.total, updateRoom]);

  // Debounced update function to reduce state updates
  const handleInputChange = useCallback((field: string, value: string) => {
    setLocalInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  // Update parent state with debounce
  const handleInputBlur = useCallback((field: string, value: string) => {
    updateRoom(room.id, field, value);
  }, [room.id, updateRoom]);
  
  return (
    <tr 
      className={cn(
        "border border-gray-300 font-medium",
        rowClass,
        isSelected ? 'ring-2 ring-blue-500' : ''
      )}
      style={rowStyle}
      data-room-id={room.id}
      data-room-number={room.roomNumber}
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
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={inputStyle}
          readOnly
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-10">
        <input 
          type="text" 
          value={localInputs.location || defaultLocation} 
          onChange={(e) => handleInputChange('location', e.target.value)}
          onBlur={(e) => handleInputBlur('location', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={inputStyle}
          maxLength={3}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-24">
        <input 
          type="text" 
          value={localInputs.roomType || defaultRoomType} 
          onChange={(e) => handleInputChange('roomType', e.target.value)}
          onBlur={(e) => handleInputBlur('roomType', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={inputStyle}
          maxLength={8}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-8">
        <input 
          type="text" 
          value={localInputs.type} 
          onChange={(e) => handleInputChange('type', e.target.value)}
          onBlur={(e) => handleInputBlur('type', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={inputStyle}
          maxLength={2}
        />
      </td>
      <td className="border border-gray-300 p-1 w-1/4">
        <input 
          type="text" 
          value={localInputs.name} 
          onChange={(e) => handleInputChange('name', e.target.value)}
          onBlur={(e) => handleInputBlur('name', e.target.value)}
          className="w-full bg-transparent focus:outline-none font-medium"
          style={inputStyle}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-8">
        <input 
          type="text" 
          value={localInputs.pmt} 
          onChange={(e) => handleInputChange('pmt', e.target.value)}
          onBlur={(e) => handleInputBlur('pmt', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={inputStyle}
          maxLength={2}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-20">
        <input 
          type="text" 
          value={localInputs.rate} 
          onChange={(e) => handleInputChange('rate', e.target.value)}
          onBlur={(e) => handleInputBlur('rate', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={inputStyle}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-16 total-column">
        <input 
          type="text" 
          value={localInputs.total} 
          onChange={(e) => handleInputChange('total', e.target.value)}
          onBlur={(e) => handleInputBlur('total', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={totalInputStyle}
          readOnly={room.type === 'N' || room.type === 'W'}
          data-room-id={room.id}
          data-room-number={room.roomNumber}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-16">
        <input 
          type="text" 
          value={localInputs.checkIn} 
          onChange={(e) => handleInputChange('checkIn', e.target.value)}
          onBlur={(e) => handleInputBlur('checkIn', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={inputStyle}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-16">
        <input 
          type="text" 
          value={localInputs.checkOut} 
          onChange={(e) => handleInputChange('checkOut', e.target.value)}
          onBlur={(e) => handleInputBlur('checkOut', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={inputStyle}
        />
      </td>
      <td className="border border-gray-300 p-1 w-1/4">
        <input 
          type="text" 
          value={localInputs.vehicleDesc} 
          onChange={(e) => handleInputChange('vehicleDesc', e.target.value)}
          onBlur={(e) => handleInputBlur('vehicleDesc', e.target.value)}
          className="w-full bg-transparent focus:outline-none font-medium"
          style={inputStyle}
        />
      </td>
    </tr>
  );
});

MotelRow.displayName = 'MotelRow';

export default MotelRow;
