
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RoomData, FooterValues } from '@/types';
import DataTransfer from './DataTransfer';

interface ActionButtonsProps {
  handleSave: () => void;
  handlePrint: () => void; // Keep prop for compatibility
  handleReset: () => void;
  roomsData: RoomData[];
  footerValues: FooterValues;
  handleDataImport: (importedRooms: RoomData[], importedFooterValues: FooterValues) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  handleSave, 
  handleReset,
  roomsData,
  footerValues,
  handleDataImport
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        onClick={handleSave}
        className="bg-green-600 hover:bg-green-700"
      >
        Save Changes
      </Button>
      
      <Button 
        onClick={() => {
          if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            handleReset();
            toast.success('Sheet reset to default values');
          }
        }}
        className="bg-red-600 hover:bg-red-700"
      >
        Reset Sheet
      </Button>
      
      <DataTransfer 
        roomsData={roomsData}
        footerValues={footerValues}
        importData={handleDataImport}
      />
    </div>
  );
};

export default ActionButtons;
