import React from 'react';
import { FooterValues } from '@/types';

interface MotelFooterProps {
  values: FooterValues;
  updateFooterValue: (field: string, value: string) => void;
}

const MotelFooter: React.FC<MotelFooterProps> = ({ values, updateFooterValue }) => {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-sm mb-1">
            <span className="inline-block w-4 h-4 bg-motel-purple mr-2"></span>
            <span>Purple - Monthly</span>
          </div>
          <div className="text-sm mb-1">
            <span className="inline-block w-4 h-4 bg-motel-blue mr-2"></span>
            <span>Blue - Weekly</span>
          </div>
          <div className="text-sm mb-1">
            <span className="inline-block w-4 h-4 bg-motel-yellow mr-2"></span>
            <span>Yellow - Employee</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="text-right">Showers:</div>
          <input
            type="text"
            value={values.showers}
            onChange={(e) => updateFooterValue('showers', e.target.value)}
            className="border-b border-gray-300 focus:outline-none"
          />
          <div className="text-right">Refunds:</div>
          <input
            type="text"
            value={values.refunds}
            onChange={(e) => updateFooterValue('refunds', e.target.value)}
            className="border-b border-gray-300 focus:outline-none"
          />
          <div className="text-right">Return's:</div>
          <input
            type="text"
            value={values.returns}
            onChange={(e) => updateFooterValue('returns', e.target.value)}
            className="border-b border-gray-300 focus:outline-none"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="text-right">BHD:</div>
          <input
            type="text"
            value={values.bhd}
            onChange={(e) => updateFooterValue('bhd', e.target.value)}
            className="border-b border-gray-300 focus:outline-none"
          />
          <div className="text-right">Motel:</div>
          <input
            type="text"
            value={values.motel}
            onChange={(e) => updateFooterValue('motel', e.target.value)}
            className="border-b border-gray-300 focus:outline-none"
          />
          <div className="text-right">AirBnB:</div>
          <input
            type="text"
            value={values.airbnb}
            onChange={(e) => updateFooterValue('airbnb', e.target.value)}
            className="border-b border-gray-300 focus:outline-none"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex items-center md:justify-end">
          <span className="mr-2">Cash:</span>
          <input
            type="text"
            value={values.cash}
            onChange={(e) => updateFooterValue('cash', e.target.value)}
            className="border-b border-gray-300 focus:outline-none"
          />
        </div>
        <div className="flex items-center md:justify-end">
          <span className="mr-2">Card:</span>
          <input
            type="text"
            value={values.card}
            onChange={(e) => updateFooterValue('card', e.target.value)}
            className="border-b border-gray-300 focus:outline-none"
          />
        </div>
        <div className="flex items-center md:justify-end col-span-2 md:col-span-1">
          <span className="mr-2">GT:</span>
          <input
            type="text"
            value={values.gt}
            onChange={(e) => updateFooterValue('gt', e.target.value)}
            className="border-b border-gray-300 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default MotelFooter;
