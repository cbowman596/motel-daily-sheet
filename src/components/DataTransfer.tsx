
import React, { useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RoomData } from '@/components/MotelRow';

interface DataTransferProps {
  roomsData: RoomData[];
  footerValues: Record<string, string>;
  importData: (importedRooms: RoomData[], importedFooterValues: Record<string, string>) => void;
}

const DataTransfer: React.FC<DataTransferProps> = ({ roomsData, footerValues, importData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const exportData = {
      rooms: roomsData,
      footerValues: footerValues,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `motel_data_export_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Data exported successfully');
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        
        // Validate imported data structure
        if (!parsedData.rooms || !parsedData.footerValues) {
          throw new Error('Invalid data format');
        }
        
        // Import the data
        importData(parsedData.rooms, parsedData.footerValues);
        toast.success('Data imported successfully');
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        toast.error('Error importing data. Please check the file format.');
        console.error('Import error:', error);
      }
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="flex gap-2">
      <Button 
        onClick={handleExport}
        variant="outline"
        size="sm"
        className="bg-purple-100 hover:bg-purple-200 text-purple-900 border-purple-300"
      >
        Export Data
      </Button>
      <Button 
        onClick={handleImportClick}
        variant="outline"
        size="sm"
        className="bg-blue-100 hover:bg-blue-200 text-blue-900 border-blue-300"
      >
        Import Data
      </Button>
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
    </div>
  );
};

export default DataTransfer;
