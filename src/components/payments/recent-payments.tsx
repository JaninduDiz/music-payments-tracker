'use client';

import { useData } from '@/context/data-context';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from "@/components/ui/scroll-area"

export function RecentPayments() {
  const { payments, getMemberById } = useData();

  if (payments.length === 0) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>No payments recorded yet.</CardDescription>
            </CardHeader>
            <CardContent className="flex h-full items-center justify-center pb-16">
                 <div className="text-center">
                    <p className="text-muted-foreground">Your recent payments will show up here.</p>
                 </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>A log of the most recent payments.</CardDescription>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-[450px]">
                <div className="space-y-4">
                    {payments.map(payment => {
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
                            <p className="text-sm text-muted-foreground">
                                {format(new Date(payment.date), 'MMMM dd, yyyy')}
                            </p>
                            </div>
                            <div className="ml-auto font-medium text-green-400">{formatCurrency(payment.amount)}</div>
                        </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </CardContent>
    </Card>
  );
}
