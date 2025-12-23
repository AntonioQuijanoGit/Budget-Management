import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialGoal } from '../../core/models/finance.models';
import { GoalsService } from '../../services/goals.service';
import { CardComponent } from '../../components/ui/card/card.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { BadgeComponent } from '../../components/ui/badge/badge.component';
import { LucideAngularModule } from 'lucide-angular';
import { formatCurrency } from '../../utils/currency';

@Component({
  selector: 'app-goals-list',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, BadgeComponent, LucideAngularModule],
  template: `
    <div class="goals-grid" *ngIf="goals.length > 0; else empty">
      <ui-card *ngFor="let goal of goals" [hoverable]="true" padding="md" class="goal-card">
        <div class="goal-header">
          <div class="goal-icon" [style.background]="goal.color + '15'" [style.color]="goal.color">
            <lucide-icon [name]="goal.icon || 'Target'" [size]="18"></lucide-icon>
          </div>
          <div class="goal-info">
            <h3 class="goal-title">{{ goal.title }}</h3>
            <p class="goal-description" *ngIf="goal.description">{{ goal.description }}</p>
          </div>
          <ui-badge [variant]="getTypeVariant(goal.type)" size="sm">{{ goal.type }}</ui-badge>
        </div>
        
        <div class="goal-progress">
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="getProgress(goal)"></div>
          </div>
          <div class="progress-text">
            <span class="current">{{ formatCurrency(goal.currentAmount) }}</span>
            <span class="target">of {{ formatCurrency(goal.targetAmount) }}</span>
          </div>
        </div>

        <div class="goal-actions">
          <ui-button variant="ghost" size="sm" (buttonClick)="edit.emit(goal)" iconLeft="Pencil">
            Edit
          </ui-button>
          <ui-button variant="ghost" size="sm" (buttonClick)="remove.emit(goal.id)" iconLeft="Trash2">
            Delete
          </ui-button>
        </div>
      </ui-card>
    </div>

    <ng-template #empty>
      <ui-card padding="lg" class="empty-state">
        <div class="empty-content">
          <lucide-icon name="Target" [size]="48" class="empty-icon"></lucide-icon>
          <h3>No Goals Yet</h3>
          <p>Create your first financial goal using the form on the left. Set a target amount, deadline, and track your progress over time.</p>
        </div>
      </ui-card>
    </ng-template>
  `,
  styleUrl: './goals-list.component.css',
})
export class GoalsListComponent {
  @Input() goals: FinancialGoal[] = [];
  @Output() edit = new EventEmitter<FinancialGoal>();
  @Output() remove = new EventEmitter<string>();

  private goalsService = inject(GoalsService);
  formatCurrency = formatCurrency;

  getProgress(goal: FinancialGoal): number {
    return this.goalsService.getProgress(goal.id);
  }

  getTypeVariant(type: string): 'primary' | 'success' | 'warning' | 'danger' {
    const map: Record<string, 'primary' | 'success' | 'warning' | 'danger'> = {
      savings: 'success',
      debt: 'danger',
      expense_limit: 'warning',
      income_target: 'primary',
    };
    return map[type] || 'primary';
  }
}

