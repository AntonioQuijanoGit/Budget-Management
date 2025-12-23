import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecurringTransaction } from '../../core/models/finance.models';
import { CardComponent } from '../../components/ui/card/card.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { BadgeComponent } from '../../components/ui/badge/badge.component';
import { EmptyStateComponent } from '../../components/ui/empty-state/empty-state.component';
import { LucideAngularModule } from 'lucide-angular';
import { formatCurrency } from '../../utils/currency';

@Component({
  selector: 'app-recurring-list',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, BadgeComponent, EmptyStateComponent, LucideAngularModule],
  template: `
    <ui-card eyebrow="Existing" title="Your Recurring Transactions" [hoverable]="false" padding="md">
      <p class="card-description">Manage your existing recurring transactions. Edit, pause, or delete them as needed.</p>
      
      <div class="recurring-grid" *ngIf="recurring.length > 0; else empty">
        <ui-card *ngFor="let item of recurring" [hoverable]="true" padding="md" class="recurring-card">
        <div class="recurring-header">
          <div class="recurring-icon" [class]="'type-' + item.type">
            <lucide-icon [name]="item.type === 'income' ? 'TrendingUp' : 'TrendingDown'" [size]="18"></lucide-icon>
          </div>
          <div class="recurring-info">
            <h3 class="recurring-name">{{ item.name }}</h3>
            <p class="recurring-amount" [class]="'type-' + item.type">
              {{ item.type === 'income' ? '+' : '-' }}{{ formatCurrency(item.amount) }}
            </p>
          </div>
          <ui-badge [variant]="item.isActive ? 'success' : 'neutral'" size="sm">
            {{ item.isActive ? 'Activa' : 'Inactiva' }}
          </ui-badge>
        </div>

        <div class="recurring-details">
          <div class="detail-item">
            <lucide-icon name="Repeat" [size]="14"></lucide-icon>
            <span>{{ getFrequencyLabel(item.frequency) }}</span>
          </div>
          <div class="detail-item">
            <lucide-icon name="Calendar" [size]="14"></lucide-icon>
            <span>Next: {{ formatDate(item.nextDueDate) }}</span>
          </div>
        </div>

        <div class="recurring-actions">
          <ui-button variant="ghost" size="sm" (buttonClick)="edit.emit(item)" iconLeft="Pencil">
            Edit
          </ui-button>
          <ui-button variant="ghost" size="sm" (buttonClick)="toggle.emit(item.id)" [iconLeft]="item.isActive ? 'Pause' : 'Play'">
            {{ item.isActive ? 'Pause' : 'Activate' }}
          </ui-button>
          <ui-button variant="ghost" size="sm" (buttonClick)="remove.emit(item.id)" iconLeft="Trash2">
            Delete
          </ui-button>
        </div>
      </ui-card>
      </div>

      <ng-template #empty>
        <ui-empty-state
          icon="Repeat"
          title="No Recurring Transactions"
          description="Create your first recurring transaction above to get started. Recurring transactions will automatically generate transactions based on your schedule."
        ></ui-empty-state>
      </ng-template>
    </ui-card>
  `,
  styleUrl: './recurring-list.component.css',
})
export class RecurringListComponent {
  @Input() recurring: RecurringTransaction[] = [];
  @Output() edit = new EventEmitter<RecurringTransaction>();
  @Output() toggle = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  formatCurrency = formatCurrency;

  getFrequencyLabel(freq: string): string {
    const map: Record<string, string> = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      yearly: 'Yearly',
    };
    return map[freq] || freq;
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  }
}

