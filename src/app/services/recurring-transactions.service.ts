import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RecurringTransaction } from '../core/models/finance.models';

const STORAGE_KEY = 'bm_recurring_v1';

@Injectable({ providedIn: 'root' })
export class RecurringTransactionsService {
  private recurring$ = new BehaviorSubject<RecurringTransaction[]>(this.load());
  recurring = this.recurring$.asObservable();

  add(recurring: RecurringTransaction) {
    this.recurring$.next([...this.recurring$.value, recurring]);
    this.persist();
  }

  update(id: string, patch: Partial<RecurringTransaction>) {
    this.recurring$.next(this.recurring$.value.map(r => (r.id === id ? { ...r, ...patch } : r)));
    this.persist();
  }

  remove(id: string) {
    this.recurring$.next(this.recurring$.value.filter(r => r.id !== id));
    this.persist();
  }

  getDueToday(): RecurringTransaction[] {
    const today = new Date().toISOString().split('T')[0];
    return this.recurring$.value.filter(r => r.isActive && r.nextDueDate <= today);
  }

  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.recurring$.value));
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







