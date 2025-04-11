import React from 'react';
import { RoomData, FooterValues } from '@/types';

interface PrintHandlerProps {
  rooms: RoomData[];
  footerValues: FooterValues;
  month: string;
  day: number;
  roomTotals: {
    nightly: number;
    weekly: number;
    monthly: number;
    airbnb: number;
  };
}

const PrintHandler: React.FC<PrintHandlerProps> = ({ 
  rooms, 
  footerValues, 
  month, 
  day, 
  roomTotals 
}) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write('<html><head><title>Coyote Motel West - Room Sheet</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      @page { 
        size: portrait; 
        margin: 5mm 3mm;
        scale: 1;
      }
      body { 
        font-family: Arial, sans-serif;
        font-size: 9px;
        color: #000000 !important; 
        width: 100%;
        margin: 0;
        padding: 0;
      }
      .print-container {
        padding: 3mm 4mm;
      }
      table { 
        border-collapse: collapse; 
        width: 100%; 
        table-layout: fixed;
        page-break-inside: avoid;
      }
      th { 
        border: 1px solid black; 
        padding: 2px;
        background-color: #f3f4f6; 
        font-size: 9px;
        text-align: center;
        font-weight: bold;
        color: #000000 !important;
      }
      td { 
        border: 1px solid black; 
        padding: 2px; 
        height: 18px;
        font-size: 9px;
        font-weight: 600;
        color: #000000 !important;
      }
      .header {
        background-color: #4c9eeb;
        color: white;
        padding: 3px;
        border-radius: 4px 4px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2px;
        font-size: 10px;
        font-weight: bold;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .date-display {
        color: white;
        font-weight: bold;
        margin-right: 8px;
      }
      .footer {
        margin-top: 2px;
        padding: 2px;
        border-top: 1px solid #e5e7eb;
        font-size: 9px;
        font-weight: 600;
        color: #000000 !important;
      }
      .footer-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2px;
      }
      .footer-flex {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2px;
        margin-top: 2px;
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
        width: 9px;
        height: 9px;
        margin-right: 3px;
      }
      .purple, .bg-motel-purple {
        background-color: #6c5fc7 !important;
        color: #FFFFFF !important;
        font-weight: 600 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .yellow, .bg-motel-yellow {
        background-color: #fcd34d !important;
        color: #000000 !important;
        font-weight: 600 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .blue, .bg-motel-blue {
        background-color: #3b82f6 !important;
        color: #FFFFFF !important;
        font-weight: 600 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .bg-motel-header {
        background-color: #4c9eeb !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .footer-section {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 2px;
      }
      .text-right {
        text-align: right;
      }
      input {
        box-sizing: border-box;
        width: 100%;
        background: transparent;
        border: none;
        color: inherit !important;
        font-weight: 600 !important;
        font-size: 9px !important;
      }
      span {
        color: inherit !important;
        font-weight: 600 !important;
        font-size: 9px !important;
      }
      .text-center, input.text-center {
        text-align: center;
      }
      .select-column {
        display: none; /* Hide select column when printing */
      }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      .max-w-6xl {
        width: 100%;
      }
      .bg-white {
        background-color: white;
      }
      p, div, label {
        color: #000000 !important;
        font-weight: 600 !important;
        font-size: 9px !important;
      }
      .footer-values {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 2px;
      }
      .footer-item {
        display: flex;
        align-items: center;
      }
      .footer-label {
        font-weight: bold;
        margin-right: 2px;
      }
      .footer-value {
        font-weight: bold;
      }
      .p-4 {
        padding: 2px;
      }
      .border-t {
        border-top: 1px solid #e5e7eb;
      }
      .mt-2 {
        margin-top: 2px;
      }
      .mb-4 {
        margin-bottom: 2px;
      }
      .gap-4 {
        gap: 2px;
      }
      .gap-2 {
        gap: 1px;
      }
      .colored-row {
        color: #FFFFFF !important;
      }
      .colored-row * {
        color: #FFFFFF !important;
      }
    `);
    printWindow.document.write('</style></head><body>');
    
    // Create header section with current date
    const headerHtml = `
      <div class="print-container">
        <div class="header">
          <div><h1 style="font-size: 12px; margin: 0; padding: 0;">Coyote Motel West</h1></div>
          <div style="display: flex; align-items: center;">
            <div style="margin-right: 10px;">
              <span>N/${roomTotals.nightly}</span>
              <span>W/${roomTotals.weekly}</span>
              <span>M/${roomTotals.monthly}</span>
              <span>A/${roomTotals.airbnb}</span>
            </div>
            <div>${month} ${day}</div>
          </div>
        </div>
    `;
    
    // Create table with rooms data
    let tableHtml = `
      <table>
        <thead>
          <tr>
            <th>Loc</th>
            <th>Type</th>
            <th>Dur</th>
            <th>Room #</th>
            <th>Name</th>
            <th>PMT</th>
            <th style="width: 60px;">Rate</th>
            <th>Total</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Vehicle Desc</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    rooms.forEach(room => {
      let rowClass = '';
      let rowStyle = '';
      let textColor = '#000000';
      
      if (room.backgroundColor) {
        // For custom background colors, use white text
        rowStyle = `background-color: ${room.backgroundColor};`;
        textColor = '#FFFFFF';
      } else if (room.type === 'W') {
        rowClass = 'blue';
        textColor = '#FFFFFF';
      } else if (room.type === 'M') {
        rowClass = 'purple';
        textColor = '#FFFFFF';
      } else if (Number(room.roomNumber) === 16 || Number(room.roomNumber) === 27) {
        rowClass = 'yellow';
        // Yellow background keeps black text for better contrast
        textColor = '#000000';
      }
      
      // Determine the location based on room number
      const getLocation = () => {
        const roomNum = Number(room.roomNumber);
        if (roomNum >= 1 && roomNum <= 6) return 'FB';
        if (roomNum >= 7 && roomNum <= 12) return 'BR';
        if (roomNum >= 13 && roomNum <= 19) return 'FT';
        if (roomNum >= 20 && roomNum <= 26) return 'BT';
        if (roomNum >= 28 && roomNum <= 30) return 'ST';
        if (roomNum === 27) return 'LFT';
        if (roomNum === 16) return 'CAB';
        return '';
      };
      
      // Get room type based on room number
      const getRoomType = () => {
        const roomNum = Number(room.roomNumber);
        if (roomNum === 1) return '1K Kit';
        if ([6, 13, 19].includes(roomNum)) return '2Q Kit';
        if ([2, 3, 4, 5, 7, 8, 14, 15, 17, 18, 20, 21, 22].includes(roomNum)) return '1Q Kit';
        if ([24, 25, 26, 28, 29, 30].includes(roomNum)) return '1Q';
        if ([9, 10, 11].includes(roomNum)) return '1F Kit';
        if ([12, 16].includes(roomNum)) return '1F';
        if (room.roomNumber === 'Cabin') return '1Q Kit';
        if (room.roomNumber === 'Loft') return '1Q';
        return '';
      };
      
      tableHtml += `
        <tr class="${rowClass}" style="${rowStyle} color: ${textColor};">
          <td style="text-align: center; color: ${textColor};">${room.location || getLocation()}</td>
          <td style="text-align: center; color: ${textColor};">${room.roomType || getRoomType()}</td>
          <td style="text-align: center; color: ${textColor};">${room.type}</td>
          <td style="text-align: center; color: ${textColor};">${room.roomNumber}</td>
          <td style="color: ${textColor};">${room.name}</td>
          <td style="text-align: center; color: ${textColor};">${room.pmt}</td>
          <td style="text-align: center; color: ${textColor};">${room.rate}</td>
          <td style="text-align: center; color: ${textColor};">${room.total}</td>
          <td style="text-align: center; color: ${textColor};">${room.checkIn}</td>
          <td style="text-align: center; color: ${textColor};">${room.checkOut}</td>
          <td style="color: ${textColor};">${room.vehicleDesc}</td>
        </tr>
      `;
    });
    
    tableHtml += `
        </tbody>
      </table>
    `;
    
    // Create footer section
    const footerHtml = `
      <div class="footer">
        <div class="footer-grid">
          <div class="color-legend">
            <div class="color-item">
              <div class="color-swatch purple"></div>
              <span>Purple - Monthly</span>
            </div>
            <div class="color-item">
              <div class="color-swatch blue"></div>
              <span>Blue - Weekly</span>
            </div>
            <div class="color-item">
              <div class="color-swatch yellow"></div>
              <span>Yellow - Employee</span>
            </div>
          </div>
          
          <div class="footer-section">
            <div class="text-right">Showers:</div>
            <div>${footerValues.showers}</div>
            <div class="text-right">Refunds:</div>
            <div>${footerValues.refunds}</div>
            <div class="text-right">Return's:</div>
            <div>${footerValues.returns}</div>
          </div>
          
          <div class="footer-section">
            <div class="text-right">BHD:</div>
            <div>${footerValues.bhd}</div>
            <div class="text-right">Motel:</div>
            <div>${footerValues.motel}</div>
            <div class="text-right">AirBnB:</div>
            <div>${footerValues.airbnb}</div>
          </div>
        </div>
        
        <div class="footer-flex">
          <div style="display: flex; align-items: center; justify-content: flex-start;">
            <span style="margin-right: 5px;">Cash:</span>
            <span>${footerValues.cash}</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: flex-start;">
            <span style="margin-right: 5px;">Card:</span>
            <span>${footerValues.card}</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: flex-start;">
            <span style="margin-right: 5px;">GT:</span>
            <span>${footerValues.gt}</span>
          </div>
        </div>
      </div>
    `;
    
    printWindow.document.write(headerHtml);
    printWindow.document.write(tableHtml);
    printWindow.document.write(footerHtml);
    printWindow.document.write('</div></body></html>');
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div>
      <button 
        onClick={handlePrint}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
      >
        Print Sheet
      </button>
    </div>
  );
};

export default PrintHandler;
