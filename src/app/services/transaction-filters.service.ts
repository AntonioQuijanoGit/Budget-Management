import { Injectable, signal, effect } from '@angular/core';
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
  isRecurring?: 'all' | 'yes' | 'no';
};

const STORAGE_KEY = 'bm_filters_v1';
const DEFAULT_FILTERS: TransactionFilters = {
  type: 'all',
  categoryId: 'all',
  min: undefined,
  max: undefined,
  q: '',
  from: undefined,
  to: undefined,
  isRecurring: 'all',
};

@Injectable({ providedIn: 'root' })
export class TransactionFiltersService {
  filters = signal<TransactionFilters>(this.load());

  constructor() {
    // Persist filters when they change
    effect(() => {
      const current = this.filters();
      this.persist(current);
    });
  }

  /**
   * Apply quick filter presets
   */
  applyPreset(preset: 'thisMonth' | 'lastMonth' | 'last30Days' | 'thisYear' | 'all') {
    const now = new Date();
    let from: string | undefined;
    let to: string | undefined;

    switch (preset) {
      case 'thisMonth':
        from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        to = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
        break;
      case 'lastMonth':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        from = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1).toISOString().split('T')[0];
        to = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0).toISOString().split('T')[0];
        break;
      case 'last30Days':
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        from = thirtyDaysAgo.toISOString().split('T')[0];
        to = now.toISOString().split('T')[0];
        break;
      case 'thisYear':
        from = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
        to = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0];
        break;
      case 'all':
        from = undefined;
        to = undefined;
        break;
    }

    this.filters.update(f => ({ ...f, from, to }));
  }

  reset() {
    this.filters.set({ ...DEFAULT_FILTERS });
  }

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
      if (f.isRecurring !== 'all') {
        if (f.isRecurring === 'yes' && !t.isRecurring) return false;
        if (f.isRecurring === 'no' && t.isRecurring) return false;
      }
      return true;
    });
  }

  private persist(filters: TransactionFilters) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch (e) {
      console.error('Error persisting filters', e);
    }
  }

  private load(): TransactionFilters {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_FILTERS, ...parsed };
      }
    } catch (e) {
      console.error('Error loading filters', e);
    }
    return { ...DEFAULT_FILTERS };
  }
}











