'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subMonths, addMonths } from 'date-fns';

interface MonthSelectorProps {
  currentDate: Date;
  onDateChange: (newDate: Date) => void;
}

export function MonthSelector({ currentDate, onDateChange }: MonthSelectorProps) {
  const handlePrevMonth = () => {
    onDateChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onDateChange(addMonths(currentDate, 1));
  };
  
  const isNextMonthFuture = () => {
    const nextMonth = addMonths(currentDate, 1);
    const now = new Date();
    return nextMonth.getFullYear() > now.getFullYear() || (nextMonth.getFullYear() === now.getFullYear() && nextMonth.getMonth() > now.getMonth());
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={handlePrevMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="w-32 text-center font-medium tabular-nums tracking-wide">
        {format(currentDate, 'MMMM yyyy')}
      </span>
      <Button variant="outline" size="icon" onClick={handleNextMonth} disabled={isNextMonthFuture()}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
