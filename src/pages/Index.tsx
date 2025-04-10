
import React, { useState, useRef } from 'react';
import MotelHeader from '@/components/MotelHeader';
import MotelRow, { RoomData } from '@/components/MotelRow';
import MotelFooter from '@/components/MotelFooter';
import ActionButtons from '@/components/ActionButtons';
import ColorPicker from '@/components/ColorPicker';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { initialRooms, initialFooterValues } from '@/data/initialData';
import { toast } from 'sonner';
import { FooterValues } from '@/types';

const Index = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.toLocaleString('default', { month: 'long' }));
  const [day, setDay] = useState(today.getDate());
  const [rooms, setRooms] = useLocalStorage<RoomData[]>('motelRooms', initialRooms);
  const [footerValues, setFooterValues] = useLocalStorage<FooterValues>('motelFooterValues', initialFooterValues);
  const [saveStatus, setSaveStatus] = useState('');
  const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);
  const printRef = useRef<HTMLDivElement>(null);
  
  // Toggle room selection
  const toggleRoomSelection = (id: number) => {
    setSelectedRoomIds(prev => 
      prev.includes(id) 
        ? prev.filter(roomId => roomId !== id) 
        : [...prev, id]
    );
  };
  
  // Apply color to selected rooms
  const applyColorToRooms = (roomIds: number[], bgColor: string, textColor: string) => {
    setRooms(rooms.map(room => 
      roomIds.includes(room.id) 
        ? { ...room, backgroundColor: bgColor, textColor: textColor } 
        : room
    ));
    // Clear selection after applying color
    setSelectedRoomIds([]);
  };
  
  // Clear colors from selected rooms
  const clearRoomColors = (roomIds: number[]) => {
    setRooms(rooms.map(room => 
      roomIds.includes(room.id) 
        ? { ...room, backgroundColor: undefined, textColor: undefined } 
        : room
    ));
    // Clear selection after clearing colors
    setSelectedRoomIds([]);
  };

  // Update a room's data
  const updateRoom = (id: number, field: string, value: string) => {
    setRooms(rooms.map(room => 
      room.id === id ? { ...room, [field]: value } : room
    ));
  };

  // Update footer values
  const updateFooterValue = (field: string, value: string) => {
    setFooterValues({ ...footerValues, [field]: value });
  };

  // Handle save button
  const handleSave = () => {
    // Data is already saved via the useLocalStorage hook
    setSaveStatus('Saved!');
    toast.success('Sheet data saved successfully!');
    setTimeout(() => setSaveStatus(''), 2000);
  };
  
  // Handle data import
  const handleDataImport = (importedRooms: RoomData[], importedFooterValues: FooterValues) => {
    setRooms(importedRooms);
    setFooterValues(importedFooterValues);
  };

  // Handle print button with preserved custom colors
  const handlePrint = () => {
    const content = printRef.current;
    if (content) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Coyote Motel West - Room Sheet</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
          @page { size: portrait; margin: 5mm; }
          body { font-family: Arial, sans-serif; font-size: 10px; }
          table { border-collapse: collapse; width: 100%; }
          th { 
            border: 1px solid black; 
            padding: 2px; 
            background-color: #e5e7eb; 
            font-size: 9px;
            text-align: center;
            font-weight: bold;
          }
          td { 
            border: 1px solid black; 
            padding: 2px; 
            height: 16px;
            font-size: 9px;
          }
          .header {
            background-color: #4c9eeb;
            color: white;
            padding: 4px;
            border-radius: 4px 4px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
            font-size: 11px;
            font-weight: bold;
          }
          .date-display {
            color: white;
            font-weight: bold;
            margin-right: 4px;
          }
          .footer {
            margin-top: 4px;
            padding: 4px;
            border-top: 1px solid #e5e7eb;
            font-size: 9px;
          }
          .footer-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.5rem;
          }
          .footer-flex {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.5rem;
            margin-top: 0.5rem;
          }
          .color-legend {
            display: flex;
            flex-direction: column;
          }
          .color-item {
            display: flex;
            align-items: center;
            margin-bottom: 2px;
          }
          .color-swatch {
            width: 10px;
            height: 10px;
            margin-right: 4px;
          }
          .purple {
            background-color: #6c5fc7 !important;
            color: white !important;
          }
          .yellow {
            background-color: #fcd34d !important;
          }
          .footer-section {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 0.25rem;
          }
          .text-right {
            text-align: right;
          }
        `);
        printWindow.document.write('</style></head><body>');
        
        // Create a modified version of the content for printing
        const clonedContent = content.cloneNode(true) as HTMLElement;
        
        // Handle inputs: replace with text but preserve their values
        const inputs = clonedContent.querySelectorAll('input');
        inputs.forEach(input => {
          const span = document.createElement('span');
          span.textContent = input.value;
          span.style.width = '100%';
          span.style.display = 'inline-block';
          if (input.classList.contains('text-center')) {
            span.style.textAlign = 'center';
          }
          input.parentNode?.replaceChild(span, input);
        });
        
        // Remove action buttons and color picker
        const actionButtonsDiv = clonedContent.querySelector('.max-w-6xl.mx-auto.mt-4');
        if (actionButtonsDiv) {
          actionButtonsDiv.remove();
        }
        
        // Replace calendar button and dropdowns with static date display in header
        const headerElement = clonedContent.querySelector('.bg-motel-header');
        if (headerElement) {
          const dateSelectors = headerElement.querySelector('.flex.items-center.mt-2.md\\:mt-0')?.firstElementChild;
          if (dateSelectors) {
            const dateDisplay = document.createElement('div');
            dateDisplay.className = 'date-display';
            dateDisplay.textContent = `${month} ${day}`;
            dateSelectors.parentNode?.replaceChild(dateDisplay, dateSelectors);
          }
        }
        
        // Remove the selection styling for print
        const selectedRows = clonedContent.querySelectorAll('tr');
        selectedRows.forEach(row => {
          if (row.classList.contains('ring-2')) {
            row.classList.remove('ring-2', 'ring-blue-500');
          }
        });
        
        printWindow.document.write(clonedContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    }
  };

  // Reset the sheet to default values
  const handleReset = () => {
    setRooms(initialRooms);
    setFooterValues(initialFooterValues);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-md" ref={printRef}>
        {/* Header */}
        <MotelHeader 
          month={month} 
          setMonth={setMonth} 
          day={day}
          setDay={setDay}
        />
        
        {/* Color Picker (outside the print area) */}
        {selectedRoomIds.length > 0 && (
          <div className="px-4 py-2 border-b">
            <ColorPicker 
              selectedRooms={selectedRoomIds}
              applyColorToRooms={applyColorToRooms}
              clearRoomColors={clearRoomColors}
            />
          </div>
        )}
        
        {/* Main Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-sm w-8">Type</th>
                <th className="border border-gray-300 p-2 text-sm w-8">Room #</th>
                <th className="border border-gray-300 p-2 text-sm w-1/4">Name</th>
                <th className="border border-gray-300 p-2 text-sm w-8">PMT</th>
                <th className="border border-gray-300 p-2 text-sm w-16">Rate</th>
                <th className="border border-gray-300 p-2 text-sm w-16">Total</th>
                <th className="border border-gray-300 p-2 text-sm w-16">Check-In</th>
                <th className="border border-gray-300 p-2 text-sm w-16">Check-Out</th>
                <th className="border border-gray-300 p-2 text-sm w-1/4">Vehicle Desc</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <MotelRow 
                  key={room.id} 
                  room={room} 
                  updateRoom={updateRoom}
                  isSelected={selectedRoomIds.includes(room.id)}
                  onToggleSelect={toggleRoomSelection}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t">
          <MotelFooter values={footerValues} updateFooterValue={updateFooterValue} />
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="max-w-6xl mx-auto mt-4">
        <div className="flex justify-between items-center">
          <div className={`text-green-600 font-medium ${saveStatus ? 'animate-save-flash' : 'opacity-0'}`}>
            {saveStatus}
          </div>
          <ActionButtons 
            handleSave={handleSave} 
            handlePrint={handlePrint} 
            handleReset={handleReset}
            roomsData={rooms}
            footerValues={footerValues}
            handleDataImport={handleDataImport} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
