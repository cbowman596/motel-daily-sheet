import React, { memo, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { RoomData } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import TotalColumnInput from './TotalColumnInput';
import RoomInputCell from './RoomInputCell';
import { useRoomDefaults } from '@/hooks/useRoomDefaults';
import { useRoomStyles } from '@/hooks/useRoomStyles';

interface MotelRowProps {
  room: RoomData;
  updateRoom: (id: number, field: string, value: string) => void;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
}

const MotelRow: React.FC<MotelRowProps> = memo(({ room, updateRoom, isSelected, onToggleSelect }) => {
  const { defaultLocation, defaultRoomType } = useRoomDefaults(room.roomNumber);
  const { rowClass, rowStyle, inputStyle } = useRoomStyles({
    backgroundColor: room.backgroundColor,
    textColor: room.textColor,
    type: room.type
  });

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

  useEffect(() => {
    setLocalInputs(prev => ({
      ...prev,
      name: room.name ?? '',
      location: room.location ?? '',
      roomType: room.roomType ?? '',
      type: room.type ?? '',
      pmt: room.pmt ?? '',
      cacc: room.cacc ?? '',
      rate: room.rate ?? '',
      total: room.total ?? '',
      checkIn: room.checkIn ?? '',
      checkOut: room.checkOut ?? '',
      vehicleDesc: room.vehicleDesc ?? '',
      key: room.key ?? '',
    }));
  }, [room]);

  useEffect(() => {
    if (!room.location) {
      updateRoom(room.id, 'location', defaultLocation);
    }
  }, [room.id, defaultLocation, room.location, updateRoom]);

  useEffect(() => {
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

  const isRoom2 = Number(room.roomNumber) === 2;
  const isTotalReadOnly = 
    (!room.backgroundColor && room.type !== 'M' && 
    (room.type === 'N' || (room.type === 'W' && !isRoom2)));

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
      data-room-type={localInputs.type}
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
        <RoomInputCell
          value={room.roomNumber}
          onChange={() => {}}
          onBlur={() => {}}
          style={inputStyle}
          readOnly
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-10">
        <RoomInputCell
          value={localInputs.location || defaultLocation}
          onChange={(value) => handleInputChange('location', value)}
          onBlur={(value) => handleInputBlur('location', value)}
          style={inputStyle}
          maxLength={3}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-12">
        <RoomInputCell
          value={localInputs.roomType || defaultRoomType}
          onChange={(value) => handleInputChange('roomType', value)}
          onBlur={(value) => handleInputBlur('roomType', value)}
          style={inputStyle}
          maxLength={8}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-8">
        <RoomInputCell
          value={localInputs.type}
          onChange={(value) => handleInputChange('type', value)}
          onBlur={(value) => handleInputBlur('type', value)}
          style={inputStyle}
          maxLength={2}
        />
      </td>
      <td className="border border-gray-300 p-1 w-1/6">
        <RoomInputCell
          value={localInputs.name}
          onChange={(value) => handleInputChange('name', value)}
          onBlur={(value) => handleInputBlur('name', value)}
          style={inputStyle}
          className="w-full bg-transparent focus:outline-none font-medium"
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-16">
        <RoomInputCell
          value={localInputs.pmt}
          onChange={(value) => handleInputChange('pmt', value)}
          onBlur={(value) => handleInputBlur('pmt', value)}
          style={inputStyle}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-12">
        <RoomInputCell
          value={localInputs.cacc}
          onChange={(value) => handleInputChange('cacc', value)}
          onBlur={(value) => handleInputBlur('cacc', value)}
          style={inputStyle}
          maxLength={2}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-24">
        <RoomInputCell
          value={localInputs.rate}
          onChange={(value) => handleInputChange('rate', value)}
          onBlur={(value) => handleInputBlur('rate', value)}
          style={inputStyle}
        />
      </td>
      <td className={`border border-gray-300 p-1 text-center w-16 total-column ${Number(room.roomNumber) === 2 || localInputs.type === 'M' ? 'force-visible' : ''}`}>
        <TotalColumnInput
          roomId={room.id}
          roomNumber={room.roomNumber}
          initialValue={localInputs.total}
          readOnly={isTotalReadOnly}
          backgroundColor={rowStyle.backgroundColor}
          rowType={localInputs.type}
          onUpdate={updateRoom}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-16">
        <RoomInputCell
          value={localInputs.checkIn}
          onChange={(value) => handleInputChange('checkIn', value)}
          onBlur={(value) => handleInputBlur('checkIn', value)}
          style={inputStyle}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-16">
        <RoomInputCell
          value={localInputs.checkOut}
          onChange={(value) => handleInputChange('checkOut', value)}
          onBlur={(value) => handleInputBlur('checkOut', value)}
          style={inputStyle}
        />
      </td>
      <td className="border border-gray-300 p-1 text-center w-8">
        <RoomInputCell
          value={localInputs.key}
          onChange={(value) => handleInputChange('key', value)}
          onBlur={(value) => handleInputBlur('key', value)}
          style={inputStyle}
          maxLength={1}
        />
      </td>
      <td className="border border-gray-300 p-1 w-1/5">
        <RoomInputCell
          value={localInputs.vehicleDesc}
          onChange={(value) => handleInputChange('vehicleDesc', value)}
          onBlur={(value) => handleInputBlur('vehicleDesc', value)}
          style={inputStyle}
          className="w-full bg-transparent focus:outline-none font-medium"
        />
      </td>
    </tr>
  );
});

MotelRow.displayName = 'MotelRow';

export default MotelRow;
