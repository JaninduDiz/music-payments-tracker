'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Member, Payment } from '@/types';
import { useToast } from "@/hooks/use-toast"

interface DataContextType {
  members: Member[];
  payments: Payment[];
  loading: boolean;
  addMember: (data: Omit<Member, 'id' | 'createdAt'>) => void;
  updateMember: (id: string, data: Partial<Omit<Member, 'id' | 'createdAt'>>) => void;
  deleteMember: (id: string) => void;
  addPayment: (data: Omit<Payment, 'id'>) => void;
  getMemberById: (id: string) => Member | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedMembers = localStorage.getItem('music-payments-members');
      const storedPayments = localStorage.getItem('music-payments-payments');
      if (storedMembers) setMembers(JSON.parse(storedMembers));
      if (storedPayments) setPayments(JSON.parse(storedPayments));
    } catch (error) {
      console.error("Failed to load data from local storage", error);
      toast({
        title: "Error",
        description: "Could not load saved data.",
        variant: "destructive",
      });
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('music-payments-members', JSON.stringify(members));
      } catch (error) {
        console.error("Failed to save members to local storage", error);
        toast({
            title: "Error",
            description: "Could not save member data.",
            variant: "destructive",
          });
      }
    }
  }, [members, loading, toast]);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('music-payments-payments', JSON.stringify(payments));
      } catch (error) {
        console.error("Failed to save payments to local storage", error);
         toast({
            title: "Error",
            description: "Could not save payment data.",
            variant: "destructive",
          });
      }
    }
  }, [payments, loading, toast]);

  const addMember = useCallback((data: Omit<Member, 'id' | 'createdAt'>) => {
    const newMember: Member = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setMembers(prev => [...prev, newMember]);
  }, []);

  const updateMember = useCallback((id: string, data: Partial<Omit<Member, 'id' | 'createdAt'>>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
  }, []);

  const deleteMember = useCallback((id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    setPayments(prev => prev.filter(p => p.memberId !== id)); // Also delete associated payments
  }, []);

  const addPayment = useCallback((data: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...data,
      id: crypto.randomUUID(),
    };
    setPayments(prev => [newPayment, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

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
