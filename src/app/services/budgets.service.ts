import { Injectable } from '@angular/core';
import { BudgetAlert, Category, Transaction } from '../core/models/finance.models';

@Injectable({ providedIn: 'root' })
export class BudgetsService {
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
}







