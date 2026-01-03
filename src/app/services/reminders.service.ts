import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Reminder } from '../core/models/finance.models';

const STORAGE_KEY = 'bm_reminders_v1';

@Injectable({ providedIn: 'root' })
export class RemindersService {
  private reminders$ = new BehaviorSubject<Reminder[]>(this.load());
  reminders = this.reminders$.asObservable();

  add(reminder: Reminder) {
    this.reminders$.next([...this.reminders$.value, reminder]);
    this.persist();
  }

  update(id: string, patch: Partial<Reminder>) {
    this.reminders$.next(this.reminders$.value.map(r => (r.id === id ? { ...r, ...patch } : r)));
    this.persist();
  }

  remove(id: string) {
    this.reminders$.next(this.reminders$.value.filter(r => r.id !== id));
    this.persist();
  }

  getUpcoming(days = 7): Reminder[] {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + days);
    
    return this.reminders$.value
      .filter(r => !r.isCompleted)
      .filter(r => {
        const reminderDate = new Date(r.date);
        return reminderDate >= today && reminderDate <= future;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.reminders$.value));
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











