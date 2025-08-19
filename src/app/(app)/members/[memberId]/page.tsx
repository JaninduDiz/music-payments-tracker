
'use client';

import { useParams } from 'next/navigation';
import { useData } from '@/context/data-context';
import { RecentPayments } from '@/components/payments/recent-payments';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

function MemberPaymentPageContent() {
    const params = useParams();
    const { getMemberById, loading } = useData();
    const memberId = params.memberId as string;
    const member = getMemberById(memberId);

    if (loading) {
        return (
             <div className="container mx-auto max-w-4xl p-4 md:p-6 space-y-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    if (!member) {
        return (
            <div className="container mx-auto max-w-4xl p-4 md:p-6 text-center">
                <p>Member not found.</p>
                <Button asChild variant="link">
                    <Link href="/members">Go back to members</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-4xl p-4 md:p-6">
            <div className="mb-6">
                <Button asChild variant="ghost" className="-ml-4 mb-2">
                    <Link href="/members">
                        <ArrowLeft className="mr-2" />
                        Back to Members
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Payments for {member.name}</h1>
                <p className="text-muted-foreground">A complete history of payments for this member.</p>
            </div>
            <RecentPayments memberId={memberId} />
        </div>
    )
}


export default function MemberPaymentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MemberPaymentPageContent />
        </Suspense>
    )
}
