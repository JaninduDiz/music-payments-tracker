'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Sparkles, Search } from 'lucide-react';
import { findPaymentsByQuery } from '@/ai/flows/payment-query-flow';
import { useData } from '@/context/data-context';
import type { Payment } from '@/types';
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  query: z.string().min(5, {
    message: 'Please ask a more detailed question.',
  }),
});

type SearchFormValues = z.infer<typeof formSchema>;

interface AISearchProps {
  onResults: (payments: Payment[] | null) => void;
}

export function AISearch({ onResults }: AISearchProps) {
  const { members, payments } = useData();
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
    },
  });

  const handleSubmit = async (data: SearchFormValues) => {
    setIsSearching(true);
    onResults(null);
    try {
      const result = await findPaymentsByQuery({
        query: data.query,
        members,
        payments,
      });

      if (result.paymentIds.length > 0) {
        const foundPayments = payments.filter(p => result.paymentIds.includes(p.id));
        onResults(foundPayments);
        toast({
            title: "Search Complete",
            description: `Found ${foundPayments.length} payment(s).`,
        })
      } else {
        onResults([]);
        toast({
            title: "No Results",
            description: "Could not find any payments matching your query.",
        })
      }
    } catch (error) {
      console.error("AI search error:", error);
      onResults(payments); // Revert to full list on error
      toast({
            title: "Search Error",
            description: "Something went wrong with the AI search.",
            variant: "destructive"
        })
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleReset = () => {
    form.reset();
    onResults(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span>AI Payment Search</span>
        </CardTitle>
        <CardDescription>Ask a question to find payments. For example: "Show all payments for John Doe".</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input placeholder="e.g. all payments for Jane" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={isSearching}>
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
                <Button type="button" variant="ghost" onClick={handleReset} disabled={isSearching}>Reset</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
