
import React from 'react';
import { RoomData } from '@/types';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface MotelRowProps {
  room: RoomData;
  updateRoom: (id: number, field: string, value: string) => void;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
}

const MotelRow: React.FC<MotelRowProps> = ({ room, updateRoom, isSelected, onToggleSelect }) => {
  // Apply custom styles based on room.backgroundColor and room.textColor
  const customStyle = {
    backgroundColor: room.backgroundColor || '',
    color: room.textColor || ''
  };

  return (
    <tr key={room.id} style={customStyle}>
      <td className="border border-gray-300 p-1 text-center" style={customStyle}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(room.id)}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center" style={customStyle}>
        <Input 
          value={room.location || ''} 
          onChange={(e) => updateRoom(room.id, 'location', e.target.value)}
          className="h-8 min-h-8 bg-transparent border-0 p-1 text-center"
          style={customStyle}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center" style={customStyle}>
        <Input 
          value={room.roomType || ''} 
          onChange={(e) => updateRoom(room.id, 'roomType', e.target.value)}
          className="h-8 min-h-8 bg-transparent border-0 p-1 text-center"
          style={customStyle}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center" style={customStyle}>
        <Input 
          value={room.type || ''} 
          onChange={(e) => updateRoom(room.id, 'type', e.target.value)}
          className="h-8 min-h-8 bg-transparent border-0 p-1 text-center"
          style={customStyle}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center" style={customStyle}>
        <Input 
          value={room.roomNumber || ''} 
          onChange={(e) => updateRoom(room.id, 'roomNumber', e.target.value)}
          className="h-8 min-h-8 bg-transparent border-0 p-1"
          style={customStyle}
        />
      </td>
      <td className="name-column border border-gray-300 p-1">
        <Input 
          value={room.name || ''} 
          onChange={(e) => updateRoom(room.id, 'name', e.target.value)}
          className="h-8 min-h-8 bg-transparent border-0 p-1"
        />
      </td>
      <td className="pmt-column border border-gray-300 p-1 text-center">
        <Input 
          value={room.pmt || ''} 
          onChange={(e) => updateRoom(room.id, 'pmt', e.target.value)}
          className="h-8 min-h-8 bg-transparent border-0 p-1 text-center"
        />
      </td>
      <td className="rate-column border border-gray-300 p-1">
        <Input 
          value={room.rate || ''} 
          onChange={(e) => updateRoom(room.id, 'rate', e.target.value)}
          className="h-8 min-h-8 bg-transparent border-0 p-1"
        />
      </td>
      <td className="total-column border border-gray-300 p-1">
        <Input 
          value={room.total || ''} 
          onChange={(e) => updateRoom(room.id, 'total', e.target.value)}
          className="h-8 min-h-8 bg-transparent border-0 p-1"
        />
      </td>
      <td className="checkin-column border border-gray-300 p-1">
        <Input 
          value={room.checkIn || ''} 
          onChange={(e) => updateRoom(room.id, 'checkIn', e.target.value)}
          className="h-8 min-h-8 bg-transparent border-0 p-1"
        />
      </td>
      <td className="checkout-column border border-gray-300 p-1">
        <Input 
          value={room.checkOut || ''} 
          onChange={(e) => updateRoom(room.id, 'checkOut', e.target.value)}
          className="h-8 min-h-8 bg-transparent border-0 p-1"
        />
      </td>
      <td className="vehicle-column border border-gray-300 p-1">
        <Input 
          value={room.vehicleDesc || ''} 
          onChange={(e) => updateRoom(room.id, 'vehicleDesc', e.target.value)}
          className="h-8 min-h-8 bg-transparent border-0 p-1"
        />
      </td>
    </tr>
  );
};

export default MotelRow;
