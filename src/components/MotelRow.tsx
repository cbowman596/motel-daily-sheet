
import React from 'react';
import { cn } from '@/lib/utils';
import { RoomData } from '@/types';

interface MotelRowProps {
  room: RoomData;
  updateRoom: (id: number, field: string, value: string) => void;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
}

const MotelRow: React.FC<MotelRowProps> = ({ room, updateRoom, isSelected, onToggleSelect }) => {
  // Refactored to handle CSS classes and style properties separately
  const getRowStyle = () => {
    if (room.backgroundColor) {
      return {
        backgroundColor: room.backgroundColor,
        color: room.textColor || 'inherit'
      };
    }
    return {};
  };
  
  const getRowClass = () => {
    if (room.backgroundColor) return '';
    if (room.type === 'M') return 'bg-motel-purple text-white';
    if (Number(room.roomNumber) === 16 || Number(room.roomNumber) === 27) return 'bg-motel-yellow';
    return '';
  };

  const handleChange = (field: keyof RoomData, value: string) => {
    updateRoom(room.id, field, value);
  };
  
  return (
    <tr 
      className={cn(
        "border border-gray-300", 
        getRowClass(),
        isSelected ? 'ring-2 ring-blue-500' : ''
      )}
      style={getRowStyle()}
      onClick={(e) => {
        if ((e.target as HTMLElement).tagName !== 'INPUT') {
          onToggleSelect(room.id);
        }
      }}
    >
      <td className="border border-gray-300 p-1 text-center w-8">
        <input 
          type="text" 
          value={room.type} 
          onChange={(e) => handleChange('type', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none"
          maxLength={2}
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-8">
        <input 
          type="text" 
          value={room.roomNumber} 
          onChange={(e) => handleChange('roomNumber', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none"
          readOnly
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <td className="border border-gray-300 p-1 w-1/4">
        <input 
          type="text" 
          value={room.name} 
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full bg-transparent focus:outline-none"
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-8">
        <input 
          type="text" 
          value={room.pmt} 
          onChange={(e) => handleChange('pmt', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none"
          maxLength={2}
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-16">
        <input 
          type="text" 
          value={room.rate} 
          onChange={(e) => handleChange('rate', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none"
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-16">
        <input 
          type="text" 
          value={room.total} 
          onChange={(e) => handleChange('total', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none"
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-16">
        <input 
          type="text" 
          value={room.checkIn} 
          onChange={(e) => handleChange('checkIn', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none"
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-16">
        <input 
          type="text" 
          value={room.checkOut} 
          onChange={(e) => handleChange('checkOut', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none"
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <td className="border border-gray-300 p-1 w-1/4">
        <input 
          type="text" 
          value={room.vehicleDesc} 
          onChange={(e) => handleChange('vehicleDesc', e.target.value)}
          className="w-full bg-transparent focus:outline-none"
          onClick={(e) => e.stopPropagation()}
        />
      </td>
    </tr>
  );
};

export default MotelRow;
