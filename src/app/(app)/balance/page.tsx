'use client';

import { useState } from 'react';
import { MonthSelector } from '@/components/balance/month-selector';
import { BalanceOverview } from '@/components/balance/balance-overview';
import { Skeleton } from '@/components/ui/skeleton';
import { useData } from '@/context/data-context';

export default function BalancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { loading } = useData();

  if (loading) {
      return (
          <div className="container mx-auto max-w-6xl p-4 md:p-6 space-y-8">
              <div className="flex items-center justify-between">
                  <Skeleton className="h-10 w-48" />
                  <Skeleton className="h-10 w-40" />
              </div>
              <Skeleton className="h-32 w-full" />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-48 w-full" />
              </div>
          </div>
      )
  }

  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-1">
            <h1 className="text-3xl font-bold tracking-tight">Balance</h1>
            <p className="text-muted-foreground">An overview of all member balances.</p>
        </div>
        <MonthSelector currentDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      <BalanceOverview selectedDate={selectedDate} />
    </div>
  );
}
