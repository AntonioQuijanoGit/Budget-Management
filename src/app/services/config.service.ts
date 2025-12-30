import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'bm_config_v1';

export interface AppConfig {
  currency: string;
  locale: string;
}

const DEFAULT_CONFIG: AppConfig = {
  currency: 'EUR',
  locale: 'es-ES',
};

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config$ = new BehaviorSubject<AppConfig>(this.load());
  config = this.config$.asObservable();

  get currency(): string {
    return this.config$.value.currency;
  }

  set currency(value: string) {
    this.updateConfig({ currency: value });
  }

  get locale(): string {
    return this.config$.value.locale;
  }

  set locale(value: string) {
    this.updateConfig({ locale: value });
  }

  updateConfig(partial: Partial<AppConfig>) {
    const current = this.config$.value;
    const updated = { ...current, ...partial };
    this.config$.next(updated);
    this.save(updated);
  }

  private save(config: AppConfig) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Error saving config', e);
    }
  }

  private load(): AppConfig {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_CONFIG;
    } catch (e) {
      console.error('Error loading config', e);
      return DEFAULT_CONFIG;
    }
  }
}







