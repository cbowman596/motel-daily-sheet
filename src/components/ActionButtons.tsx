import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RoomData, FooterValues } from '@/types';
import DataTransfer from './DataTransfer';

interface ActionButtonsProps {
  handleSave: () => void;
  handlePrint: () => void;
  handleReset: () => void;
  roomsData: RoomData[];
  footerValues: FooterValues;
  handleDataImport: (importedRooms: RoomData[], importedFooterValues: FooterValues) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  handleSave, 
  handlePrint, 
  handleReset,
  roomsData,
  footerValues,
  handleDataImport
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      <DataTransfer 
        roomsData={roomsData}
        footerValues={footerValues}
        importData={handleDataImport}
      />
      <div className="flex flex-wrap gap-2 md:ml-auto">
        <Button 
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700"
        >
          Save Changes
        </Button>
        <Button 
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Print Sheet
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
      </div>
    </div>
  );
};

export default ActionButtons;
