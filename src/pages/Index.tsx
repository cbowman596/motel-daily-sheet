import React, { useState, useRef, useEffect } from 'react';
import MotelHeader from '@/components/MotelHeader';
import MotelRow from '@/components/MotelRow';
import MotelFooter from '@/components/MotelFooter';
import ActionButtons from '@/components/ActionButtons';
import ColorPicker from '@/components/ColorPicker';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { initialRooms, initialFooterValues } from '@/data/initialData';
import { toast } from 'sonner';
import { RoomData, FooterValues } from '@/types';

const Index = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.toLocaleString('default', { month: 'long' }));
  const [day, setDay] = useState(today.getDate());
  const [rooms, setRooms] = useLocalStorage<RoomData[]>('motelRooms', initialRooms);
  const [footerValues, setFooterValues] = useLocalStorage<FooterValues>('motelFooterValues', initialFooterValues);
  const [saveStatus, setSaveStatus] = useState('');
  const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);
  const [roomTotals, setRoomTotals] = useState({ nightly: 0, weekly: 0, monthly: 0, airbnb: 0 });
  const printRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const totals = {
      nightly: 0,
      weekly: 0,
      monthly: 0,
      airbnb: 0
    };
    
    rooms.forEach(room => {
      if (room.type === 'N') {
        totals.nightly++;
      } else if (room.type === 'W') {
        totals.weekly++;
      } else if (room.type === 'M' || Number(room.roomNumber) === 16 || Number(room.roomNumber) === 27) {
        totals.monthly++;
      } else if (room.type === 'A') {
        totals.airbnb++;
      }
    });
    
    setRoomTotals(totals);
  }, [rooms]);
  
  const toggleRoomSelection = (id: number) => {
    setSelectedRoomIds(prev => 
      prev.includes(id) 
        ? prev.filter(roomId => roomId !== id) 
        : [...prev, id]
    );
  };
  
  const applyColorToRooms = (roomIds: number[], bgColor: string, textColor: string) => {
    setRooms(rooms.map(room => 
      roomIds.includes(room.id) 
        ? { ...room, backgroundColor: bgColor, textColor: '#000000' } 
        : room
    ));
    setSelectedRoomIds([]);
  };
  
  const clearRoomColors = (roomIds: number[]) => {
    setRooms(rooms.map(room => 
      roomIds.includes(room.id) 
        ? { ...room, backgroundColor: undefined, textColor: undefined } 
        : room
    ));
    setSelectedRoomIds([]);
  };

  const updateRoom = (id: number, field: string, value: string) => {
    setRooms(rooms.map(room => 
      room.id === id ? { ...room, [field]: value } : room
    ));
  };

  const updateFooterValue = (field: string, value: string) => {
    setFooterValues({ ...footerValues, [field]: value });
  };

  const handleSave = () => {
    setSaveStatus('Saved!');
    toast.success('Sheet data saved successfully!');
    setTimeout(() => setSaveStatus(''), 2000);
  };
  
  const handleDataImport = (importedRooms: RoomData[], importedFooterValues: FooterValues) => {
    setRooms(importedRooms);
    setFooterValues(importedFooterValues);
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (content) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Coyote Motel West - Room Sheet</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
          @page { size: portrait; margin: 5mm; }
          body { font-family: Arial, sans-serif; font-size: 10px; color: #000000; }
          table { border-collapse: collapse; width: 100%; }
          th { 
            border: 1px solid black; 
            padding: 2px; 
            background-color: #e5e7eb; 
            font-size: 9px;
            text-align: center;
            font-weight: bold;
            color: #000000;
          }
          td { 
            border: 1px solid black; 
            padding: 2px; 
            height: 16px;
            font-size: 9px;
            font-weight: 500;
            color: #000000;
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
            font-weight: 500;
            color: #000000;
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
            color: #000000 !important;
            font-weight: 500 !important;
          }
          .yellow {
            background-color: #fcd34d !important;
            color: #000000 !important;
            font-weight: 500 !important;
          }
          .blue {
            background-color: #3b82f6 !important;
            color: #000000 !important;
            font-weight: 500 !important;
          }
          .footer-section {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 0.25rem;
          }
          .text-right {
            text-align: right;
          }
          .select-column {
            display: none; /* Hide select column when printing */
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          span {
            color: #000000 !important;
            font-weight: 500 !important;
          }
        `);
        printWindow.document.write('</style></head><body>');
        
        const clonedContent = content.cloneNode(true) as HTMLElement;
        
        const inputs = clonedContent.querySelectorAll('input');
        inputs.forEach(input => {
          const span = document.createElement('span');
          span.textContent = input.value;
          span.style.width = '100%';
          span.style.display = 'inline-block';
          span.style.color = '#000000';
          span.style.fontWeight = '500';
          if (input.classList.contains('text-center')) {
            span.style.textAlign = 'center';
          }
          input.parentNode?.replaceChild(span, input);
        });
        
        const tableRows = clonedContent.querySelectorAll('tr');
        tableRows.forEach(row => {
          if (row.classList.contains('ring-2')) {
            row.classList.remove('ring-2', 'ring-blue-500');
          }
          
          const style = row.getAttribute('style');
          if (style && style.includes('background-color')) {
            const computedStyle = window.getComputedStyle(row);
            row.style.backgroundColor = computedStyle.backgroundColor;
            row.style.color = '#000000';
            row.style.fontWeight = '500';
            row.setAttribute('style', `${row.getAttribute('style') || ''}; -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact;`);
          } 
          else if (row.classList.contains('bg-motel-purple')) {
            row.style.backgroundColor = '#6c5fc7';
            row.style.color = '#000000';
            row.style.fontWeight = '500';
            row.setAttribute('style', `${row.getAttribute('style') || ''}; -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact;`);
          } 
          else if (row.classList.contains('bg-motel-yellow')) {
            row.style.backgroundColor = '#fcd34d';
            row.style.color = '#000000';
            row.style.fontWeight = '500';
            row.setAttribute('style', `${row.getAttribute('style') || ''}; -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact;`);
          }
          else if (row.classList.contains('bg-motel-blue')) {
            row.style.backgroundColor = '#3b82f6';
            row.style.color = '#000000';
            row.style.fontWeight = '500';
            row.setAttribute('style', `${row.getAttribute('style') || ''}; -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact;`);
          }
          else if (row.classList.contains('bg-blue-100')) {
            row.style.backgroundColor = '#3b82f6';
            row.style.color = '#000000';
            row.style.fontWeight = '500';
            row.setAttribute('style', `${row.getAttribute('style') || ''}; -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact;`);
          }
          
          const cells = row.querySelectorAll('td');
          cells.forEach(cell => {
            cell.style.color = '#000000';
            cell.style.fontWeight = '500';
            
            if (row.style.backgroundColor) {
              cell.style.backgroundColor = row.style.backgroundColor;
              cell.setAttribute('style', `${cell.getAttribute('style') || ''}; -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact;`);
            }
          });
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

  const handleReset = () => {
    setRooms(initialRooms);
    setFooterValues(initialFooterValues);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-md" ref={printRef}>
        <MotelHeader 
          month={month} 
          setMonth={setMonth} 
          day={day}
          setDay={setDay}
          totals={roomTotals}
        />
        
        <div className="px-4 py-2 border-b">
          <ColorPicker 
            selectedRooms={selectedRoomIds}
            applyColorToRooms={applyColorToRooms}
            clearRoomColors={clearRoomColors}
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-sm w-8">Select</th>
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
        
        <div className="p-4 border-t">
          <MotelFooter values={footerValues} updateFooterValue={updateFooterValue} />
        </div>
      </div>
      
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
