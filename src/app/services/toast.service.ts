import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastType } from '../components/ui/toast/toast.component';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);
  toasts = this.toasts$.asObservable();

  show(type: ToastType, message: string, title?: string, duration = 5000) {
    const toast: Toast = {
      id: crypto.randomUUID(),
      type,
      message,
      title,
      duration,
    };
    this.toasts$.next([...this.toasts$.value, toast]);
    return toast.id;
  }

  success(message: string, title?: string) {
    return this.show('success', message, title);
  }

  error(message: string, title?: string) {
    return this.show('error', message, title, 7000);
  }

  warning(message: string, title?: string) {
    return this.show('warning', message, title);
  }

  info(message: string, title?: string) {
    return this.show('info', message, title);
  }

  remove(id: string) {
    this.toasts$.next(this.toasts$.value.filter((t) => t.id !== id));
  }

  clear() {
    this.toasts$.next([]);
  }
}


