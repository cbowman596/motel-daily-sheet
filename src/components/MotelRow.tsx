
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
  // Get background color and text color based on room type or custom colors
  const getBgColor = () => {
    if (room.backgroundColor) return room.backgroundColor;
    if (room.type === 'W') return '#3b82f6';  // Blue for weekly
    if (room.type === 'M') return '#6c5fc7';  // Purple for monthly
    if (Number(room.roomNumber) === 16 || Number(room.roomNumber) === 27) return '#fcd34d';  // Yellow for employee rooms
    return '';
  };
  
  const getTextColor = () => {
    if (room.textColor) return room.textColor;
    if (room.type === 'W' || room.type === 'M') return '#FFFFFF';  // White text for blue and purple backgrounds
    return '';
  };

  const rowStyle = {
    backgroundColor: getBgColor(),
    color: getTextColor()
  };

  // Only apply custom styling to the first 5 columns (Selection, Loc, Type, Dur, Room#)
  const colorColumnStyle = rowStyle;
  
  return (
    <tr key={room.id}>
      <td className="border border-gray-300 p-1 text-center" style={colorColumnStyle}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(room.id)}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center" style={colorColumnStyle}>
        <Input 
          value={room.location || ''} 
          onChange={(e) => updateRoom(room.id, 'location', e.target.value)}
          className="h-8 min-h-8 bg-transparent border-0 p-1 text-center"
          style={{ color: getTextColor() }}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center" style={colorColumnStyle}>
        <Input 
          value={room.roomType || ''} 
          onChange={(e) => updateRoom(room.id, 'roomType', e.target.value)}
          className="h-8 min-h-8 bg-transparent border-0 p-1 text-center"
          style={{ color: getTextColor() }}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center" style={colorColumnStyle}>
        <Input 
          value={room.type || ''} 
          onChange={(e) => updateRoom(room.id, 'type', e.target.value)}
          className="h-8 min-h-8 bg-transparent border-0 p-1 text-center"
          style={{ color: getTextColor() }}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center" style={colorColumnStyle}>
        <Input 
          value={room.roomNumber || ''} 
          onChange={(e) => updateRoom(room.id, 'roomNumber', e.target.value)}
          className="h-8 min-h-8 bg-transparent border-0 p-1"
          style={{ color: getTextColor() }}
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
