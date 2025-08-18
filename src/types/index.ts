
export interface Member {
  id: string;
  name: string;
  monthlyAmount: number;
  isActive: boolean;
  createdAt: string; // ISO 8601 string format
}

export interface Payment {
  id: string;
  memberId: string;
  amount: number;
  date: string; // ISO 8601 string format
}
