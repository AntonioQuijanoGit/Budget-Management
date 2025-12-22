import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reminder } from '../../core/models/finance.models';
import { CardComponent } from '../../components/ui/card/card.component';
import { BadgeComponent } from '../../components/ui/badge/badge.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-upcoming-reminders',
  standalone: true,
  imports: [CommonModule, CardComponent, BadgeComponent, LucideAngularModule],
  template: `
    <ui-card title="Upcoming Reminders" padding="md" *ngIf="reminders.length > 0; else empty">
      <div class="reminders-list">
        <div *ngFor="let reminder of reminders" class="reminder-item">
          <div class="reminder-icon" [class]="'priority-' + reminder.priority">
            <lucide-icon [name]="getIcon(reminder.type)" [size]="16"></lucide-icon>
          </div>
          <div class="reminder-content">
            <p class="reminder-title">{{ reminder.title }}</p>
            <p class="reminder-date">{{ formatDate(reminder.date) }}</p>
          </div>
          <ui-badge [variant]="getPriorityVariant(reminder.priority)" size="sm">
            {{ reminder.priority }}
          </ui-badge>
        </div>
      </div>
    </ui-card>

    <ng-template #empty>
      <ui-card title="Upcoming Reminders" padding="md">
        <p class="empty-text">No upcoming reminders.</p>
      </ui-card>
    </ng-template>
  `,
  styleUrl: './upcoming-reminders.component.css',
})
export class UpcomingRemindersComponent {
  @Input() reminders: Reminder[] = [];

  getIcon(type: string): string {
    const map: Record<string, string> = {
      transaction: 'DollarSign',
      bill: 'FileText',
      goal: 'Target',
      budget: 'Wallet',
    };
    return map[type] || 'Bell';
  }

  getPriorityVariant(priority: string): 'primary' | 'success' | 'warning' | 'danger' {
    const map: Record<string, 'primary' | 'success' | 'warning' | 'danger'> = {
      low: 'success',
      medium: 'warning',
      high: 'danger',
    };
    return map[priority] || 'primary';
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

