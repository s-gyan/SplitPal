
export interface User {
  id: string;
  name: string;
  avatarColor: string;
}

export interface Group {
  id: string;
  name: string;
  members: string[];
  expenses: Expense[];
}

export enum SplitType {
  Equally = 'equally',
  Unequally = 'unequally',
  Percentage = 'percentage',
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // userId
  date: string;
  split: {
    type: SplitType;
    participants: Array<{ userId: string; amount: number } | string>; // string for equal split, object for unequal
  };
  isSettlement?: boolean;
}

export interface Balance {
  userId: string;
  amount: number; // positive if owed, negative if owes
}

export interface Settlement {
  from: string; // userId
  to: string; // userId
  amount: number;
}
