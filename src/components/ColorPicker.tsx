
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

const PRESET_COLORS = [
  { bg: '#6c5fc7', text: '#FFFFFF', name: 'Purple' },
  { bg: '#fcd34d', text: '#000000', name: 'Yellow' },
  { bg: '#34d399', text: '#000000', name: 'Green' },
  { bg: '#f87171', text: '#000000', name: 'Red' },
  { bg: '#60a5fa', text: '#000000', name: 'Blue' },
  { bg: '#a78bfa', text: '#000000', name: 'Lavender' },
  { bg: '#FFFFFF', text: '#000000', name: 'White' },
];

interface ColorPickerProps {
  selectedRooms: number[];
  applyColorToRooms: (roomIds: number[], bgColor: string, textColor: string) => void;
  clearRoomColors: (roomIds: number[]) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  selectedRooms, 
  applyColorToRooms, 
  clearRoomColors 
}) => {
  const [customBgColor, setCustomBgColor] = useState('#ffffff');
  const [customTextColor, setCustomTextColor] = useState('#000000');

  if (selectedRooms.length === 0) {
    return null;
  }

  const handlePresetClick = (bg: string, text: string) => {
    applyColorToRooms(selectedRooms, bg, text);
    toast.success(`Color applied to ${selectedRooms.length} selected room${selectedRooms.length > 1 ? 's' : ''}`);
  };

  const handleCustomColorApply = () => {
    applyColorToRooms(selectedRooms, customBgColor, customTextColor);
    toast.success(`Custom color applied to ${selectedRooms.length} selected room${selectedRooms.length > 1 ? 's' : ''}`);
  };

  const handleClearColors = () => {
    clearRoomColors(selectedRooms);
    toast.success(`Colors cleared from ${selectedRooms.length} selected room${selectedRooms.length > 1 ? 's' : ''}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">
        {selectedRooms.length} room{selectedRooms.length > 1 ? 's' : ''} selected:
      </span>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            Apply Color
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-4">
            <div className="text-sm font-medium">Preset Colors</div>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_COLORS.map((color, index) => (
                <div
                  key={index}
                  className="h-8 rounded cursor-pointer flex items-center justify-center text-xs"
                  style={{ backgroundColor: color.bg, color: color.text }}
                  onClick={() => handlePresetClick(color.bg, color.text)}
                  title={color.name}
                >
                  {color.name === 'White' ? 'Clear' : ''}
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Custom Color</div>
              <div className="flex space-x-2">
                <div className="space-y-1 flex-1">
                  <label className="text-xs">Background</label>
                  <input 
                    type="color" 
                    value={customBgColor}
                    onChange={(e) => setCustomBgColor(e.target.value)}
                    className="w-full h-8"
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <label className="text-xs">Text</label>
                  <input 
                    type="color"
                    value={customTextColor} 
                    onChange={(e) => setCustomTextColor(e.target.value)}
                    className="w-full h-8"
                  />
                </div>
              </div>
              <Button 
                onClick={handleCustomColorApply}
                className="w-full"
                size="sm"
              >
                Apply Custom Color
              </Button>
            </div>
            
            <Button 
              onClick={handleClearColors} 
              variant="outline" 
              size="sm"
              className="w-full"
            >
              Clear Colors
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPicker;
