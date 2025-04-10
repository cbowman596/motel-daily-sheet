
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
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid black; padding: 4px; }
          .purple { background-color: #6c5fc7; color: white; }
          .yellow { background-color: #fcd34d; }
          .no-input { border: none; background: none; width: 100%; }
          @media print {
            button, .no-print { display: none !important; }
            body { margin: 0; padding: 15px; }
          }
        `);
        printWindow.document.write('</style></head><body>');
        
        // Clone the content without input elements
        const clonedContent = content.cloneNode(true) as HTMLElement;
        const inputs = clonedContent.querySelectorAll('input');
        inputs.forEach(input => {
          const span = document.createElement('span');
          span.textContent = input.value;
          input.parentNode?.replaceChild(span, input);
        });
        
        // Remove action buttons
        const buttons = clonedContent.querySelectorAll('button');
        buttons.forEach(button => {
          button.remove();
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
                <th className="border border-gray-300 p-2 text-sm">Type</th>
                <th className="border border-gray-300 p-2 text-sm">Room #</th>
                <th className="border border-gray-300 p-2 text-sm">Name</th>
                <th className="border border-gray-300 p-2 text-sm">PMT</th>
                <th className="border border-gray-300 p-2 text-sm">Rate</th>
                <th className="border border-gray-300 p-2 text-sm">Total</th>
                <th className="border border-gray-300 p-2 text-sm">Check-In</th>
                <th className="border border-gray-300 p-2 text-sm">Check-Out</th>
                <th className="border border-gray-300 p-2 text-sm">Vehicle Desc</th>
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
