'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Member, Payment } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase-client';

interface DataContextType {
  members: Member[];
  payments: Payment[];
  loading: boolean;
  addMember: (data: Omit<Member, 'id' | 'createdAt'>) => Promise<void>;
  updateMember: (id: string, data: Partial<Omit<Member, 'id' | 'createdAt'>>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  addPayment: (data: Omit<Payment, 'id'>) => Promise<void>;
  getMemberById: (id: string) => Member | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [membersRes, paymentsRes] = await Promise.all([
        supabase.from('members').select('*').order('createdAt', { ascending: true }),
        supabase.from('payments').select('*').order('date', { ascending: false })
      ]);

      if (membersRes.error) throw membersRes.error;
      if (paymentsRes.error) throw paymentsRes.error;
      
      setMembers(membersRes.data as Member[]);
      setPayments(paymentsRes.data as Payment[]);

    } catch (error: any) {
      console.error("Failed to load data from Supabase", error);
      toast({
        title: "Database Error",
        description: `Could not load data: ${error.message}`,
        variant: "destructive",
      });
    } finally {
        setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const addMember = useCallback(async (data: Omit<Member, 'id' | 'createdAt'>) => {
    const newMember = { ...data, createdAt: new Date().toISOString() };
    const { data: insertedData, error } = await supabase
      .from('members')
      .insert(newMember)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding member:', error);
      toast({ title: "Error", description: "Could not add member.", variant: "destructive" });
    } else if (insertedData) {
      setMembers(prev => [...prev, insertedData as Member]);
    }
  }, [toast]);

  const updateMember = useCallback(async (id: string, data: Partial<Omit<Member, 'id' | 'createdAt'>>) => {
    const { data: updatedData, error } = await supabase
      .from('members')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating member:', error);
      toast({ title: "Error", description: "Could not update member.", variant: "destructive" });
    } else if (updatedData) {
      setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updatedData } : m));
    }
  }, [toast]);

  const deleteMember = useCallback(async (id: string) => {
    // Supabase cascade delete should handle payments if set up correctly.
    const { error } = await supabase.from('members').delete().eq('id', id);

    if (error) {
       console.error('Error deleting member:', error);
       toast({ title: "Error", description: "Could not delete member.", variant: "destructive" });
    } else {
       setMembers(prev => prev.filter(m => m.id !== id));
       setPayments(prev => prev.filter(p => p.memberId !== id)); 
    }
  }, [toast]);

  const addPayment = useCallback(async (data: Omit<Payment, 'id'>) => {
    const { data: insertedData, error } = await supabase
        .from('payments')
        .insert(data)
        .select()
        .single();
    
    if (error) {
        console.error('Error adding payment:', error);
        toast({ title: "Error", description: "Could not add payment.", variant: "destructive" });
    } else if (insertedData) {
        setPayments(prev => [insertedData as Payment, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, [toast]);

  const getMemberById = useCallback((id: string) => {
      return members.find(m => m.id === id);
  }, [members])

  const value = {
    members,
    payments,
    loading,
    addMember,
    updateMember,
    deleteMember,
    addPayment,
    getMemberById
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
