
'use client';

import { useData } from '@/context/data-context';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Payment } from '@/types';
import { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';

interface RecentPaymentsProps {
  memberId?: string | null;
}

export function RecentPayments({ memberId }: RecentPaymentsProps) {
  const { payments, getMemberById } = useData();

  const filteredPayments = useMemo(() => {
    // We sort here to ensure consistent order
    const sortedPayments = [...payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (!memberId) return sortedPayments;
    return sortedPayments.filter(p => p.memberId === memberId);
  }, [payments, memberId]);

  const memberName = memberId ? getMemberById(memberId)?.name : null;

  if (filteredPayments.length === 0) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  {memberName 
                    ? `No payments recorded for ${memberName}.`
                    : "No payments recorded yet."
                  }
                </CardDescription>
            </CardHeader>
            <CardContent className="flex h-full items-center justify-center pb-16">
                 <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {memberName
                        ? `Payments for ${memberName} will appear here.`
                        : "Your recent payments will show up here."
                      }
                    </p>
                    {memberName && (
                      <Button asChild variant="link" className="mt-2">
                        <Link href="/payments">View all payments</Link>
                      </Button>
                    )}
                 </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>{memberName ? `Payments for ${memberName}` : 'Recent Activity'}</CardTitle>
            <CardDescription>
                {memberName 
                    ? `A log of all payments for ${memberName}.` 
                    : "A log of the most recent payments."}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-[450px]">
                <div className="space-y-4">
                    {filteredPayments.map(payment => {
                        const member = getMemberById(payment.memberId);
                        return (
                        <div key={payment.id} className="flex items-center">
                            <Avatar className="h-9 w-9">
                            <AvatarFallback>{member ? member.name.charAt(0) : '?'}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {member?.name || 'Unknown Member'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {format(new Date(payment.date), 'MMMM dd, yyyy')}
                            </p>
                            </div>
                            <div className="ml-auto font-medium text-green-400">{formatCurrency(payment.amount)}</div>
                        </div>
                        );
                    })}
                </div>
            </ScrollArea>
             {memberName && (
                <div className="mt-4 text-center">
                    <Button asChild variant="link">
                        <Link href="/payments">Record a new payment</Link>
                    </Button>
                </div>
            )}
        </CardContent>
    </Card>
  );
}
