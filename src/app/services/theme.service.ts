import { Injectable, signal, computed } from '@angular/core';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'bm_theme_v1';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSignal = signal<Theme>(this.loadTheme());
  
  // Public readonly signal
  theme = computed(() => this.themeSignal());

  constructor() {
    // Apply theme on initialization
    const initialTheme = this.themeSignal();
    this.applyTheme(initialTheme);
  }

  setTheme(theme: Theme) {
    this.themeSignal.set(theme);
    this.applyTheme(theme);
    this.persist(theme);
  }

  toggle() {
    const newTheme = this.themeSignal() === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  private applyTheme(theme: Theme) {
    const html = document.documentElement;
    html.classList.remove('dark', 'light');
    html.classList.add(theme);
  }

  private persist(theme: Theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.error('Error persisting theme', e);
    }
  }

  private loadTheme(): Theme {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
    } catch (e) {
      console.error('Error loading theme', e);
    }
    // Default to light theme
    return 'light';
  }
}

