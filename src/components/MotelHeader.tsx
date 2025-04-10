
import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { format } from 'date-fns';

interface MotelHeaderProps {
  month: string;
  setMonth: (month: string) => void;
  day: number;
  setDay: (day: number) => void;
}

const MotelHeader: React.FC<MotelHeaderProps> = ({ month, setMonth, day, setDay }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Function to handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setMonth(format(date, 'MMMM'));
      setDay(date.getDate());
    }
  };

  // Get current year for the calendar display
  const currentYear = new Date().getFullYear();
  const selectedDate = new Date(currentYear, months.indexOf(month), day);
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-4 bg-motel-header p-3 rounded-t-md">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-white">Coyote Motel West</h1>
      </div>
      <div className="flex items-center mt-2 md:mt-0">
        <div className="mr-4 flex items-center">
          <select 
            value={month} 
            onChange={(e) => setMonth(e.target.value)}
            className="px-2 py-1 border rounded mr-2"
          >
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          
          <select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="px-2 py-1 border rounded mr-2"
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <CalendarIcon className="h-4 w-4" />
                <span className="sr-only">Open calendar</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="border rounded-md"
              />
            </SheetContent>
          </Sheet>
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
