
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ActionButtonsProps {
  handleSave: () => void;
  handlePrint: () => void;
  handleReset: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ handleSave, handlePrint, handleReset }) => {
  return (
    <div className="flex flex-wrap justify-end gap-2 mt-4">
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
  );
};

export default ActionButtons;
