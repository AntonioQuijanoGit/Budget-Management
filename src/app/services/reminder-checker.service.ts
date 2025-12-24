import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { RemindersService } from './reminders.service';
import { NotificationsService } from './notifications.service';
import { Reminder } from '../core/models/finance.models';

/**
 * Reminder Checker Service
 * Checks for due reminders and shows notifications
 */
@Injectable({ providedIn: 'root' })
export class ReminderCheckerService {
  private remindersService = inject(RemindersService);
  private notificationsService = inject(NotificationsService);
  private checkInterval?: number;

  /**
   * Initialize reminder checking
   */
  initialize(): void {
    // Check on app load
    this.checkDueReminders();

    // Check every minute for reminders
    this.checkInterval = window.setInterval(() => {
      this.checkDueReminders();
    }, 60 * 1000); // Every minute
  }

  /**
   * Check for due reminders and show notifications
   */
  private async checkDueReminders(): Promise<void> {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const now = today.getHours() * 60 + today.getMinutes(); // Minutes since midnight

    const reminders = await firstValueFrom(this.remindersService.reminders);
    
    for (const reminder of reminders) {
      if (reminder.isCompleted) continue;

      const reminderDate = new Date(reminder.date).toISOString().split('T')[0];
      const reminderTime = reminder.time 
        ? reminder.time.split(':').map(Number)
        : null;
      
      // Check if reminder is due today
      if (reminderDate === todayStr) {
        // If has time, check if time has passed
        if (reminderTime) {
          const reminderMinutes = reminderTime[0] * 60 + reminderTime[1];
          // Show notification if time has passed (within last 5 minutes to avoid spam)
          if (now >= reminderMinutes && now - reminderMinutes <= 5) {
            await this.notificationsService.showReminder(
              reminder.title,
              reminder.description,
              new Date(reminder.date + 'T' + reminder.time)
            );
            
            // Mark as completed after showing notification (optional)
            // this.remindersService.update(reminder.id, { isCompleted: true });
          }
        } else {
          // No time specified, show notification at start of day (00:00)
          if (now === 0 || (now > 0 && now <= 5)) {
            await this.notificationsService.showReminder(
              reminder.title,
              reminder.description,
              new Date(reminder.date)
            );
          }
        }
      }

      // Check for reminders due in next hour (pre-warning)
      if (reminderDate === todayStr && reminderTime) {
        const reminderMinutes = reminderTime[0] * 60 + reminderTime[1];
        const oneHourBefore = reminderMinutes - 60;
        
        // Show pre-warning if reminder is in next hour
        if (now >= oneHourBefore && now < reminderMinutes) {
          // Only show once per reminder (could be enhanced with tracking)
          await this.notificationsService.show(
            `⏰ Reminder soon: ${reminder.title}`,
            {
              body: `Coming up in less than an hour`,
              icon: '/favicon.ico',
              tag: `reminder-pre-${reminder.id}`,
            }
          );
        }
      }
    }
  }

  /**
   * Cleanup on destroy
   */
  destroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}

