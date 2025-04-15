
import React from 'react';

interface RoomInputCellProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
  style: React.CSSProperties;
  className?: string;
  maxLength?: number;
  readOnly?: boolean;
}

const RoomInputCell: React.FC<RoomInputCellProps> = ({
  value,
  onChange,
  onBlur,
  style,
  className = "w-full bg-transparent text-center focus:outline-none font-medium",
  maxLength,
  readOnly = false
}) => {
  return (
    <input 
      type="text" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => onBlur(e.target.value)}
      className={className}
      style={style}
      maxLength={maxLength}
      readOnly={readOnly}
    />
  );
};

export default RoomInputCell;
