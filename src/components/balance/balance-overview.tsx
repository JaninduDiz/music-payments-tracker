'use client';

import { useMemo } from 'react';
import { useData } from '@/context/data-context';
import type { Member, Payment } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  differenceInCalendarMonths,
  endOfMonth,
  isBefore,
  isSameMonth,
  startOfMonth,
} from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';


interface BalanceOverviewProps {
  selectedDate: Date;
}

interface MemberBalance {
  member: Member;
  totalDue: number;
  totalPaid: number;
  balance: number;
  dueThisMonth: number;
  paidThisMonth: number;
  status: 'paid' | 'pending' | 'ahead' | 'unpaid';
}

export function BalanceOverview({ selectedDate }: BalanceOverviewProps) {
  const { members, payments } = useData();

  const balances = useMemo(() => {
    const activeMembers = members.filter(m => m.isActive);

    return activeMembers.map((member): MemberBalance => {
      const memberStartDate = new Date(member.createdAt);
      
      let monthsDue = 0;
      if (isBefore(memberStartDate, endOfMonth(selectedDate))) {
          monthsDue = differenceInCalendarMonths(endOfMonth(selectedDate), memberStartDate) + 1;
      }
      
      const totalDue = monthsDue * member.monthlyAmount;

      const totalPaid = payments
        .filter(p => p.memberId === member.id && isBefore(new Date(p.date), endOfMonth(selectedDate)))
        .reduce((sum, p) => sum + p.amount, 0);
      
      const balance = totalPaid - totalDue;

      const dueThisMonth = isBefore(memberStartDate, endOfMonth(selectedDate)) ? member.monthlyAmount : 0;
      
      const paidThisMonth = payments
        .filter(p => p.memberId === member.id && isSameMonth(new Date(p.date), selectedDate))
        .reduce((sum, p) => sum + p.amount, 0);

      let status: MemberBalance['status'] = 'unpaid';
      if (balance >= 0) status = 'paid';
      if (balance > member.monthlyAmount) status = 'ahead';
      if (balance < 0) status = 'pending';

      return {
        member,
        totalDue,
        totalPaid,
        balance,
        dueThisMonth,
        paidThisMonth,
        status,
      };
    });
  }, [members, payments, selectedDate]);

  const totalOutstanding = useMemo(() => {
    return balances.reduce((sum, b) => (b.balance < 0 ? sum + b.balance : sum), 0);
  }, [balances]);

  const statusInfo = {
    paid: {
      Icon: CheckCircle2,
      label: 'Paid',
      className: 'bg-green-500/20 text-green-300 border-green-500/30',
      iconClass: 'text-green-400'
    },
    ahead: {
      Icon: CheckCircle2,
      label: 'Ahead',
      className: 'bg-primary/20 text-primary-foreground/80 border-primary/30',
      iconClass: 'text-primary'
    },
    pending: {
      Icon: AlertTriangle,
      label: 'Pending',
      className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      iconClass: 'text-yellow-400'
    },
    unpaid: {
      Icon: XCircle,
      label: 'Unpaid',
      className: 'bg-red-500/20 text-red-300 border-red-500/30',
      iconClass: 'text-red-400'
    },
  };

  if(members.filter(m => m.isActive).length === 0) {
      return (
        <div className="text-center py-10 rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">No active members to display balance for.</p>
        </div>
      )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Total Outstanding Balance</CardTitle>
          <CardDescription>Sum of all pending balances across all members.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className={`text-4xl font-bold ${totalOutstanding < 0 ? 'text-destructive' : 'text-green-400'}`}>
            {formatCurrency(totalOutstanding)}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {balances.map(b => {
            const currentStatusInfo = b.paidThisMonth === 0 && b.balance < 0 ? statusInfo.unpaid : statusInfo[b.status];
            const progress = b.dueThisMonth > 0 ? Math.min((b.paidThisMonth / b.dueThisMonth) * 100, 100) : (b.balance > 0 ? 100 : 0);
            
            return (
            <Card key={b.member.id} className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>{b.member.name}</CardTitle>
                            <CardDescription>Overall Balance: <span className={b.balance < 0 ? 'text-destructive' : 'text-green-400'}>{formatCurrency(b.balance)}</span></CardDescription>
                        </div>
                        <Badge variant="outline" className={currentStatusInfo.className}>{currentStatusInfo.label}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                   <p className="text-sm text-muted-foreground">This Month's Payment</p>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">{formatCurrency(b.paidThisMonth)}</span>
                        <span className="text-sm text-muted-foreground">/ {formatCurrency(b.dueThisMonth)}</span>
                    </div>
                   <Progress value={progress} className={b.status === 'pending' ? '[&>div]:bg-yellow-400' : ''} />
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <currentStatusInfo.Icon className={`h-3.5 w-3.5 ${currentStatusInfo.iconClass}`} />
                        <span>
                        {b.status === 'pending' && `${formatCurrency(Math.abs(b.balance))} behind.`}
                        {b.status === 'paid' && `Fully paid up.`}
                        {b.status === 'ahead' && `${formatCurrency(b.balance)} ahead.`}
                        {b.status === 'unpaid' && b.dueThisMonth > 0 && `Unpaid this month.`}
                        {b.status === 'unpaid' && b.dueThisMonth === 0 && `Not yet started.`}
                        </span>
                    </p>
                </CardFooter>
            </Card>
            )
        })}
      </div>
    </div>
  );
}
