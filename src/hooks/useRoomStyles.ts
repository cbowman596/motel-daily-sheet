
import { useMemo } from 'react';

interface RoomStylesProps {
  backgroundColor?: string;
  textColor?: string;
  type?: string;
}

export const useRoomStyles = ({ backgroundColor, textColor, type }: RoomStylesProps) => {
  const rowClass = useMemo(() => {
    if (backgroundColor) return 'text-white';
    if (type === 'M') return 'bg-motel-purple text-white';
    if (type === 'W') return 'bg-motel-blue text-white';
    return '';
  }, [backgroundColor, type]);

  const rowStyle = useMemo(() => {
    if (backgroundColor) {
      return {
        backgroundColor,
        color: textColor || '#FFFFFF'
      };
    }
    
    if (type === 'M') {
      return { backgroundColor: '#6c5fc7', color: '#FFFFFF' };
    }
    if (type === 'W') {
      return { backgroundColor: '#3b82f6', color: '#FFFFFF' };
    }
    
    return {};
  }, [backgroundColor, textColor, type]);

  const inputStyle = useMemo(() => {
    let textColor = '#000000';
    
    if (backgroundColor || type === 'M' || type === 'W') {
      textColor = '#FFFFFF';
    }
    
    return { color: textColor };
  }, [backgroundColor, type]);

  return { rowClass, rowStyle, inputStyle };
};
