
'use client';

import { useParams } from 'next/navigation';
import { useData } from '@/context/data-context';
import { RecentPayments } from '@/components/payments/recent-payments';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MemberBalanceCard } from '@/components/members/member-balance-card';

function MemberPaymentPageContent() {
    const params = useParams();
    const { getMemberById, loading } = useData();
    const memberId = params.memberId as string;
    const member = getMemberById(memberId);

    const PageSkeleton = () => (
         <div className="flex flex-col h-full">
            <div className="container mx-auto max-w-4xl p-4 md:p-6 border-b bg-background">
                <div className="flex items-center gap-4 mb-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-5 w-80 mt-1" />
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto max-w-4xl p-4 md:p-6 space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-64" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center"><Skeleton className="h-9 w-9 rounded-full" /><div className="ml-4 space-y-1"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-32" /></div><Skeleton className="h-5 w-20 ml-auto" /></div>
                            <div className="flex items-center"><Skeleton className="h-9 w-9 rounded-full" /><div className="ml-4 space-y-1"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-32" /></div><Skeleton className="h-5 w-20 ml-auto" /></div>
                            <div className="flex items-center"><Skeleton className="h-9 w-9 rounded-full" /><div className="ml-4 space-y-1"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-32" /></div><Skeleton className="h-5 w-20 ml-auto" /></div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )

    if (loading) {
        return <PageSkeleton />;
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
       <div className="flex flex-col h-full">
            <div className="container mx-auto max-w-4xl p-4 md:p-6 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
                <Button asChild variant="ghost" className="-ml-4 mb-2">
                    <Link href="/members">
                        <ArrowLeft className="mr-2" />
                        Back to Members
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Payments for {member.name}</h1>
                <p className="text-muted-foreground">A complete history of payments for this member.</p>
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto max-w-4xl p-4 md:p-6 space-y-4">
                    <MemberBalanceCard member={member} />
                    <RecentPayments memberId={memberId} />
                </div>
            </div>
        </div>
    )
}


export default function MemberPaymentPage() {
    return (
        <Suspense fallback={<Skeleton className="h-screen w-full" />}>
            <MemberPaymentPageContent />
        </Suspense>
    )
}
