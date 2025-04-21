
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RoomData, FooterValues } from '@/types';
import { Save, RefreshCcw } from 'lucide-react';

interface ActionButtonsProps {
  handleSave: () => void;
  handlePrint: () => void;
  handleReset: () => void;
  roomsData: RoomData[];
  footerValues: FooterValues;
  handleDataImport: (
    importedRooms: RoomData[], 
    importedFooterValues: FooterValues,
    importedMonth?: string,
    importedDay?: number
  ) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  handleSave, 
  handleReset,
}) => {
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSaveWithFeedback = async () => {
    setIsSaving(true);
    try {
      handleSave();
      toast.success('Data saved successfully');
    } catch (error) {
      toast.error('Failed to save data');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
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
  );
};

export default ActionButtons;
