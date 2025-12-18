
import { TransactionType, BankAccount, Category, Transaction } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '飲食', icon: 'fa-utensils', type: TransactionType.EXPENSE },
  { id: '2', name: '交通', icon: 'fa-bus', type: TransactionType.EXPENSE },
  { id: '3', name: '娛樂', icon: 'fa-gamepad', type: TransactionType.EXPENSE },
  { id: '4', name: '購物', icon: 'fa-bag-shopping', type: TransactionType.EXPENSE },
  { id: '5', name: '薪資', icon: 'fa-money-bill-wave', type: TransactionType.INCOME },
  { id: '6', name: '投資回報', icon: 'fa-chart-line', type: TransactionType.INCOME },
  { id: '7', name: '房租/貸款', icon: 'fa-house', type: TransactionType.EXPENSE },
  { id: '8', name: '其他', icon: 'fa-ellipsis', type: TransactionType.EXPENSE },
];

export const DEMO_ACCOUNTS: BankAccount[] = [
  { id: 'acc-1', name: '國泰世華 薪轉', balance: 45000, type: 'Savings', color: 'bg-green-600' },
  { id: 'acc-2', name: '台新 Richart', balance: 120000, type: 'Checking', color: 'bg-red-500' },
  { id: 'acc-3', name: '現金', balance: 2500, type: 'Cash', color: 'bg-slate-700' },
];

export const DEMO_TRANSACTIONS: Transaction[] = [
  { id: 't-1', accountId: 'acc-1', categoryId: '5', amount: 50000, date: '2023-10-05', description: '九月份薪資', type: TransactionType.INCOME },
  { id: 't-2', accountId: 'acc-3', categoryId: '1', amount: 150, date: '2023-10-06', description: '早餐三明治', type: TransactionType.EXPENSE },
  { id: 't-3', accountId: 'acc-2', categoryId: '4', amount: 3500, date: '2023-10-07', description: '新款耳機', type: TransactionType.EXPENSE },
  { id: 't-4', accountId: 'acc-1', categoryId: '7', amount: 12000, date: '2023-10-10', description: '房租轉帳', type: TransactionType.EXPENSE },
  { id: 't-5', accountId: 'acc-2', categoryId: '2', amount: 500, date: '2023-10-12', description: '加油', type: TransactionType.EXPENSE },
];
