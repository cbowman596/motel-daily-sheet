
import React from 'react';

interface MotelHeaderProps {
  month: string;
  setMonth: (month: string) => void;
}

const MotelHeader: React.FC<MotelHeaderProps> = ({ month, setMonth }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-4 bg-motel-header p-3 rounded-t-md">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-white">Coyote Motel West</h1>
      </div>
      <div className="flex items-center mt-2 md:mt-0">
        <div className="mr-4">
          <select 
            value={month} 
            onChange={(e) => setMonth(e.target.value)}
            className="px-2 py-1 border rounded"
          >
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="text-white space-x-4">
          <span>N/</span>
          <span>W/</span>
          <span>M/</span>
          <span>A</span>
        </div>
      </div>
    </div>
  );
};

export default MotelHeader;
