
import React from 'react';
import { cn } from '@/lib/utils';

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
}

interface MotelRowProps {
  room: RoomData;
  updateRoom: (id: number, field: string, value: string) => void;
}

const MotelRow: React.FC<MotelRowProps> = ({ room, updateRoom }) => {
  const getRowColor = (type: string, roomNumber: string) => {
    if (type === 'M') return 'bg-motel-purple text-white';
    if (Number(roomNumber) === 16 || Number(roomNumber) === 27) return 'bg-motel-yellow';
    return '';
  };

  const handleChange = (field: keyof RoomData, value: string) => {
    updateRoom(room.id, field, value);
  };
  
  return (
    <tr className={cn("border border-gray-300", getRowColor(room.type, room.roomNumber))}>
      <td className="border border-gray-300 p-1 text-center w-8">
        <input 
          type="text" 
          value={room.type} 
          onChange={(e) => handleChange('type', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none"
          maxLength={2}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-8">
        <input 
          type="text" 
          value={room.roomNumber} 
          onChange={(e) => handleChange('roomNumber', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none"
          readOnly
        />
      </td>
      <td className="border border-gray-300 p-1 w-1/4">
        <input 
          type="text" 
          value={room.name} 
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full bg-transparent focus:outline-none"
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-8">
        <input 
          type="text" 
          value={room.pmt} 
          onChange={(e) => handleChange('pmt', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none"
          maxLength={2}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-16">
        <input 
          type="text" 
          value={room.rate} 
          onChange={(e) => handleChange('rate', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none"
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-16">
        <input 
          type="text" 
          value={room.total} 
          onChange={(e) => handleChange('total', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none"
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-16">
        <input 
          type="text" 
          value={room.checkIn} 
          onChange={(e) => handleChange('checkIn', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none"
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-16">
        <input 
          type="text" 
          value={room.checkOut} 
          onChange={(e) => handleChange('checkOut', e.target.value)}
          className="w-full bg-transparent text-center focus:outline-none"
        />
      </td>
      <td className="border border-gray-300 p-1 w-1/4">
        <input 
          type="text" 
          value={room.vehicleDesc} 
          onChange={(e) => handleChange('vehicleDesc', e.target.value)}
          className="w-full bg-transparent focus:outline-none"
        />
      </td>
    </tr>
  );
};

export default MotelRow;
