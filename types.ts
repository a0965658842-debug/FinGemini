
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface BankAccount {
  id: string;
  name: string;
  balance: number;
  type: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  date: string;
  description: string;
  type: TransactionType;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export type ViewType = 'dashboard' | 'accounts' | 'transactions' | 'reports' | 'tips' | 'ai' | 'profile';

export interface AppState {
  accounts: BankAccount[];
  transactions: Transaction[];
  categories: Category[];
  isDemo: boolean;
}
