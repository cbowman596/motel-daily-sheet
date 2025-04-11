
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RoomData, FooterValues } from '@/types';
import DataTransfer from './DataTransfer';
import { CloudCheck, CloudOff } from 'lucide-react';

interface ActionButtonsProps {
  handleSave: () => void;
  handlePrint: () => void; // Keep prop for compatibility but we won't use it
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
  // Simple state to show cloud connection status
  const [isConnected, setIsConnected] = React.useState(true);

  // Check if we're connected to Firebase (simplified)
  React.useEffect(() => {
    const checkConnection = () => {
      setIsConnected(navigator.onLine);
    };
    
    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);
    checkConnection();
    
    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex items-center text-sm">
        {isConnected ? (
          <CloudCheck className="mr-1 h-4 w-4 text-green-500" />
        ) : (
          <CloudOff className="mr-1 h-4 w-4 text-red-500" />
        )}
        <span className={isConnected ? "text-green-500" : "text-red-500"}>
          {isConnected ? "Cloud Connected" : "Offline Mode"}
        </span>
      </div>
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
