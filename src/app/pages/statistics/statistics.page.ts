import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TransactionsService } from '../../services/transactions.service';
import { CategoriesService } from '../../services/categories.service';
import { TransactionFiltersService } from '../../services/transaction-filters.service';
import { Transaction } from '../../core/models/finance.models';
import { groupExpensesByCategory, totalByType } from '../../utils/calculations';
import { formatCurrency } from '../../utils/currency';
import { LucideAngularModule } from 'lucide-angular';
import { EmptyStateComponent } from '../../components/ui/empty-state/empty-state.component';
import { ButtonComponent } from '../../components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-statistics-page',
  templateUrl: './statistics.page.html',
  styleUrl: './statistics.page.css',
  imports: [
    CommonModule, 
    RouterModule,
    LucideAngularModule,
    EmptyStateComponent,
    ButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsPage {
  private txSvc = inject(TransactionsService);
  private catSvc = inject(CategoriesService);
  private filtersSvc = inject(TransactionFiltersService);
  transactions = signal<Transaction[]>([]);
  categories = signal([] as any);

  constructor() {
    this.txSvc.transactions$.subscribe(t => this.transactions.set(t));
    this.catSvc.categories$.subscribe(c => this.categories.set(c));
  }

  // Apply filters to transactions
  filteredTransactions = computed(() => 
    this.filtersSvc.apply(this.transactions())
  );

  topCategories = computed(() =>
    groupExpensesByCategory(this.filteredTransactions(), this.categories()).sort((a, b) => b.value - a.value).slice(0, 5)
  );

  dailyAvg = computed(() => {
    const expense = totalByType(this.filteredTransactions(), 'expense');
    const transactions = this.filteredTransactions();
    
    if (transactions.length === 0) return 0;
    
    // Calculate date range from transactions
    const dates = transactions
      .filter(t => t.type === 'expense')
      .map(t => new Date(t.date))
      .sort((a, b) => a.getTime() - b.getTime());
    
    if (dates.length === 0) return 0;
    
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    const diffTime = Math.abs(lastDate.getTime() - firstDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both days
    
    // Use at least 1 day to avoid division by zero, or use 30 as fallback if range is too small
    const days = diffDays >= 1 ? diffDays : 30;
    return expense / days;
  });

  summary = computed(() => [
    { label: 'Daily average expense', value: formatCurrency(this.dailyAvg()) },
    { label: 'Total income', value: formatCurrency(totalByType(this.filteredTransactions(), 'income')) },
    { label: 'Total expenses', value: formatCurrency(totalByType(this.filteredTransactions(), 'expense')) },
  ]);
}

