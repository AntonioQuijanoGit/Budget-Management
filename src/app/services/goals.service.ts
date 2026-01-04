import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { FinancialGoal, Transaction } from '../core/models/finance.models';
import { TransactionsService } from './transactions.service';
import { AppStore } from '../core/store/app.store';
import { toObservable } from '@angular/core/rxjs-interop';

const STORAGE_KEY = 'bm_goals_v1';

@Injectable({ providedIn: 'root' })
export class GoalsService {
  private store = inject(AppStore);
  private txService = inject(TransactionsService);
  private goals$ = new BehaviorSubject<FinancialGoal[]>(this.store.goals());
  
  // Sync with AppStore
  goals = toObservable(this.store.goals);

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
    // Initialize from store
    const storeGoals = this.store.goals();
    if (storeGoals.length === 0) {
      const legacy = this.load();
      if (legacy.length > 0) {
        this.store.setGoals(legacy);
        this.goals$.next(legacy);
      }
    } else {
      this.goals$.next(storeGoals);
    }
    
    // Keep BehaviorSubject in sync with AppStore
    this.goals.subscribe(goals => {
      if (JSON.stringify(goals) !== JSON.stringify(this.goals$.value)) {
        this.goals$.next(goals);
      }
    });
    
    // Subscribe to transactions and auto-update goals
    this.txService.transactions$.subscribe(transactions => {
      this.updateGoalsFromTransactions(transactions);
    });
  }

  add(goal: FinancialGoal) {
    this.store.addGoal(goal);
    // BehaviorSubject will update via subscription
  }

  update(id: string, patch: Partial<FinancialGoal>) {
    this.store.updateGoal(id, patch);
    // BehaviorSubject will update via subscription
  }

  remove(id: string) {
    this.store.removeGoal(id);
    // BehaviorSubject will update via subscription
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
    const currentGoals = this.store.goals();
    const updated = currentGoals.map(goal => ({
      ...goal,
      currentAmount: this.calculateCurrentAmount(goal, transactions)
    }));
    this.store.setGoals(updated);
    // BehaviorSubject will update via subscription
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


