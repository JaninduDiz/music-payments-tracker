'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Trash2, Edit, UserCheck, UserX, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { Member } from '@/types';
import { useData } from '@/context/data-context';
import { formatCurrency } from '@/lib/utils';
import { DeleteMemberAlert } from './delete-member-alert';
import { useRouter } from 'next/navigation';

interface MemberListProps {
  onEdit: (member: Member) => void;
}

export function MemberList({ onEdit }: MemberListProps) {
    const { members, updateMember, deleteMember } = useData();
    const [deletingMember, setDeletingMember] = useState<Member | null>(null);
    const router = useRouter();


    const handleToggleStatus = async (member: Member) => {
        await updateMember(member.id, { isActive: !member.isActive });
    };

    const handleDeleteConfirm = async () => {
        if (deletingMember) {
            await deleteMember(deletingMember.id);
            setDeletingMember(null);
        }
    }

    const handleCardClick = (e: React.MouseEvent, memberId: string) => {
        // Stop propagation if the click is on the dropdown menu button or its children
        if ((e.target as HTMLElement).closest('[data-radix-dropdown-menu-trigger]')) {
            return;
        }
        router.push(`/payments?memberId=${memberId}`);
    }

    if (members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Members Found</h3>
                <p className="mt-2 text-sm text-muted-foreground">Add a new member to get started.</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => (
                    <Card key={member.id} className="flex flex-col cursor-pointer hover:bg-muted/50" onClick={(e) => handleCardClick(e, member.id)}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="grid gap-1">
                                <CardTitle>{member.name}</CardTitle>
                                <CardDescription>{formatCurrency(member.monthlyAmount)} / month</CardDescription>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={(e) => { e.stopPropagation(); onEdit(member); }}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={(e) => { e.stopPropagation(); handleToggleStatus(member); }}>
                                    {member.isActive ? (
                                        <UserX className="mr-2 h-4 w-4" />
                                    ) : (
                                        <UserCheck className="mr-2 h-4 w-4" />
                                    )}
                                    <span>Set as {member.isActive ? 'Inactive' : 'Active'}</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={(e) => { e.stopPropagation(); setDeletingMember(member); }} className="text-destructive focus:text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent className="flex-grow flex items-end">
                            {member.isActive ? (
                                <Badge variant="default" className="bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30">Active</Badge>
                            ) : (
                                <Badge variant="secondary">Inactive</Badge>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
            {deletingMember && (
                <DeleteMemberAlert
                    isOpen={!!deletingMember}
                    onOpenChange={(open) => !open && setDeletingMember(null)}
                    onConfirm={handleDeleteConfirm}
                    memberName={deletingMember.name}
                />
            )}
        </>
    )
}