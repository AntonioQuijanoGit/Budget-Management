import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TransactionsService } from '../../services/transactions.service';
import { CategoriesService } from '../../services/categories.service';
import { Transaction } from '../../core/models/finance.models';
import { CategoryChartComponent } from '../../features/dashboard/category-chart.component';
import { TrendChartComponent } from '../../features/dashboard/trend-chart.component';
import { GoalsPreviewComponent } from '../../features/dashboard/goals-preview.component';
import { UpcomingRemindersComponent } from '../../features/dashboard/upcoming-reminders.component';
import { CardComponent } from '../../components/ui/card/card.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { FabComponent } from '../../components/ui/fab/fab.component';
import { GoalsService } from '../../services/goals.service';
import { RemindersService } from '../../services/reminders.service';
import { FinancialGoal } from '../../core/models/finance.models';
import { Reminder } from '../../core/models/finance.models';
import { totalByType, balance } from '../../utils/calculations';
import { formatCurrency } from '../../utils/currency';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
  imports: [
    CommonModule,
    RouterModule,
    CategoryChartComponent,
    TrendChartComponent,
    GoalsPreviewComponent,
    UpcomingRemindersComponent,
    CardComponent,
    ButtonComponent,
    FabComponent,
    LucideAngularModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  private txSvc = inject(TransactionsService);
  private catSvc = inject(CategoriesService);
  private goalsSvc = inject(GoalsService);
  private remindersSvc = inject(RemindersService);
  private router = inject(Router);
  private palette = {
    primary: this.getVar('--color-primary', '#ffffff'),
    success: this.getVar('--color-success', '#00ff88'),
    error: this.getVar('--color-error', '#ff4444'),
  };

  transactions = signal<Transaction[]>([]);
  categories = signal([] as any);
  goals = signal<FinancialGoal[]>([]);
  reminders = signal<Reminder[]>([]);

  totalIncome = computed(() => totalByType(this.transactions(), 'income'));
  totalExpense = computed(() => totalByType(this.transactions(), 'expense'));
  totalBalance = computed(() => balance(this.transactions()));

  constructor() {
    this.txSvc.transactions$.subscribe(t => this.transactions.set(t));
    this.catSvc.categories$.subscribe(c => this.categories.set(c));
    this.goalsSvc.goalsWithProgress$.subscribe(g => this.goals.set(g));
    this.remindersSvc.reminders.subscribe(r => {
      this.reminders.set(this.remindersSvc.getUpcoming(7));
    });
  }

  summaryCards = computed(() => {
    const balance = this.totalBalance();
    const income = this.totalIncome();
    const expense = this.totalExpense();
    return [
      { label: 'Balance', value: formatCurrency(balance), accent: this.getVar('--color-text-secondary', '#a1a1aa'), icon: 'Wallet' },
      { label: 'Income', value: formatCurrency(income), accent: this.palette.success, icon: 'TrendingUp' },
      { label: 'Expenses', value: formatCurrency(expense), accent: this.palette.error, icon: 'TrendingDown' },
    ];
  });

  private getVar(name: string, fallback: string) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  formatBalance(value: number): string {
    return Math.abs(value).toFixed(2);
  }

  navigateToTransactions() {
    this.router.navigate(['/transactions']);
  }
}

