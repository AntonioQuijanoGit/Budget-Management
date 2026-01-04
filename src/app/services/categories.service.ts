import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Category } from '../core/models/finance.models';

const STORAGE_KEY = 'bm_categories_v1';

const palette = {
  primary: tokenColor('--color-primary', '#6366f1'),
  error: tokenColor('--color-error', '#FF3B30'),
  success: tokenColor('--color-success', '#34C759'),
  warning: tokenColor('--color-warning', '#FF9500'),
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food', name: 'Food', color: palette.error, icon: 'UtensilsCrossed', type: 'expense', budgetMonthly: 250 },
  { id: 'transport', name: 'Transport', color: palette.primary, icon: 'Bus', type: 'expense', budgetMonthly: 120 },
  { id: 'salary', name: 'Salary', color: palette.success, icon: 'Wallet', type: 'income' },
  {
    id: 'entertainment',
    name: 'Entertainment',
    color: palette.warning,
    icon: 'Film',
    type: 'expense',
    budgetMonthly: 150,
  },
];

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private cat$ = new BehaviorSubject<Category[]>(this.load());
  categories$ = this.cat$.asObservable();

  add(cat: Category) {
    this.cat$.next([...this.cat$.value, cat]);
    this.persist();
  }

  update(id: string, patch: Partial<Category>) {
    this.cat$.next(this.cat$.value.map(c => (c.id === id ? { ...c, ...patch } : c)));
    this.persist();
  }

  remove(id: string) {
    this.cat$.next(this.cat$.value.filter(c => c.id !== id));
    this.persist();
  }

  resetDefaults() {
    this.cat$.next(DEFAULT_CATEGORIES);
    this.persist();
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

