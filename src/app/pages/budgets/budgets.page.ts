import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetsService } from '../../services/budgets.service';
import { CategoriesService } from '../../services/categories.service';
import { TransactionsService } from '../../services/transactions.service';
import { BudgetCardComponent } from '../../features/budgets/budget-card.component';
import { Category, BudgetAlert, Transaction } from '../../core/models/finance.models';

@Component({
  standalone: true,
  selector: 'app-budgets-page',
  templateUrl: './budgets.page.html',
  styleUrl: './budgets.page.css',
  imports: [CommonModule, BudgetCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetsPage {
  private budgetsSvc = inject(BudgetsService);
  private catSvc = inject(CategoriesService);
  private txSvc = inject(TransactionsService);

  categories = signal<Category[]>([]);
  transactions = signal<Transaction[]>([]);
  alerts = computed<BudgetAlert[]>(() =>
    this.budgetsSvc.computeAlerts(this.categories(), this.transactions())
  );

  constructor() {
    this.catSvc.categories$.subscribe(c => this.categories.set(c));
    this.txSvc.transactions$.subscribe(t => this.transactions.set(t));
  }

  categoryFor(id: string) {
    return this.categories().find(c => c.id === id);
  }
}









