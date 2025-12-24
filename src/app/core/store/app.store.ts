import { Injectable, computed, signal } from '@angular/core';
import { Transaction } from '../models/finance.models';
import { Category } from '../models/finance.models';
import { FinancialGoal } from '../models/finance.models';
import { Reminder } from '../models/finance.models';
import { RecurringTransaction } from '../models/finance.models';

/**
 * App Store - Centralized state management using Signals
 * Equivalent to Zustand in React/Next.js stack
 * 
 * This store centralizes all application state for better reactivity
 * and easier state management across the app.
 */
export interface AppState {
  // Transactions
  transactions: Transaction[];
  
  // Categories
  categories: Category[];
  
  // Goals
  goals: FinancialGoal[];
  
  // Reminders
  reminders: Reminder[];
  
  // Recurring transactions
  recurringTransactions: RecurringTransaction[];
  
  // Budget
  budget: number;
  
  // Config
  currency: string;
  locale: string;
  
  // UI State
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
}

const DEFAULT_STATE: AppState = {
  transactions: [],
  categories: [],
  goals: [],
  reminders: [],
  recurringTransactions: [],
  budget: 0,
  currency: 'EUR',
  locale: 'es-ES',
  theme: 'dark',
  sidebarOpen: true,
};

@Injectable({ providedIn: 'root' })
export class AppStore {
  // Private signals - internal state
  private state = signal<AppState>(this.loadState());

  // Public readonly signals - computed values
  readonly transactions = computed(() => this.state().transactions);
  readonly categories = computed(() => this.state().categories);
  readonly goals = computed(() => this.state().goals);
  readonly reminders = computed(() => this.state().reminders);
  readonly recurringTransactions = computed(() => this.state().recurringTransactions);
  readonly budget = computed(() => this.state().budget);
  readonly currency = computed(() => this.state().currency);
  readonly locale = computed(() => this.state().locale);
  readonly theme = computed(() => this.state().theme);
  readonly sidebarOpen = computed(() => this.state().sidebarOpen);

  // Computed values - derived state
  readonly totalIncome = computed(() =>
    this.transactions()
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  readonly totalExpenses = computed(() =>
    this.transactions()
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  readonly balance = computed(() => this.totalIncome() - this.totalExpenses());

  readonly transactionsByCategory = computed(() => {
    const transactions = this.transactions();
    const grouped = new Map<string, Transaction[]>();
    
    transactions.forEach(tx => {
      const categoryId = tx.categoryId || 'uncategorized';
      if (!grouped.has(categoryId)) {
        grouped.set(categoryId, []);
      }
      grouped.get(categoryId)!.push(tx);
    });
    
    return grouped;
  });

  // Actions - State mutations
  setTransactions(transactions: Transaction[]) {
    this.updateState({ transactions });
    this.persist();
  }

  addTransaction(transaction: Transaction) {
    this.updateState({
      transactions: [...this.state().transactions, transaction],
    });
    this.persist();
  }

  updateTransaction(id: string, patch: Partial<Transaction>) {
    this.updateState({
      transactions: this.state().transactions.map(t =>
        t.id === id ? { ...t, ...patch } : t
      ),
    });
    this.persist();
  }

  removeTransaction(id: string) {
    this.updateState({
      transactions: this.state().transactions.filter(t => t.id !== id),
    });
    this.persist();
  }

  setCategories(categories: Category[]) {
    this.updateState({ categories });
    this.persist();
  }

  addCategory(category: Category) {
    this.updateState({
      categories: [...this.state().categories, category],
    });
    this.persist();
  }

  updateCategory(id: string, patch: Partial<Category>) {
    this.updateState({
      categories: this.state().categories.map(c =>
        c.id === id ? { ...c, ...patch } : c
      ),
    });
    this.persist();
  }

  removeCategory(id: string) {
    this.updateState({
      categories: this.state().categories.filter(c => c.id !== id),
    });
    this.persist();
  }

  setGoals(goals: FinancialGoal[]) {
    this.updateState({ goals });
    this.persist();
  }

  addGoal(goal: FinancialGoal) {
    this.updateState({
      goals: [...this.state().goals, goal],
    });
    this.persist();
  }

  updateGoal(id: string, patch: Partial<FinancialGoal>) {
    this.updateState({
      goals: this.state().goals.map(g =>
        g.id === id ? { ...g, ...patch } : g
      ),
    });
    this.persist();
  }

  removeGoal(id: string) {
    this.updateState({
      goals: this.state().goals.filter(g => g.id !== id),
    });
    this.persist();
  }

  setReminders(reminders: Reminder[]) {
    this.updateState({ reminders });
    this.persist();
  }

  addReminder(reminder: Reminder) {
    this.updateState({
      reminders: [...this.state().reminders, reminder],
    });
    this.persist();
  }

  updateReminder(id: string, patch: Partial<Reminder>) {
    this.updateState({
      reminders: this.state().reminders.map(r =>
        r.id === id ? { ...r, ...patch } : r
      ),
    });
    this.persist();
  }

  removeReminder(id: string) {
    this.updateState({
      reminders: this.state().reminders.filter(r => r.id !== id),
    });
    this.persist();
  }

  setRecurringTransactions(recurring: RecurringTransaction[]) {
    this.updateState({ recurringTransactions: recurring });
    this.persist();
  }

  addRecurringTransaction(recurring: RecurringTransaction) {
    this.updateState({
      recurringTransactions: [...this.state().recurringTransactions, recurring],
    });
    this.persist();
  }

  updateRecurringTransaction(id: string, patch: Partial<RecurringTransaction>) {
    this.updateState({
      recurringTransactions: this.state().recurringTransactions.map(r =>
        r.id === id ? { ...r, ...patch } : r
      ),
    });
    this.persist();
  }

  removeRecurringTransaction(id: string) {
    this.updateState({
      recurringTransactions: this.state().recurringTransactions.filter(r => r.id !== id),
    });
    this.persist();
  }

  setBudget(budget: number) {
    this.updateState({ budget });
    this.persist();
  }

  setCurrency(currency: string) {
    this.updateState({ currency });
    this.persist();
  }

  setLocale(locale: string) {
    this.updateState({ locale });
    this.persist();
  }

  setTheme(theme: 'dark' | 'light') {
    this.updateState({ theme });
    document.documentElement.className = theme;
    this.persist();
  }

  toggleSidebar() {
    this.updateState({
      sidebarOpen: !this.state().sidebarOpen,
    });
  }

  // Helper methods
  private updateState(partial: Partial<AppState>) {
    this.state.update(current => ({ ...current, ...partial }));
  }

  private persist() {
    try {
      const state = this.state();
      // Only persist data, not UI state
      const persistable = {
        transactions: state.transactions,
        categories: state.categories,
        goals: state.goals,
        reminders: state.reminders,
        recurringTransactions: state.recurringTransactions,
        budget: state.budget,
        currency: state.currency,
        locale: state.locale,
        theme: state.theme,
      };
      localStorage.setItem('bm_app_store_v1', JSON.stringify(persistable));
    } catch (e) {
      console.error('Error persisting state', e);
    }
  }

  private loadState(): AppState {
    try {
      const stored = localStorage.getItem('bm_app_store_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all properties exist
        return { ...DEFAULT_STATE, ...parsed };
      }
    } catch (e) {
      console.error('Error loading state', e);
    }
    return DEFAULT_STATE;
  }

  // Reset store (useful for testing or resetting app)
  reset() {
    this.state.set(DEFAULT_STATE);
    localStorage.removeItem('bm_app_store_v1');
  }
}

