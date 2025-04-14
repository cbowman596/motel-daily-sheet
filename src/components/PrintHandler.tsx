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
        font-size: 11px;
        color: #000000 !important; 
        width: 100%;
        margin: 0;
        padding: 0;
      }
      .print-container {
        padding: 5mm 3mm;
      }
      table { 
        border-collapse: collapse; 
        width: 100%; 
        table-layout: fixed;
        page-break-inside: avoid;
      }
      th { 
        border: 1px solid black; 
        padding: 3px;
        background-color: #f3f4f6; 
        font-size: 11px;
        text-align: center;
        font-weight: bold;
        color: #000000 !important;
      }
      td { 
        border: 1px solid black; 
        padding: 3px; 
        height: 20px;
        font-size: 11px;
        font-weight: 600;
        color: #000000 !important;
      }
      .header {
        background-color: #4c9eeb;
        color: white !important;
        padding: 4px;
        border-radius: 4px 4px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3px;
        font-size: 12px;
        font-weight: bold;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .date-display {
        color: white !important;
        font-weight: bold;
        margin-right: 10px;
      }
      .footer {
        margin-top: 3px;
        padding: 3px;
        border-top: 1px solid #e5e7eb;
        font-size: 11px;
        font-weight: 600;
        color: #000000 !important;
      }
      .footer-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 3px;
      }
      .footer-flex {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 3px;
        margin-top: 3px;
      }
      .color-legend {
        display: flex;
        flex-direction: column;
      }
      .color-item {
        display: flex;
        align-items: center;
        margin-bottom: 3px;
      }
      .color-swatch {
        width: 11px;
        height: 11px;
        margin-right: 4px;
      }
      .purple, .bg-motel-purple {
        background-color: #6c5fc7 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .purple-text {
        color: #FFFFFF !important;
      }
      .yellow, .bg-motel-yellow {
        background-color: #fcd34d !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .blue, .bg-motel-blue {
        background-color: #3b82f6 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .blue-text {
        color: #FFFFFF !important;
      }
      .bg-motel-header {
        background-color: #4c9eeb !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .footer-section {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 3px;
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
        font-size: 11px !important;
      }
      span {
        color: inherit !important;
        font-weight: 600 !important;
        font-size: 11px !important;
      }
      .text-center, input.text-center {
        text-align: center;
      }
      .select-column {
        display: none;
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
        font-size: 11px !important;
      }
      .footer-values {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 3px;
      }
      .footer-item {
        display: flex;
        align-items: center;
      }
      .footer-label {
        font-weight: bold;
        margin-right: 3px;
      }
      .footer-value {
        font-weight: bold;
      }
      .p-4 {
        padding: 3px;
      }
      .border-t {
        border-top: 1px solid #e5e7eb;
      }
      .mt-2 {
        margin-top: 3px;
      }
      .mb-4 {
        margin-bottom: 3px;
      }
      .gap-4 {
        gap: 3px;
      }
      .gap-2 {
        gap: 2px;
      }
      .colored-cell {
        color: #FFFFFF !important;
      }
      .header-cell {
        color: #FFFFFF !important;
      }
      td.bg-motel-purple, td.bg-motel-blue, td.bg-motel-yellow {
        color: #FFFFFF !important;
      }
      td:not(.colored-cell) {
        color: #000000 !important;
      }
    `);
    printWindow.document.write('</style></head><body>');
    
    const headerHtml = `
      <div class="print-container">
        <div class="header">
          <div><h1 style="font-size: 12px; margin: 0; padding: 0; color: #FFFFFF !important;">Coyote Motel West</h1></div>
          <div style="display: flex; align-items: center; color: #FFFFFF !important;">
            <div style="margin-right: 10px; color: #FFFFFF !important;">
              <span style="color: #FFFFFF !important;">N/${roomTotals.nightly}</span>
              <span style="color: #FFFFFF !important;">W/${roomTotals.weekly}</span>
              <span style="color: #FFFFFF !important;">M/${roomTotals.monthly}</span>
              <span style="color: #FFFFFF !important;">A/${roomTotals.airbnb}</span>
            </div>
            <div style="color: #FFFFFF !important;">${month} ${day}</div>
          </div>
        </div>
    `;
    
    let tableHtml = `
      <table>
        <thead>
          <tr>
            <th style="width: 30px;">Room #</th>
            <th style="width: 30px;">Loc</th>
            <th style="width: 30px;">Type</th>
            <th style="width: 30px;">Dur</th>
            <th style="width: 200px;">Name</th>
            <th style="width: 30px;">PMT</th>
            <th style="width: 40px;">CA/CC</th>
            <th style="width: 60px;">Rate</th>
            <th style="width: 60px;">Total</th>
            <th style="width: 50px;">Check-In</th>
            <th style="width: 50px;">Check-Out</th>
            <th style="width: 200px;">Notes</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    rooms.forEach(room => {
      let rowClass = '';
      let coloredCellClass = '';
      const roomNum = Number(room.roomNumber);
      
      if (room.backgroundColor) {
        rowClass = ''; 
        coloredCellClass = 'colored-cell';
      } else if (room.type === 'W') {
        rowClass = 'blue';
        coloredCellClass = 'blue-text';
      } else if (room.type === 'M') {
        rowClass = 'purple';
        coloredCellClass = 'purple-text';
      } else if (Number(room.roomNumber) === 16 || Number(room.roomNumber) === 27) {
        rowClass = 'yellow';
        coloredCellClass = ''; // Yellow has black text
      }
      
      const getLocation = () => {
        if (roomNum >= 1 && roomNum <= 6) return 'FB';
        if (roomNum >= 7 && roomNum <= 12) return 'BR';
        if (roomNum >= 13 && roomNum <= 19) return 'FT';
        if (roomNum >= 20 && roomNum <= 26) return 'BT';
        if (roomNum >= 28 && roomNum <= 30) return 'ST';
        if (roomNum === 27) return 'LFT';
        if (roomNum === 16) return 'CAB';
        return '';
      };
      
      const getRoomType = () => {
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
      
      const roomNumberCellClass = rowClass ? `${rowClass} ${coloredCellClass}` : '';
      const locationCellClass = rowClass ? `${rowClass} ${coloredCellClass}` : '';
      const roomTypeCellClass = rowClass ? `${rowClass} ${coloredCellClass}` : '';
      const typeCellClass = rowClass ? `${rowClass} ${coloredCellClass}` : '';

      const roomNumberCellStyle = room.backgroundColor ? `background-color: ${room.backgroundColor};` : '';
      const locationCellStyle = room.backgroundColor ? `background-color: ${room.backgroundColor};` : '';
      const roomTypeCellStyle = room.backgroundColor ? `background-color: ${room.backgroundColor};` : '';
      const typeCellStyle = room.backgroundColor ? `background-color: ${room.backgroundColor};` : '';

      const coloredTextStyle = room.backgroundColor ? 'color: #FFFFFF !important;' : '';

      tableHtml += `
        <tr>
          <td class="${roomNumberCellClass}" style="text-align: center; ${roomNumberCellStyle} ${roomNumberCellClass ? coloredTextStyle : ''}">
            ${room.roomNumber}
          </td>
          <td class="${locationCellClass}" style="text-align: center; ${locationCellStyle} ${locationCellClass ? coloredTextStyle : ''}">
            ${room.location || getLocation()}
          </td>
          <td class="${roomTypeCellClass}" style="text-align: center; ${roomTypeCellStyle} ${roomTypeCellClass ? coloredTextStyle : ''}">
            ${room.roomType || getRoomType()}
          </td>
          <td class="${typeCellClass}" style="text-align: center; ${typeCellStyle} ${typeCellClass ? coloredTextStyle : ''}">
            ${room.type}
          </td>
          <td style="color: #000000 !important;">${room.name}</td>
          <td style="text-align: center; color: #000000 !important;">${room.pmt}</td>
          <td style="text-align: center; color: #000000 !important;">${room.cacc}</td>
          <td style="text-align: center; color: #000000 !important;">${room.rate}</td>
          <td style="text-align: center; color: #000000 !important;">${room.total}</td>
          <td style="text-align: center; color: #000000 !important;">${room.checkIn}</td>
          <td style="text-align: center; color: #000000 !important;">${room.checkOut}</td>
          <td style="color: #000000 !important;">${room.vehicleDesc}</td>
        </tr>
      `;
    });
    
    tableHtml += `
        </tbody>
      </table>
    `;
    
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
