
import React, { useState, useEffect } from 'react';

interface TotalColumnInputProps {
  roomId: number;
  roomNumber: string | number;
  initialValue: string;
  readOnly?: boolean;
  backgroundColor?: string;
  rowType?: string;
  onUpdate: (id: number, field: string, value: string) => void;
}

const TotalColumnInput: React.FC<TotalColumnInputProps> = ({
  roomId,
  roomNumber,
  initialValue,
  readOnly = false,
  backgroundColor,
  rowType,
  onUpdate
}) => {
  const [value, setValue] = useState('');
  
  // Update local value when prop changes, but only if it's explicitly set
  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
    }
  }, [initialValue]);
  
  // Determine if input should actually be readonly
  // Room 2 is a special case - it should always be editable
  // Also, make sure rows with background colors can be edited if they aren't marked as readOnly
  const actuallyReadOnly = isRoom2 ? false : readOnly;
  
  // Special styling for row 2
  const isRoom2 = Number(roomNumber) === 2;
  
  // Handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  
  // Handle blur (update parent)
  const handleBlur = () => {
    onUpdate(roomId, 'total', value);
  };
  
  // Ensure text is visible based on background
  const textColor = getTextColor();
  
  // Calculate input style with appropriate text color
  const inputStyle = {
    color: textColor,
    opacity: '1',
    background: 'transparent',
  };
  
  // Determine the text color based on room properties
  function getTextColor() {
    // Special case for room 2
    if (isRoom2) {
      return '#000000';
    }
    
    // For purple or blue backgrounds (type M or W)
    if (rowType === 'M' || rowType === 'W' || 
        (backgroundColor && ['#6c5fc7', '#3b82f6'].includes(backgroundColor))) {
      return '#FFFFFF';
    }
    
    // For yellow background
    if (backgroundColor && backgroundColor === '#fcd34d') {
      return '#000000';
    }
    
    // Default
    return '#000000';
  }
  
  const inputClassName = `w-full text-center focus:outline-none font-medium ${isRoom2 ? 'room2-total' : ''}`;
  
  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      className={inputClassName}
      style={inputStyle}
      readOnly={actuallyReadOnly}
      data-room-id={roomId}
      data-room-number={roomNumber}
    />
  );
};

export default TotalColumnInput;
