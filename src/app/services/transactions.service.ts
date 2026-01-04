import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from '../core/models/finance.models';

const STORAGE_KEY = 'bm_transactions_v1';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private tx$ = new BehaviorSubject<Transaction[]>(this.load());
  transactions$ = this.tx$.asObservable();

  add(tx: Transaction) {
    const next = [...this.tx$.value, tx];
    this.save(next);
  }

  update(id: string, patch: Partial<Transaction>) {
    const next = this.tx$.value.map(t => (t.id === id ? { ...t, ...patch } : t));
    this.save(next);
  }

  remove(id: string) {
    const next = this.tx$.value.filter(t => t.id !== id);
    this.save(next);
  }

  clear() {
    this.save([]);
  }

  private save(data: Transaction[]) {
    try {
      this.tx$.next(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e: any) {
      console.error('Error saving transactions', e);
      // Handle quota exceeded error
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        // Try to clear old data or notify user
        console.warn('localStorage quota exceeded. Consider clearing old data.');
        // Still update the in-memory state even if localStorage fails
        this.tx$.next(data);
        throw new Error('Storage quota exceeded. Please clear some old transactions or export your data.');
      }
      throw e;
    }
  }

  private load(): Transaction[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Transaction[]) : [];
    } catch (e) {
      console.error('Error loading transactions', e);
      return [];
    }
  }
}

