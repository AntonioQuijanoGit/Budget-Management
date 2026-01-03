import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialGoal } from '../../core/models/finance.models';
import { GoalsService } from '../../services/goals.service';
import { GoalsListComponent } from '../../features/goals/goals-list.component';
import { GoalFormComponent } from '../../features/goals/goal-form.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-goals-page',
  standalone: true,
  imports: [CommonModule, GoalsListComponent, GoalFormComponent],
  templateUrl: './goals.page.html',
  styleUrl: './goals.page.css',
})
export class GoalsPage {
  private goalsService = inject(GoalsService);
  private toastSvc = inject(ToastService);

  goals = signal<FinancialGoal[]>([]);
  editing = signal<FinancialGoal | null>(null);

  constructor() {
    // Use goalsWithProgress$ which auto-updates from transactions
    this.goalsService.goalsWithProgress$.subscribe(g => this.goals.set(g));
  }

  handleSave(goal: FinancialGoal) {
    try {
      if (this.editing()) {
        this.goalsService.update(goal.id, goal);
        this.editing.set(null);
        this.toastSvc.success('Goal updated');
      } else {
        this.goalsService.add(goal);
        this.toastSvc.success('Goal created');
      }
    } catch (e: any) {
      this.toastSvc.error(e.message || 'Failed to save goal', 'Error');
    }
  }

  handleEdit(goal: FinancialGoal) {
    this.editing.set(goal);
  }

  handleRemove(id: string) {
    if (confirm('Are you sure you want to delete this goal?')) {
      this.goalsService.remove(id);
      this.toastSvc.info('Goal deleted');
    }
  }

  cancelEdit() {
    this.editing.set(null);
  }
}

