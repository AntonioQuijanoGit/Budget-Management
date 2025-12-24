import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { RecurringTransactionsService } from './recurring-transactions.service';
import { TransactionsService } from './transactions.service';
import { NotificationsService } from './notifications.service';
import { RecurringTransaction, Transaction, TransactionType } from '../core/models/finance.models';

/**
 * Auto Recurring Service
 * Automatically generates transactions from recurring transactions
 */
@Injectable({ providedIn: 'root' })
export class AutoRecurringService {
  private recurringService = inject(RecurringTransactionsService);
  private transactionsService = inject(TransactionsService);
  private notificationsService = inject(NotificationsService);

  /**
   * Check and generate due recurring transactions
   */
  async checkAndGenerateDue(): Promise<Transaction[]> {
    const generated: Transaction[] = [];
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const recurringList = await firstValueFrom(this.recurringService.recurring);
    if (!recurringList) return generated;

    for (const recurring of recurringList) {
      if (!recurring.isActive) continue;

      const nextDue = new Date(recurring.nextDueDate).toISOString().split('T')[0];
      
      // Check if due today or overdue
      if (nextDue <= today) {
        const transaction = this.createTransactionFromRecurring(recurring);
        
        // Check if already generated (prevent duplicates)
        const existing = await firstValueFrom(this.transactionsService.transactions$);
        if (!existing?.some(t => 
          t.isRecurring && 
          t.date === transaction.date &&
          t.amount === transaction.amount &&
          t.description === transaction.description
        )) {
          this.transactionsService.add(transaction);
          generated.push(transaction);

          // Update next due date
          const updatedNextDue = this.calculateNextDueDate(recurring);
          this.recurringService.update(recurring.id, {
            nextDueDate: updatedNextDue,
          });

          // Show notification
          await this.notificationsService.showRecurringTransaction(
            recurring.name,
            recurring.amount
          );
        }
      }
    }

    return generated;
  }

  /**
   * Create a transaction from a recurring transaction
   */
  private createTransactionFromRecurring(recurring: RecurringTransaction): Transaction {
    const today = new Date().toISOString().split('T')[0];

    return {
      id: crypto.randomUUID(),
      type: recurring.type as TransactionType,
      categoryId: recurring.categoryId,
      amount: recurring.amount,
      date: today,
      description: recurring.name,
      notes: recurring.description || `Auto-generated from recurring: ${recurring.name}`,
      tags: recurring.tags || [],
      isRecurring: true,
    };
  }

  /**
   * Calculate next due date based on frequency
   */
  private calculateNextDueDate(recurring: RecurringTransaction): string {
    const currentDate = new Date(recurring.nextDueDate);
    let nextDate = new Date(currentDate);

    switch (recurring.frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    // Check if end date exists and has passed
    if (recurring.endDate && new Date(recurring.endDate) < nextDate) {
      // Deactivate if past end date
      this.recurringService.update(recurring.id, { isActive: false });
      return recurring.endDate;
    }

    return nextDate.toISOString().split('T')[0];
  }

  /**
   * Initialize auto-check (call this on app start)
   */
  initialize(): void {
    // Check on app load
    this.checkAndGenerateDue();

    // Check daily (at midnight)
    this.scheduleDailyCheck();
  }

  /**
   * Schedule daily check for due recurring transactions
   */
  private scheduleDailyCheck(): void {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    setTimeout(() => {
      this.checkAndGenerateDue();
      // Schedule next day
      setInterval(() => {
        this.checkAndGenerateDue();
      }, 24 * 60 * 60 * 1000); // Every 24 hours
    }, msUntilMidnight);
  }
}

