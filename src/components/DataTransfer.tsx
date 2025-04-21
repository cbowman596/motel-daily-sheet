
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RoomData, FooterValues } from '@/types';
import { encodeDataToUrl } from '@/utils/urlUtils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

// Helper to escape CSV values
function csvEscape(val: string | number | undefined) {
  if (val === undefined || val === null) return '';
  const str = String(val);
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Export all rooms and footer values as CSV
function convertDataToCSV(rooms: RoomData[], footer: FooterValues) {
  // Gather headers
  const headers = [
    'id', 'roomNumber', 'location', 'roomType', 'type',
    'name', 'pmt', 'cacc', 'rate', 'total',
    'checkIn', 'checkOut', 'vehicleDesc', 'key',
    'backgroundColor', 'textColor'
  ];

  const csvRows = [
    headers.join(','),
    ...rooms.map(room => headers.map(field => csvEscape((room as any)[field])).join(','))
  ];

  // Footer values as a final row with column names in first col and value in the second
  csvRows.push('');
  csvRows.push('Footer Values');
  Object.entries(footer).forEach(([key, value]) => {
    csvRows.push(`${csvEscape(key)},${csvEscape(value)}`);
  });

  return csvRows.join('\r\n');
}

interface DataTransferProps {
  roomsData: RoomData[];
  footerValues: FooterValues;
  importData: (importedRooms: RoomData[], importedFooterValues: FooterValues) => void;
}

const DataTransfer: React.FC<DataTransferProps> = ({ roomsData, footerValues, importData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [shareUrl, setShareUrl] = useState<string>('');

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

  // New handler for CSV export
  const handleExportCsv = () => {
    try {
      const csv = convertDataToCSV(roomsData, footerValues);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);

      const filename = `motel_data_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`;
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();

      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success('CSV file exported for Google Sheets');
    } catch (error) {
      toast.error('Failed to export CSV');
      console.error('CSV export error:', error);
    }
  };
  
  const generateShareableUrl = () => {
    try {
      const encodedData = encodeDataToUrl(roomsData, footerValues);
      const url = new URL(window.location.href);
      url.search = '';
      url.searchParams.set('data', encodedData);
      setShareUrl(url.toString());
      return url.toString();
    } catch (error) {
      console.error('Error generating shareable URL:', error);
      toast.error('Failed to generate URL. Data might be too large.');
      return '';
    }
  };
  
  const handleShareUrl = () => {
    const url = generateShareableUrl();
    if (url) {
      navigator.clipboard.writeText(url)
        .then(() => {
          toast.success('Shareable URL copied to clipboard!');
        })
        .catch(() => {
          toast.error('Failed to copy URL. Please copy it manually.');
        });
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
        if (!parsedData.rooms || !parsedData.footerValues) {
          throw new Error('Invalid data format');
        }
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
        importData(parsedData.rooms, importedFooterValues);
        toast.success('Data imported successfully');
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
    <div className="flex flex-wrap gap-2">
      <Button 
        onClick={handleExport}
        variant="outline"
        size="sm"
        className="bg-purple-100 hover:bg-purple-200 text-purple-900 border-purple-300"
      >
        Export Data
      </Button>
      {/* NEW CSV EXPORT BUTTON */}
      <Button
        onClick={handleExportCsv}
        variant="outline"
        size="sm"
        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border-yellow-300"
      >
        Export as CSV
      </Button>
      <Button 
        onClick={handleImportClick}
        variant="outline"
        size="sm"
        className="bg-blue-100 hover:bg-blue-200 text-blue-900 border-blue-300"
      >
        Import Data
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            onClick={generateShareableUrl}
            variant="outline"
            size="sm"
            className="bg-green-100 hover:bg-green-200 text-green-900 border-green-300"
          >
            Share URL
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 max-w-sm">
          <div className="space-y-2">
            <h4 className="font-medium">Shareable URL</h4>
            <p className="text-sm text-muted-foreground">
              Copy this URL to share your current sheet data. 
              <span className="font-medium block mt-1">The data will load automatically when the link is opened.</span>
            </p>
            <div className="flex items-center gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="text-xs"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                size="sm"
                onClick={handleShareUrl}
                className="whitespace-nowrap"
              >
                Copy
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
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

