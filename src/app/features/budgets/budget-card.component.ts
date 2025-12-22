import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetAlert, Category } from '../../core/models/finance.models';
import { formatCurrency } from '../../utils/currency';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-budget-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './budget-card.component.html',
  styleUrl: './budget-card.component.css',
})
export class BudgetCardComponent {
  @Input() alert!: BudgetAlert;
  @Input() category?: Category;

  get ratioPct() {
    return Math.min(this.alert?.ratio * 100 || 0, 120);
  }

  get status() {
    if (!this.alert) return 'neutral';
    if (this.alert.ratio >= 1) return 'danger';
    if (this.alert.ratio >= 0.8) return 'warning';
    return 'ok';
  }

  format(val: number) {
    return formatCurrency(val);
  }
}

