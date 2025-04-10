
import React, { useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RoomData, FooterValues } from '@/types';

interface DataTransferProps {
  roomsData: RoomData[];
  footerValues: FooterValues;
  importData: (importedRooms: RoomData[], importedFooterValues: FooterValues) => void;
}

const DataTransfer: React.FC<DataTransferProps> = ({ roomsData, footerValues, importData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
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
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Error exporting data. Please try again.');
    }
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
        
        // Ensure footerValues has all required properties
        const importedFooterValues: FooterValues = {
          showers: parsedData.footerValues.showers || '',
          bhd: parsedData.footerValues.bhd || '',
          refunds: parsedData.footerValues.refunds || '',
          motel: parsedData.footerValues.motel || '',
          returns: parsedData.footerValues.returns || '',
          airbnb: parsedData.footerValues.airbnb || '',
          cash: parsedData.footerValues.cash || '',
          card: parsedData.footerValues.card || '',
          gt: parsedData.footerValues.gt || ''
        };
        
        // Import the data
        importData(parsedData.rooms, importedFooterValues);
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
