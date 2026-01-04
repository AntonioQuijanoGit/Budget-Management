import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RecurringTransaction } from '../core/models/finance.models';
import { AppStore } from '../core/store/app.store';
import { toObservable } from '@angular/core/rxjs-interop';

const STORAGE_KEY = 'bm_recurring_v1';

@Injectable({ providedIn: 'root' })
export class RecurringTransactionsService {
  private store = inject(AppStore);
  private recurring$ = new BehaviorSubject<RecurringTransaction[]>(this.store.recurringTransactions());
  
  // Sync with AppStore
  recurring = toObservable(this.store.recurringTransactions);

  constructor() {
    // Initialize from store
    const storeRecurring = this.store.recurringTransactions();
    if (storeRecurring.length === 0) {
      const legacy = this.load();
      if (legacy.length > 0) {
        this.store.setRecurringTransactions(legacy);
        this.recurring$.next(legacy);
      }
    } else {
      this.recurring$.next(storeRecurring);
    }
    
    // Keep BehaviorSubject in sync with AppStore
    this.recurring.subscribe(recurring => {
      if (JSON.stringify(recurring) !== JSON.stringify(this.recurring$.value)) {
        this.recurring$.next(recurring);
      }
    });
  }

  add(recurring: RecurringTransaction) {
    this.store.addRecurringTransaction(recurring);
    // BehaviorSubject will update via subscription
  }

  update(id: string, patch: Partial<RecurringTransaction>) {
    this.store.updateRecurringTransaction(id, patch);
    // BehaviorSubject will update via subscription
  }

  remove(id: string) {
    this.store.removeRecurringTransaction(id);
    // BehaviorSubject will update via subscription
  }

  getDueToday(): RecurringTransaction[] {
    const today = new Date().toISOString().split('T')[0];
    return this.store.recurringTransactions()
      .filter(r => r.isActive && r.nextDueDate <= today);
  }

  private load(): RecurringTransaction[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}











