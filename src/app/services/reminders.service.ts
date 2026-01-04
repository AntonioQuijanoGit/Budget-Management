import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Reminder } from '../core/models/finance.models';
import { AppStore } from '../core/store/app.store';
import { toObservable } from '@angular/core/rxjs-interop';

const STORAGE_KEY = 'bm_reminders_v1';

@Injectable({ providedIn: 'root' })
export class RemindersService {
  private store = inject(AppStore);
  private reminders$ = new BehaviorSubject<Reminder[]>(this.store.reminders());
  
  // Sync with AppStore
  reminders = toObservable(this.store.reminders);

  constructor() {
    // Initialize from store
    const storeReminders = this.store.reminders();
    if (storeReminders.length === 0) {
      const legacy = this.load();
      if (legacy.length > 0) {
        this.store.setReminders(legacy);
        this.reminders$.next(legacy);
      }
    } else {
      this.reminders$.next(storeReminders);
    }
    
    // Keep BehaviorSubject in sync with AppStore
    this.reminders.subscribe(reminders => {
      if (JSON.stringify(reminders) !== JSON.stringify(this.reminders$.value)) {
        this.reminders$.next(reminders);
      }
    });
  }

  add(reminder: Reminder) {
    this.store.addReminder(reminder);
    // BehaviorSubject will update via subscription
  }

  update(id: string, patch: Partial<Reminder>) {
    this.store.updateReminder(id, patch);
    // BehaviorSubject will update via subscription
  }

  remove(id: string) {
    this.store.removeReminder(id);
    // BehaviorSubject will update via subscription
  }

  getUpcoming(days = 7): Reminder[] {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + days);
    
    return this.store.reminders()
      .filter(r => !r.isCompleted)
      .filter(r => {
        const reminderDate = new Date(r.date);
        return reminderDate >= today && reminderDate <= future;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  private load(): Reminder[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}











