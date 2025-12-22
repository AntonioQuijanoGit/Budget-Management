import { Transaction, Category } from '../core/models/finance.models';
import { monthKey } from './date';

const primaryColor = tokenColor('--color-primary', '#007aff');

export const totalByType = (
  tx: Transaction[],
  type: 'income' | 'expense'
): number => tx.filter(t => t.type === type).reduce((acc, t) => acc + t.amount, 0);

export const balance = (tx: Transaction[]): number =>
  totalByType(tx, 'income') - totalByType(tx, 'expense');

export const groupExpensesByCategory = (
  tx: Transaction[],
  categories: Category[]
): { label: string; value: number; color: string }[] => {
  if (!tx || !Array.isArray(tx) || tx.length === 0) {
    return [];
  }
  
  if (!categories || !Array.isArray(categories)) {
    return [];
  }
  
  const grouped = new Map<string, number>();
  const expenseTransactions = tx.filter(t => t && t.type === 'expense');
  
  if (expenseTransactions.length === 0) {
    return [];
  }
  
  expenseTransactions.forEach(t => {
    if (t.categoryId) {
      grouped.set(t.categoryId, (grouped.get(t.categoryId) || 0) + (t.amount || 0));
    }
  });
  
  if (grouped.size === 0) {
    return [];
  }
  
  return [...grouped.entries()].map(([categoryId, value]) => {
    const cat = categories.find(c => c && c.id === categoryId);
    return { 
      label: cat?.name || categoryId || 'Unknown', 
      value, 
      color: cat?.color || primaryColor 
    };
  }).filter(item => item.value > 0); // Filtrar valores cero
};

export const trendByMonth = (tx: Transaction[]): { month: string; income: number; expense: number }[] => {
  const byMonth = new Map<string, { income: number; expense: number }>();
  tx.forEach(t => {
    const key = monthKey(t.date);
    const current = byMonth.get(key) || { income: 0, expense: 0 };
    current[t.type] += t.amount;
    byMonth.set(key, current);
  });
  return [...byMonth.entries()]
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([month, v]) => ({ month, income: v.income, expense: v.expense }));
};

function tokenColor(name: string, fallback: string) {
  if (typeof document !== 'undefined') {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (value) return value;
  }
  return fallback;
}

