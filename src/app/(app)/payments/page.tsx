
'use client';

import { PaymentForm } from '@/components/payments/payment-form';
import { RecentPayments } from '@/components/payments/recent-payments';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentsContent() {
    return (
        <div className="container mx-auto max-w-6xl p-4 md:p-6">
            <div className="mb-6">
                 <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                 <p className="text-muted-foreground">Record new payments and view recent activity.</p>
            </div>
            <div className="grid gap-8 lg:grid-cols-5">
                <div className="space-y-8 lg:col-span-2">
                    <PaymentForm />
                </div>
                <div className="lg:col-span-3">
                    <RecentPayments />
                </div>
            </div>
        </div>
    );
}


export default function PaymentsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentsContent />
        </Suspense>
    )
}
