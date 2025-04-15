import React, { memo, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { RoomData } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import TotalColumnInput from './TotalColumnInput';

interface MotelRowProps {
  room: RoomData;
  updateRoom: (id: number, field: string, value: string) => void;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
}

const MotelRow: React.FC<MotelRowProps> = memo(({ room, updateRoom, isSelected, onToggleSelect }) => {
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

  const [localInputs, setLocalInputs] = useState({
    name: room.name || '',
    location: room.location || '',
    roomType: room.roomType || '',
    type: room.type || '',
    pmt: room.pmt || '',
    cacc: room.cacc || '',
    rate: room.rate || '',
    total: room.total || '',
    checkIn: room.checkIn || '',
    checkOut: room.checkOut || '',
    vehicleDesc: room.vehicleDesc || '',
    key: room.key || '',
  });

  const rowClass = React.useMemo(() => {
    if (room.backgroundColor) return 'text-white';
    if (localInputs.type === 'M') return 'bg-motel-purple text-white';
    if (localInputs.type === 'W') return 'bg-motel-blue text-white';
    return '';
  }, [room.backgroundColor, localInputs.type]);
  
  const rowStyle = React.useMemo(() => {
    if (room.backgroundColor) {
      return {
        backgroundColor: room.backgroundColor,
        color: room.textColor || '#FFFFFF'
      };
    }
    
    if (localInputs.type === 'M') {
      return { backgroundColor: '#6c5fc7', color: '#FFFFFF' };
    }
    if (localInputs.type === 'W') {
      return { backgroundColor: '#3b82f6', color: '#FFFFFF' };
    }
    
    return {};
  }, [room.backgroundColor, room.textColor, localInputs.type]);
  
  const inputStyle = React.useMemo(() => {
    let textColor = '#000000';
    
    if (room.backgroundColor || localInputs.type === 'M' || localInputs.type === 'W') {
      textColor = '#FFFFFF';
    }
    
    return { color: textColor };
  }, [room.backgroundColor, localInputs.type]);

  React.useEffect(() => {
    setLocalInputs(prev => ({
      ...prev,
      name: room.name || prev.name,
      location: room.location || prev.location,
      roomType: room.roomType || prev.roomType,
      type: room.type || prev.type,
      pmt: room.pmt || prev.pmt,
      cacc: room.cacc || prev.cacc,
      rate: room.rate || prev.rate,
      total: room.total || prev.total,
      checkIn: room.checkIn || prev.checkIn,
      checkOut: room.checkOut || prev.checkOut,
      vehicleDesc: room.vehicleDesc || prev.vehicleDesc,
      key: room.key || prev.key,
    }));
  }, [room]);
  
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

  const handleInputChange = useCallback((field: string, value: string) => {
    setLocalInputs(prev => ({ ...prev, [field]: value }));
    
    if (field === 'type') {
      updateRoom(room.id, field, value);
    }
  }, [room.id, updateRoom]);

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
      <td className="border border-gray-300 p-1 text-center w-6">
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
      <td className="border border-gray-300 p-1 text-center w-12">
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
      <td className="border border-gray-300 p-1 w-1/6">
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
      <td className="border border-gray-300 p-1 text-center w-12">
        <input 
          type="text" 
          value={localInputs.cacc} 
          onChange={(e) => handleInputChange('cacc', e.target.value)}
          onBlur={(e) => handleInputBlur('cacc', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={inputStyle}
          maxLength={2}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-24">
        <input 
          type="text" 
          value={localInputs.rate} 
          onChange={(e) => handleInputChange('rate', e.target.value)}
          onBlur={(e) => handleInputBlur('rate', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={inputStyle}
        />
      </td>
      <td className={`border border-gray-300 p-1 text-center w-16 total-column ${Number(room.roomNumber) === 2 ? 'force-visible' : ''}`}>
        <TotalColumnInput
          roomId={room.id}
          roomNumber={room.roomNumber}
          initialValue={localInputs.total}
          readOnly={localInputs.type === 'N' || localInputs.type === 'W' && Number(room.roomNumber) !== 2}
          backgroundColor={rowStyle.backgroundColor}
          rowType={localInputs.type}
          onUpdate={updateRoom}
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
      <td className="border border-gray-300 p-1 text-center w-8">
        <input 
          type="text" 
          value={localInputs.key} 
          onChange={(e) => handleInputChange('key', e.target.value)}
          onBlur={(e) => handleInputBlur('key', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none font-medium"
          style={inputStyle}
          maxLength={1}
        />
      </td>
      <td className="border border-gray-300 p-1 w-1/5">
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
