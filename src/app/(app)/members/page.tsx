
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users } from 'lucide-react';
import { MemberList } from '@/components/members/member-list';
import { MemberForm } from '@/components/members/member-form';
import type { Member } from '@/types';
import { useData } from '@/context/data-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from '@/components/ui/skeleton';

export default function MembersPage() {
  const { addMember, updateMember, loading } = useData();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (data: Omit<Member, 'id' | 'createdAt'>) => {
    if (selectedMember) {
      await updateMember(selectedMember.id, data);
      toast({
          title: "Member Updated",
          description: `${data.name} has been updated successfully.`,
        })
    } else {
      await addMember(data);
       toast({
          title: "Member Added",
          description: `${data.name} has been added successfully.`,
        })
    }
  };

  const openForm = (member: Member | null = null) => {
    setSelectedMember(member);
    setIsFormOpen(true);
  }
  
  const MemberListSkeleton = () => (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
      </div>
  )


  return (
    <div className="flex flex-col h-full">
       <div className="container mx-auto max-w-4xl p-4 md:p-6 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="grid gap-1">
                <h1 className="text-3xl font-bold tracking-tight">Members</h1>
            </div>
            <Button onClick={() => openForm()} size="sm" className="shrink-0">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </div>
       </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-4xl p-4 md:p-6">
            {loading ? <MemberListSkeleton /> : <MemberList onEdit={openForm} />}
        </div>
      </div>


      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMember ? 'Edit Member' : 'Add New Member'}</DialogTitle>
            <DialogDescription>
                {selectedMember ? 'Update the details for this member.' : 'Add a new member to start tracking payments.'}
            </DialogDescription>
          </DialogHeader>
          <MemberForm
            onSubmit={handleFormSubmit}
            onFinished={() => setIsFormOpen(false)}
            member={selectedMember}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
