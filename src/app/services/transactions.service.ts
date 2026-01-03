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
    this.tx$.next(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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











