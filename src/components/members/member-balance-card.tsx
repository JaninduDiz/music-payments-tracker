
'use client';

import { useMemo } from 'react';
import { useData } from '@/context/data-context';
import type { Member } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { differenceInCalendarMonths, endOfMonth, isBefore, startOfMonth } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface MemberBalanceCardProps {
  member: Member;
}

export function MemberBalanceCard({ member }: MemberBalanceCardProps) {
  const { payments } = useData();

  const cumulativeBalance = useMemo(() => {
    const memberStartDate = new Date(member.createdAt);
    const today = new Date();
    
    // Calculate total amount due from member's start date until today
    const monthsDue = isBefore(memberStartDate, endOfMonth(today))
      ? differenceInCalendarMonths(endOfMonth(today), startOfMonth(memberStartDate)) + 1
      : 0;
    const totalDue = monthsDue * member.monthlyAmount;

    // Calculate total amount paid by the member until today
    const totalPaid = payments
      .filter(p => p.memberId === member.id && isBefore(new Date(p.date), endOfMonth(today)))
      .reduce((sum, p) => sum + p.amount, 0);

    return totalPaid - totalDue;
  }, [member, payments]);

  const balanceStatus = useMemo(() => {
    if (cumulativeBalance > 0) {
      return {
        text: `${formatCurrency(cumulativeBalance)} ahead`,
        className: 'text-green-400',
        description: 'This member has paid more than their total due amount.'
      };
    }
    if (cumulativeBalance < 0) {
      return {
        text: `${formatCurrency(Math.abs(cumulativeBalance))} behind`,
        className: 'text-destructive',
        description: 'This member has an outstanding balance.'
      };
    }
    return {
      text: `${formatCurrency(0)}`,
      className: 'text-foreground',
      description: 'This member is fully paid up.'
    };
  }, [cumulativeBalance]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Balance</CardTitle>
        <CardDescription>{balanceStatus.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold ${balanceStatus.className}`}>
          {balanceStatus.text}
        </p>
      </CardContent>
    </Card>
  );
}
