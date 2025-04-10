
import React, { useState, useRef } from 'react';
import MotelHeader from '@/components/MotelHeader';
import MotelRow, { RoomData } from '@/components/MotelRow';
import MotelFooter from '@/components/MotelFooter';
import ActionButtons from '@/components/ActionButtons';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { initialRooms, initialFooterValues } from '@/data/initialData';
import { toast } from 'sonner';

const Index = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.toLocaleString('default', { month: 'long' }));
  const [day, setDay] = useState(today.getDate());
  const [rooms, setRooms] = useLocalStorage<RoomData[]>('motelRooms', initialRooms);
  const [footerValues, setFooterValues] = useLocalStorage('motelFooterValues', initialFooterValues);
  const [saveStatus, setSaveStatus] = useState('');
  const printRef = useRef<HTMLDivElement>(null);
  
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

  // Handle print button
  const handlePrint = () => {
    const content = printRef.current;
    if (content) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Coyote Motel West - Room Sheet</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
          @page { size: landscape; margin: 10mm; }
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th { 
            border: 1px solid black; 
            padding: 4px; 
            background-color: #e5e7eb; 
            font-size: 0.875rem;
            text-align: center;
          }
          td { 
            border: 1px solid black; 
            padding: 4px; 
            height: 24px;
          }
          .header {
            background-color: #4c9eeb;
            color: white;
            padding: 10px;
            border-radius: 6px 6px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .footer {
            margin-top: 10px;
            padding: 10px;
            border-top: 1px solid #e5e7eb;
          }
          .footer-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }
          .footer-flex {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin-top: 1rem;
          }
          .color-legend {
            display: flex;
            flex-direction: column;
          }
          .color-item {
            display: flex;
            align-items: center;
            margin-bottom: 4px;
          }
          .color-swatch {
            width: 16px;
            height: 16px;
            margin-right: 8px;
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
            gap: 0.5rem;
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
        
        // Remove action buttons
        const actionButtonsDiv = clonedContent.querySelector('.max-w-6xl.mx-auto.mt-4');
        if (actionButtonsDiv) {
          actionButtonsDiv.remove();
        }
        
        // Ensure color styling is preserved for rows
        const rows = clonedContent.querySelectorAll('tr');
        rows.forEach(row => {
          if (row.classList.contains('bg-motel-purple')) {
            row.classList.add('purple');
          } else if (row.classList.contains('bg-motel-yellow')) {
            row.classList.add('yellow');
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
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
