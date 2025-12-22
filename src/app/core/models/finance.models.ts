export type TransactionType = 'expense' | 'income';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type?: TransactionType;
  budgetMonthly?: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  categoryId: string;
  amount: number;
  date: string; // ISO string
  description: string;
  notes?: string;
  tags?: string[];
  accountId?: string;
  receiptUrl?: string;
  isRecurring?: boolean;
}

export interface BudgetAlert {
  categoryId: string;
  spent: number;
  limit: number;
  ratio: number;
}

export interface FinancialGoal {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string; // ISO string
  categoryId?: string;
  type: 'savings' | 'debt' | 'expense_limit' | 'income_target';
  icon?: string;
  color?: string;
  createdAt: string;
}

export interface RecurringTransaction {
  id: string;
  transactionId?: string; // ID of the template transaction
  name: string;
  type: TransactionType;
  categoryId: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string; // ISO string
  endDate?: string; // ISO string
  nextDueDate: string; // ISO string
  isActive: boolean;
  description?: string;
  notes?: string;
  tags?: string[];
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO string
  time?: string; // HH:mm format
  type: 'transaction' | 'bill' | 'goal' | 'budget';
  relatedId?: string; // ID of related entity
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
}

