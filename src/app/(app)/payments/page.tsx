'use client';

import { PaymentForm } from '@/components/payments/payment-form';
import { RecentPayments } from '@/components/payments/recent-payments';
import { useToast } from "@/hooks/use-toast"
import { useData } from '@/context/data-context';
import { useEffect } from 'react';

export default function PaymentsPage() {
    const { addPayment } = useData();
    const { toast } = useToast();

    const handleAddPayment = (data: any) => {
        addPayment(data);
        toast({
            title: "Payment Added",
            description: `Payment of ${data.amount} for has been recorded.`,
        })
    };
    
    return (
        <div className="container mx-auto max-w-6xl p-4 md:p-6">
            <div className="mb-6">
                 <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                 <p className="text-muted-foreground">Record new payments and view recent activity.</p>
            </div>
            <div className="grid gap-8 lg:grid-cols-5">
                <div className="lg:col-span-2">
                    <PaymentForm />
                </div>
                <div className="lg:col-span-3">
                    <RecentPayments />
                </div>
            </div>
        </div>
    );
}
