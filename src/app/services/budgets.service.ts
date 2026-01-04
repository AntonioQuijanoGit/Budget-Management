import { Injectable, inject } from '@angular/core';
import { BudgetAlert, Category, Transaction } from '../core/models/finance.models';
import { NotificationsService } from './notifications.service';

@Injectable({ providedIn: 'root' })
export class BudgetsService {
  private notificationsService = inject(NotificationsService);
  private lastAlertedCategories = new Set<string>();

  computeAlerts(categories: Category[], tx: Transaction[]): BudgetAlert[] {
    const spentByCat = new Map<string, number>();
    tx.filter(t => t.type === 'expense').forEach(t => {
      spentByCat.set(t.categoryId, (spentByCat.get(t.categoryId) || 0) + t.amount);
    });

    return categories
      .filter(c => c.budgetMonthly)
      .map(c => {
        const spent = spentByCat.get(c.id) || 0;
        const limit = c.budgetMonthly ?? 0;
        return {
          categoryId: c.id,
          spent,
          limit,
          ratio: limit > 0 ? spent / limit : 0,
        };
      });
  }

  /**
   * Check if adding a transaction would exceed budget and return warning
   */
  checkBudgetBeforeAdd(
    transaction: Transaction,
    categories: Category[],
    existingTransactions: Transaction[]
  ): { 
    wouldExceed: boolean; 
    warning?: string; 
    category?: Category;
    currentSpent?: number;
    limit?: number;
    newRatio?: number;
  } {
    if (transaction.type !== 'expense') {
      return { wouldExceed: false };
    }

    const category = categories.find(c => c.id === transaction.categoryId);
    if (!category || !category.budgetMonthly) {
      return { wouldExceed: false };
    }

    // Calculate current spent
    const currentSpent = existingTransactions
      .filter(t => t.type === 'expense' && t.categoryId === transaction.categoryId)
      .reduce((sum, t) => sum + t.amount, 0);

    const newSpent = currentSpent + transaction.amount;
    const limit = category.budgetMonthly;
    const newRatio = newSpent / limit;

    if (newRatio >= 1) {
      return {
        wouldExceed: true,
        warning: `This expense would exceed your budget for ${category.name} by ${formatCurrency(newSpent - limit)}`,
        category,
        currentSpent,
        limit,
        newRatio,
      };
    }

    if (newRatio >= 0.9) {
      return {
        wouldExceed: false,
        warning: `This expense would use ${(newRatio * 100).toFixed(0)}% of your budget for ${category.name}`,
        category,
        currentSpent,
        limit,
        newRatio,
      };
    }

    return { wouldExceed: false };
  }

  /**
   * Check budgets after transaction is added and show notifications
   */
  async checkAndNotifyBudgetAlerts(
    categories: Category[],
    transactions: Transaction[]
  ): Promise<void> {
    const alerts = this.computeAlerts(categories, transactions);
    
    for (const alert of alerts) {
      const category = categories.find(c => c.id === alert.categoryId);
      if (!category) continue;

      // Only alert if ratio >= 0.8 (80%) and we haven't alerted recently
      if (alert.ratio >= 0.8 && !this.lastAlertedCategories.has(alert.categoryId)) {
        const percentage = alert.ratio * 100;
        
        if (alert.ratio >= 1) {
          // Exceeded
          await this.notificationsService.showBudgetAlert(
            category.name,
            percentage
          );
          this.lastAlertedCategories.add(alert.categoryId);
        } else if (alert.ratio >= 0.9) {
          // Warning (90%+)
          await this.notificationsService.showBudgetAlert(
            category.name,
            percentage
          );
          this.lastAlertedCategories.add(alert.categoryId);
        }
      }

      // Reset alert flag if ratio drops below 80%
      if (alert.ratio < 0.8) {
        this.lastAlertedCategories.delete(alert.categoryId);
      }
    }
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}











