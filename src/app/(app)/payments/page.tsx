
'use client';

import { PaymentForm } from '@/components/payments/payment-form';
import { RecentPayments } from '@/components/payments/recent-payments';
import { Suspense } from 'react';

function PaymentsContent() {
    return (
       <div className="flex flex-col h-full">
            <div className="container mx-auto max-w-6xl p-4 md:p-6 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
                 <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto max-w-6xl p-4 md:p-6">
                    <div className="grid gap-8 lg:grid-cols-5">
                        <div className="space-y-8 lg:col-span-2">
                            <PaymentForm />
                        </div>
                        <div className="lg:col-span-3">
                            <RecentPayments />
                        </div>
                    </div>
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
