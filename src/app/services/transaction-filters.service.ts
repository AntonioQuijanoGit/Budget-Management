import { Injectable, signal } from '@angular/core';
import { Transaction, TransactionType } from '../core/models/finance.models';
import { isWithinRange } from '../utils/date';

export type TransactionFilters = {
  type: 'all' | TransactionType;
  categoryId: 'all' | string;
  min?: number;
  max?: number;
  q: string;
  from?: string;
  to?: string;
};

@Injectable({ providedIn: 'root' })
export class TransactionFiltersService {
  filters = signal<TransactionFilters>({
    type: 'all',
    categoryId: 'all',
    min: undefined,
    max: undefined,
    q: '',
    from: undefined,
    to: undefined,
  });

  apply(list: Transaction[]): Transaction[] {
    const f = this.filters();
    return list.filter(t => {
      if (f.type !== 'all' && t.type !== f.type) return false;
      if (f.categoryId !== 'all' && t.categoryId !== f.categoryId) return false;
      if (f.min !== undefined && t.amount < f.min) return false;
      if (f.max !== undefined && t.amount > f.max) return false;
      if (f.from || f.to) {
        if (!isWithinRange(t.date, { from: f.from, to: f.to })) return false;
      }
      if (f.q && !`${t.description} ${(t.tags || []).join(' ')}`.toLowerCase().includes(f.q.toLowerCase())) {
        return false;
      }
      return true;
    });
  }
}









