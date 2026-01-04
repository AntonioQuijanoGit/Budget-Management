import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from '../core/models/finance.models';
import { AppStore } from '../core/store/app.store';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private store = inject(AppStore);
  private tx$ = new BehaviorSubject<Transaction[]>(this.store.transactions());
  
  // Sync with AppStore - convert signal to observable for compatibility
  transactions$ = toObservable(this.store.transactions);

  constructor() {
    // Initialize from store
    this.tx$.next(this.store.transactions());
    
    // Keep BehaviorSubject in sync with AppStore for backward compatibility
    this.store.transactions.subscribe(tx => {
      if (JSON.stringify(tx) !== JSON.stringify(this.tx$.value)) {
        this.tx$.next(tx);
      }
    });
  }

  add(tx: Transaction) {
    this.store.addTransaction(tx);
    // BehaviorSubject will update via subscription
  }

  update(id: string, patch: Partial<Transaction>) {
    this.store.updateTransaction(id, patch);
    // BehaviorSubject will update via subscription
  }

  remove(id: string) {
    this.store.removeTransaction(id);
    // BehaviorSubject will update via subscription
  }

  clear() {
    this.store.setTransactions([]);
    // BehaviorSubject will update via subscription
  }
}

