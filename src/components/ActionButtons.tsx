
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RoomData, FooterValues } from '@/types';
import DataTransfer from './DataTransfer';
import { Save, RefreshCcw } from 'lucide-react';

interface ActionButtonsProps {
  handleSave: () => void;
  handlePrint: () => void;
  handleReset: () => void;
  roomsData: RoomData[];
  footerValues: FooterValues;
  handleDataImport: (importedRooms: RoomData[], importedFooterValues: FooterValues) => void;
  isSaving?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  handleSave, 
  handleReset,
  roomsData,
  footerValues,
  handleDataImport,
  isSaving = false
}) => {
  const handleSaveWithFeedback = async () => {
    if (isSaving) return;
    
    try {
      await handleSave();
    } catch (error) {
      toast.error('Failed to save data');
      console.error('Save error:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      <DataTransfer 
        roomsData={roomsData}
        footerValues={footerValues}
        importData={handleDataImport}
      />
      <div className="flex flex-wrap gap-2 md:ml-auto">
        <Button 
          onClick={handleSaveWithFeedback}
          className="bg-green-600 hover:bg-green-700"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
        <Button 
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
              handleReset();
              toast.success('Sheet reset to default values');
            }
          }}
          className="bg-red-600 hover:bg-red-700"
          disabled={isSaving}
        >
          Reset Sheet
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
