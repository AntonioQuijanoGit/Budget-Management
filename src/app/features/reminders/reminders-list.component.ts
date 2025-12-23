import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reminder } from '../../core/models/finance.models';
import { CardComponent } from '../../components/ui/card/card.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { BadgeComponent } from '../../components/ui/badge/badge.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-reminders-list',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, BadgeComponent, LucideAngularModule],
  template: `
    <div class="reminders-grid" *ngIf="reminders.length > 0; else empty">
      <ui-card *ngFor="let reminder of reminders" [hoverable]="true" padding="md" class="reminder-card" [class.completed]="reminder.isCompleted">
        <div class="reminder-header">
          <div class="reminder-icon" [class]="'priority-' + reminder.priority">
            <lucide-icon [name]="getIcon(reminder.type)" [size]="18"></lucide-icon>
          </div>
          <div class="reminder-info">
            <h3 class="reminder-title">{{ reminder.title }}</h3>
            <p class="reminder-description" *ngIf="reminder.description">{{ reminder.description }}</p>
          </div>
          <div class="reminder-badges">
            <ui-badge [variant]="getPriorityVariant(reminder.priority)" size="sm">
              {{ reminder.priority }}
            </ui-badge>
            <ui-badge variant="success" size="sm" *ngIf="reminder.isCompleted">
              Completed
            </ui-badge>
          </div>
        </div>

        <div class="reminder-details">
          <div class="detail-item">
            <lucide-icon name="Calendar" [size]="14"></lucide-icon>
            <span>{{ formatDate(reminder.date) }}</span>
            <span *ngIf="reminder.time"> at {{ reminder.time }}</span>
          </div>
          <div class="detail-item" *ngIf="reminder.type">
            <lucide-icon name="Tag" [size]="14"></lucide-icon>
            <span>{{ getTypeLabel(reminder.type) }}</span>
          </div>
        </div>

        <div class="reminder-actions">
          <ui-button 
            variant="ghost" 
            size="sm" 
            (buttonClick)="toggle.emit(reminder.id)"
            [iconLeft]="reminder.isCompleted ? 'RotateCcw' : 'Check'"
          >
            {{ reminder.isCompleted ? 'Reopen' : 'Complete' }}
          </ui-button>
          <ui-button variant="ghost" size="sm" (buttonClick)="edit.emit(reminder)" iconLeft="Pencil">
            Edit
          </ui-button>
          <ui-button variant="ghost" size="sm" (buttonClick)="remove.emit(reminder.id)" iconLeft="Trash2">
            Delete
          </ui-button>
        </div>
      </ui-card>
    </div>

    <ng-template #empty>
      <ui-card padding="lg" class="empty-state">
        <div class="empty-content">
          <lucide-icon name="Bell" [size]="48" class="empty-icon"></lucide-icon>
          <h3>No Reminders</h3>
          <p>Create reminders so you don't forget payments, goals, or important events.</p>
        </div>
      </ui-card>
    </ng-template>
  `,
  styleUrl: './reminders-list.component.css',
})
export class RemindersListComponent {
  @Input() reminders: Reminder[] = [];
  @Output() edit = new EventEmitter<Reminder>();
  @Output() toggle = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  getIcon(type: string): string {
    const map: Record<string, string> = {
      transaction: 'DollarSign',
      bill: 'FileText',
      goal: 'Target',
      budget: 'Wallet',
    };
    return map[type] || 'Bell';
  }

  getTypeLabel(type: string): string {
    const map: Record<string, string> = {
      transaction: 'Transaction',
      bill: 'Bill',
      goal: 'Goal',
      budget: 'Budget',
    };
    return map[type] || type;
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
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}

