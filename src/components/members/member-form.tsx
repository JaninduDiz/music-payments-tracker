'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { Member } from '@/types';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  monthlyAmount: z.coerce.number().positive({
    message: 'Monthly amount must be a positive number.',
  }),
  isActive: z.boolean(),
});

type MemberFormValues = z.infer<typeof formSchema>;

interface MemberFormProps {
  onSubmit: (data: MemberFormValues) => Promise<void>;
  onFinished: () => void;
  member?: Member | null;
}

export function MemberForm({ onSubmit, onFinished, member }: MemberFormProps) {
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: member?.name || '',
      monthlyAmount: member?.monthlyAmount || 0,
      isActive: member?.isActive ?? true,
    },
  });

  const handleSubmit = async (data: MemberFormValues) => {
    await onSubmit(data);
    onFinished();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="monthlyAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Payment Amount</FormLabel>
              <FormControl>
                <div className="relative">
                    <Input type="number" placeholder="5000.00" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Member</FormLabel>
                </div>
                <FormControl>
                    <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                </FormControl>
                </FormItem>
            )}
        />
        <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onFinished}>Cancel</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>{member ? 'Save Changes' : 'Add Member'}</Button>
        </div>
      </form>
    </Form>
  );
}
