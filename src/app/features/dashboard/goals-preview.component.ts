import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FinancialGoal } from '../../core/models/finance.models';
import { GoalsService } from '../../services/goals.service';
import { CardComponent } from '../../components/ui/card/card.component';
import { LucideAngularModule } from 'lucide-angular';
import { formatCurrency } from '../../utils/currency';

@Component({
  selector: 'app-goals-preview',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, LucideAngularModule],
  template: `
    <ui-card title="Active Goals" padding="md" *ngIf="goals.length > 0; else empty">
      <div class="goals-preview-list">
        <div *ngFor="let goal of goals.slice(0, 3)" class="goal-preview-item">
          <div class="goal-preview-icon" [style.background]="goal.color + '15'" [style.color]="goal.color">
            <lucide-icon [name]="goal.icon || 'Target'" [size]="16"></lucide-icon>
          </div>
          <div class="goal-preview-content">
            <p class="goal-preview-title">{{ goal.title }}</p>
            <div class="goal-preview-progress">
              <div class="progress-bar-mini">
                <div class="progress-fill-mini" [style.width.%]="getProgress(goal.id)"></div>
              </div>
              <span class="progress-text-mini">
                {{ formatCurrency(goal.currentAmount) }} / {{ formatCurrency(goal.targetAmount) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <a routerLink="/goals" class="view-all-link">
        View all goals →
      </a>
    </ui-card>

    <ng-template #empty>
      <ui-card title="Active Goals" padding="md">
        <p class="empty-text">You have no active goals. <a routerLink="/goals">Create one →</a></p>
      </ui-card>
    </ng-template>
  `,
  styleUrl: './goals-preview.component.css',
})
export class GoalsPreviewComponent {
  @Input() goals: FinancialGoal[] = [];

  private goalsService = inject(GoalsService);
  formatCurrency = formatCurrency;

  getProgress(id: string): number {
    return this.goalsService.getProgress(id);
  }
}

