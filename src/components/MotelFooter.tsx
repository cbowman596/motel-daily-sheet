
import React from 'react';
import { FooterValues } from '@/types';

interface MotelFooterProps {
  values: FooterValues;
  updateFooterValue: (field: string, value: string) => void;
}

const MotelFooter: React.FC<MotelFooterProps> = ({ values, updateFooterValue }) => {
  return (
    <div className="mt-2 print:mt-1">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 print:grid-cols-3 print:gap-1 print:mb-1">
        <div>
          <div className="text-sm mb-1 text-black font-medium print:mb-0.5 print:text-xs">
            <span className="inline-block w-4 h-4 bg-motel-purple mr-2 print:w-3 print:h-3"></span>
            <span>Purple - Monthly</span>
          </div>
          <div className="text-sm mb-1 text-black font-medium print:mb-0.5 print:text-xs">
            <span className="inline-block w-4 h-4 bg-motel-blue mr-2 print:w-3 print:h-3"></span>
            <span>Blue - Weekly</span>
          </div>
          <div className="text-sm mb-1 text-black font-medium print:mb-0.5 print:text-xs">
            <span className="inline-block w-4 h-4 bg-motel-yellow mr-2 print:w-3 print:h-3"></span>
            <span>Yellow - Employee</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 print:gap-1">
          <div className="text-right text-black font-medium print:text-xs">Showers:</div>
          <input
            type="text"
            value={values.showers}
            onChange={(e) => updateFooterValue('showers', e.target.value)}
            className="border-b border-gray-300 focus:outline-none text-black font-medium print:text-xs print:border-0"
          />
          <div className="text-right text-black font-medium print:text-xs">Refunds:</div>
          <input
            type="text"
            value={values.refunds}
            onChange={(e) => updateFooterValue('refunds', e.target.value)}
            className="border-b border-gray-300 focus:outline-none text-black font-medium print:text-xs print:border-0"
          />
          <div className="text-right text-black font-medium print:text-xs">Return's:</div>
          <input
            type="text"
            value={values.returns}
            onChange={(e) => updateFooterValue('returns', e.target.value)}
            className="border-b border-gray-300 focus:outline-none text-black font-medium print:text-xs print:border-0"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2 print:gap-1">
          <div className="text-right text-black font-medium print:text-xs">BHD:</div>
          <input
            type="text"
            value={values.bhd}
            onChange={(e) => updateFooterValue('bhd', e.target.value)}
            className="border-b border-gray-300 focus:outline-none text-black font-medium print:text-xs print:border-0"
          />
          <div className="text-right text-black font-medium print:text-xs">Motel:</div>
          <input
            type="text"
            value={values.motel}
            onChange={(e) => updateFooterValue('motel', e.target.value)}
            className="border-b border-gray-300 focus:outline-none text-black font-medium print:text-xs print:border-0"
          />
          <div className="text-right text-black font-medium print:text-xs">AirBnB:</div>
          <input
            type="text"
            value={values.airbnb}
            onChange={(e) => updateFooterValue('airbnb', e.target.value)}
            className="border-b border-gray-300 focus:outline-none text-black font-medium print:text-xs print:border-0"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 print:grid-cols-3 print:gap-1">
        <div className="flex items-center md:justify-end print:justify-start">
          <span className="mr-2 text-black font-medium print:text-xs">Cash:</span>
          <input
            type="text"
            value={values.cash}
            onChange={(e) => updateFooterValue('cash', e.target.value)}
            className="border-b border-gray-300 focus:outline-none text-black font-medium print:text-xs print:border-0"
          />
        </div>
        <div className="flex items-center md:justify-end print:justify-start">
          <span className="mr-2 text-black font-medium print:text-xs">Card:</span>
          <input
            type="text"
            value={values.card}
            onChange={(e) => updateFooterValue('card', e.target.value)}
            className="border-b border-gray-300 focus:outline-none text-black font-medium print:text-xs print:border-0"
          />
        </div>
        <div className="flex items-center md:justify-end col-span-2 md:col-span-1 print:col-span-1 print:justify-start">
          <span className="mr-2 text-black font-medium print:text-xs">GT:</span>
          <input
            type="text"
            value={values.gt}
            onChange={(e) => updateFooterValue('gt', e.target.value)}
            className="border-b border-gray-300 focus:outline-none text-black font-medium print:text-xs print:border-0"
          />
        </div>
      </div>
    </div>
  );
};

export default MotelFooter;
