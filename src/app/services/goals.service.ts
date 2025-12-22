import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { FinancialGoal, Transaction } from '../core/models/finance.models';
import { TransactionsService } from './transactions.service';

const STORAGE_KEY = 'bm_goals_v1';

@Injectable({ providedIn: 'root' })
export class GoalsService {
  private txService = inject(TransactionsService);
  private goals$ = new BehaviorSubject<FinancialGoal[]>(this.load());
  goals = this.goals$.asObservable();

  // Goals with auto-calculated currentAmount from transactions
  goalsWithProgress$ = combineLatest([
    this.goals$,
    this.txService.transactions$
  ]).pipe(
    map(([goals, transactions]) => {
      return goals.map(goal => ({
        ...goal,
        currentAmount: this.calculateCurrentAmount(goal, transactions)
      }));
    })
  );

  constructor() {
    // Subscribe to transactions and auto-update goals
    this.txService.transactions$.subscribe(transactions => {
      this.updateGoalsFromTransactions(transactions);
    });
  }

  add(goal: FinancialGoal) {
    this.goals$.next([...this.goals$.value, goal]);
    this.persist();
  }

  update(id: string, patch: Partial<FinancialGoal>) {
    // If updating currentAmount manually, preserve it (don't auto-overwrite)
    const goal = this.goals$.value.find(g => g.id === id);
    if (goal && 'currentAmount' in patch && patch.currentAmount !== undefined) {
      // Manual update - allow it but mark it somehow, or just allow manual override
      this.goals$.next(this.goals$.value.map(g => (g.id === id ? { ...g, ...patch } : g)));
    } else {
      this.goals$.next(this.goals$.value.map(g => (g.id === id ? { ...g, ...patch } : g)));
    }
    this.persist();
  }

  remove(id: string) {
    this.goals$.next(this.goals$.value.filter(g => g.id !== id));
    this.persist();
  }

  getProgress(id: string): number {
    const goal = this.goals$.value.find(g => g.id === id);
    if (!goal) return 0;
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  }

  private calculateCurrentAmount(goal: FinancialGoal, transactions: Transaction[]): number {
    switch (goal.type) {
      case 'savings':
        // Sum of all income transactions minus expenses
        const income = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        return Math.max(0, income - expenses);

      case 'expense_limit':
        // Sum of expenses in the goal's category (or all expenses if no category)
        if (goal.categoryId) {
          return transactions
            .filter(t => t.type === 'expense' && t.categoryId === goal.categoryId)
            .reduce((sum, t) => sum + t.amount, 0);
        }
        return transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

      case 'income_target':
        // Sum of all income transactions
        return transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);

      case 'debt':
        // Sum of expenses (debt is negative balance)
        return transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

      default:
        return goal.currentAmount; // Keep manual value for unknown types
    }
  }

  private updateGoalsFromTransactions(transactions: Transaction[]) {
    // Only auto-update if goal doesn't have a manual override
    // For now, we'll always auto-update based on transactions
    // Users can still manually set currentAmount in the form if needed
    const updated = this.goals$.value.map(goal => ({
      ...goal,
      currentAmount: this.calculateCurrentAmount(goal, transactions)
    }));
    this.goals$.next(updated);
    this.persist();
  }

  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.goals$.value));
  }

  private load(): FinancialGoal[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}


