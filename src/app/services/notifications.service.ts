import { Injectable } from '@angular/core';

/**
 * Notifications Service - Browser Notifications API
 * Handles browser notifications for reminders, alerts, etc.
 */
@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private permission: NotificationPermission = 'default';

  constructor() {
    this.checkPermission();
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (this.permission === 'granted') {
      return 'granted';
    }

    if (this.permission === 'default') {
      this.permission = await Notification.requestPermission();
    }

    return this.permission;
  }

  /**
   * Check current permission status
   */
  checkPermission(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied';
    }
    this.permission = Notification.permission;
    return this.permission;
  }

  /**
   * Check if notifications are supported and allowed
   */
  isSupported(): boolean {
    return 'Notification' in window;
  }

  /**
   * Check if permission is granted
   */
  isGranted(): boolean {
    return this.checkPermission() === 'granted';
  }

  /**
   * Show a notification
   */
  async show(
    title: string,
    options?: NotificationOptions
  ): Promise<Notification | null> {
    if (!this.isSupported()) {
      console.warn('Notifications not supported');
      return null;
    }

    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    const defaultOptions: NotificationOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'budget-management',
      requireInteraction: false,
      ...options,
    };

    try {
      const notification = new Notification(title, defaultOptions);
      
      // Auto-close after 5 seconds if not requireInteraction
      if (!defaultOptions.requireInteraction) {
        setTimeout(() => notification.close(), 5000);
      }

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }

  /**
   * Show reminder notification
   */
  async showReminder(title: string, body?: string, date?: Date): Promise<Notification | null> {
    return this.show('🔔 Reminder: ' + title, {
      body: body || `Scheduled for ${date?.toLocaleString() || 'now'}`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'reminder',
      requireInteraction: false,
    });
  }

  /**
   * Show budget alert notification
   */
  async showBudgetAlert(category: string, percentage: number): Promise<Notification | null> {
    const emoji = percentage >= 100 ? '⚠️' : percentage >= 90 ? '🔔' : '💰';
    return this.show(`${emoji} Budget Alert: ${category}`, {
      body: `You've used ${percentage.toFixed(0)}% of your budget for ${category}`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'budget-alert',
      requireInteraction: false,
    });
  }

  /**
   * Show recurring transaction notification
   */
  async showRecurringTransaction(name: string, amount: number): Promise<Notification | null> {
    return this.show('🔄 Recurring Transaction Due', {
      body: `${name} - ${amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'recurring',
      requireInteraction: true, // Require interaction for important transactions
    });
  }

  /**
   * Close all notifications with a specific tag
   */
  closeAll(tag?: string): void {
    // Note: There's no direct API to close notifications, but they auto-close
    // This is a placeholder for future implementation if needed
  }
}






