import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Transaction } from '../../core/models/finance.models';
import { CardComponent } from '../../components/ui/card/card.component';
import { EmptyStateComponent } from '../../components/ui/empty-state/empty-state.component';
import { LucideAngularModule } from 'lucide-angular';
import { balance, totalByType } from '../../utils/calculations';
import { formatCurrency } from '../../utils/currency';

@Component({
  selector: 'app-quick-stats',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, EmptyStateComponent, LucideAngularModule],
  templateUrl: './quick-stats.component.html',
  styleUrl: './quick-stats.component.css',
})
export class QuickStatsComponent {
  @Input() transactions: Transaction[] = [];
  private palette = {
    success: this.getVar('--color-success', '#00ff88'),
    error: this.getVar('--color-error', '#ff4444'),
    primary: this.getVar('--color-primary', '#ffffff'),
  };

  get totalIncome() {
    return totalByType(this.transactions, 'income');
  }
  get totalExpense() {
    return totalByType(this.transactions, 'expense');
  }
  get currentBalance() {
    return balance(this.transactions);
  }

  get items() {
    // Removed Balance from here since it's already in summaryCards above
    return [
      { label: 'Income', value: formatCurrency(this.totalIncome), accent: this.palette.success },
      { label: 'Expenses', value: formatCurrency(this.totalExpense), accent: this.palette.error },
    ];
  }

  private getVar(name: string, fallback: string) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }
}

