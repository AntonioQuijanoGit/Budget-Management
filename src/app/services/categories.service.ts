import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Category } from '../core/models/finance.models';
import { AppStore } from '../core/store/app.store';
import { toObservable } from '@angular/core/rxjs-interop';

const STORAGE_KEY = 'bm_categories_v1';

const palette = {
  primary: tokenColor('--color-primary', '#6366f1'),
  error: tokenColor('--color-error', '#FF3B30'),
  success: tokenColor('--color-success', '#34C759'),
  warning: tokenColor('--color-warning', '#FF9500'),
};

const DEFAULT_CATEGORIES: Category[] = [
  // Income categories
  { id: 'salary', name: 'Salary', color: palette.success, icon: 'Wallet', type: 'income' },
  { id: 'freelance', name: 'Freelance', color: palette.success, icon: 'Briefcase', type: 'income' },
  { id: 'investment', name: 'Investment', color: palette.success, icon: 'TrendingUp', type: 'income' },
  { id: 'gift', name: 'Gift', color: palette.success, icon: 'Gift', type: 'income' },
  
  // Expense categories
  { id: 'food', name: 'Food', color: '#ef4444', icon: 'UtensilsCrossed', type: 'expense', budgetMonthly: 250 },
  { id: 'transport', name: 'Transport', color: palette.primary, icon: 'Bus', type: 'expense', budgetMonthly: 120 },
  { id: 'entertainment', name: 'Entertainment', color: palette.warning, icon: 'Film', type: 'expense', budgetMonthly: 150 },
  { id: 'shopping', name: 'Shopping', color: '#ec4899', icon: 'ShoppingBag', type: 'expense', budgetMonthly: 200 },
  { id: 'bills', name: 'Bills & Utilities', color: '#3b82f6', icon: 'Receipt', type: 'expense', budgetMonthly: 300 },
  { id: 'healthcare', name: 'Healthcare', color: '#f59e0b', icon: 'Heart', type: 'expense', budgetMonthly: 100 },
  { id: 'education', name: 'Education', color: '#8b5cf6', icon: 'GraduationCap', type: 'expense', budgetMonthly: 150 },
  { id: 'housing', name: 'Housing', color: '#06b6d4', icon: 'Home', type: 'expense', budgetMonthly: 800 },
  { id: 'travel', name: 'Travel', color: '#10b981', icon: 'Plane', type: 'expense', budgetMonthly: 200 },
  { id: 'subscriptions', name: 'Subscriptions', color: '#f97316', icon: 'CreditCard', type: 'expense', budgetMonthly: 50 },
  { id: 'clothing', name: 'Clothing', color: '#a855f7', icon: 'Shirt', type: 'expense', budgetMonthly: 100 },
  { id: 'personal-care', name: 'Personal Care', color: '#ec4899', icon: 'Sparkles', type: 'expense', budgetMonthly: 80 },
  { id: 'coffee', name: 'Coffee & Drinks', color: '#92400e', icon: 'Coffee', type: 'expense', budgetMonthly: 60 },
  { id: 'sports', name: 'Sports & Fitness', color: '#059669', icon: 'Dumbbell', type: 'expense', budgetMonthly: 75 },
  { id: 'pets', name: 'Pets', color: '#dc2626', icon: 'Heart', type: 'expense', budgetMonthly: 90 },
  { id: 'technology', name: 'Technology', color: '#1e40af', icon: 'Smartphone', type: 'expense', budgetMonthly: 120 },
];

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private store = inject(AppStore);
  private cat$ = new BehaviorSubject<Category[]>(this.store.categories());
  
  // Sync with AppStore - convert signal to observable for compatibility
  categories$ = toObservable(this.store.categories);

  constructor() {
    // Initialize from store
    const storeCats = this.store.categories();
    if (storeCats.length === 0) {
      // If store is empty, load from legacy or use defaults
      const legacy = this.load();
      if (legacy.length > 0) {
        this.store.setCategories(legacy);
        this.cat$.next(legacy);
      } else {
        this.store.setCategories(DEFAULT_CATEGORIES);
        this.cat$.next(DEFAULT_CATEGORIES);
      }
    } else {
      this.cat$.next(storeCats);
    }
    
    // Keep BehaviorSubject in sync with AppStore
    this.categories$.subscribe(cats => {
      if (JSON.stringify(cats) !== JSON.stringify(this.cat$.value)) {
        this.cat$.next(cats);
      }
    });
  }

  add(cat: Category) {
    this.store.addCategory(cat);
    // BehaviorSubject will update via subscription
  }

  update(id: string, patch: Partial<Category>) {
    this.store.updateCategory(id, patch);
    // BehaviorSubject will update via subscription
  }

  remove(id: string) {
    this.store.removeCategory(id);
    // BehaviorSubject will update via subscription
  }

  resetDefaults() {
    this.store.setCategories(DEFAULT_CATEGORIES);
    // BehaviorSubject will update via subscription
  }

  private persist() {
    this.persistData(this.cat$.value);
  }

  private load(): Category[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_CATEGORIES;
      const parsed = JSON.parse(raw) as Category[];
      if (!parsed.length) return DEFAULT_CATEGORIES;
      
      // Migrar iconos antiguos a nuevos
      const migrated = this.migrateIcons(parsed);
      if (migrated !== parsed) {
        // Si hubo cambios, guardar las categorías migradas
        this.persistData(migrated);
      }
      
      return migrated;
    } catch (e) {
      console.error('Error loading categories', e);
      return DEFAULT_CATEGORIES;
    }
  }

  private migrateIcons(categories: Category[]): Category[] {
    const iconMigrations: Record<string, string> = {
      'Utensils': 'UtensilsCrossed',
      'Clapperboard': 'Film',
    };
    
    let hasChanges = false;
    const migrated = categories.map(cat => {
      if (cat.icon && iconMigrations[cat.icon]) {
        hasChanges = true;
        return { ...cat, icon: iconMigrations[cat.icon] };
      }
      return cat;
    });
    
    return hasChanges ? migrated : categories;
  }

  private persistData(categories: Category[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } catch (e: any) {
      console.error('Error saving categories', e);
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        console.warn('localStorage quota exceeded for categories');
        throw new Error('Storage quota exceeded. Please clear some old data.');
      }
      throw e;
    }
  }
}

function tokenColor(name: string, fallback: string) {
  if (typeof document !== 'undefined') {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (value) return value;
  }
  return fallback;
}

function blendColors(a: string, b: string, amount: number) {
  const [ra, ga, ba] = toRgb(a);
  const [rb, gb, bb] = toRgb(b);
  const r = Math.round(ra + (rb - ra) * amount);
  const g = Math.round(ga + (gb - ga) * amount);
  const bch = Math.round(ba + (bb - ba) * amount);
  return `rgb(${r}, ${g}, ${bch})`;
}

function toRgb(color: string): [number, number, number] {
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return [r, g, b];
  }
  const match = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
  if (match) return [Number(match[1]), Number(match[2]), Number(match[3])];
  return [0, 0, 0];
}

