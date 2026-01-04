import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinancialGoal } from '../../core/models/finance.models';
import { CardComponent } from '../../components/ui/card/card.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { BadgeComponent } from '../../components/ui/badge/badge.component';
import { ToastService } from '../../services/toast.service';
import { todayIso } from '../../utils/date';

@Component({
  selector: 'app-goal-form',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, InputComponent, ButtonComponent, BadgeComponent],
  template: `
    <ui-card 
      [eyebrow]="editingGoal ? 'Edit Goal' : 'New Goal'"
      [title]="editingGoal ? 'Update Your Goal' : 'Create a Financial Goal'"
      [hoverable]="true"
      padding="md"
    >
      <form class="goal-form" (ngSubmit)="onSubmit()">
        <ui-input
          label="Goal Title"
          [(ngModel)]="title"
          name="title"
          [required]="true"
          [error]="errors().title"
          placeholder="Save for vacation"
        ></ui-input>

        <ui-input
          label="Description"
          [(ngModel)]="description"
          name="description"
          [textarea]="true"
          [rows]="2"
          placeholder="Add goal details..."
          helper="Optional - add more details about this goal"
        ></ui-input>

        <div class="form-row">
          <ui-input
            label="Target Amount"
            type="number"
            [(ngModel)]="targetAmount"
            name="targetAmount"
            [required]="true"
            [min]="0"
            [step]="0.01"
            [error]="errors().targetAmount"
            suffix="€"
            placeholder="0.00"
          ></ui-input>

          <ui-input
            label="Current Amount"
            type="number"
            [(ngModel)]="currentAmount"
            name="currentAmount"
            [min]="0"
            [step]="0.01"
            suffix="€"
            placeholder="0.00"
            helper="Leave empty to auto-calculate from transactions, or set manually"
          ></ui-input>
        </div>

        <ui-input
          label="Type"
          name="type"
          [options]="typeOptions"
          [(ngModel)]="type"
          [helper]="getTypeDescription()"
        ></ui-input>

        <ui-input
          label="Deadline (optional)"
          type="date"
          [(ngModel)]="deadline"
          name="deadline"
          [min]="todayIso()"
          helper="Set a target date to achieve this goal. This helps you track progress and stay motivated."
        ></ui-input>

        <div class="form-actions">
          <ui-button type="submit" variant="primary" [loading]="submitting">
            {{ editingGoal ? 'Update' : 'Create Goal' }}
          </ui-button>
          <ui-button type="button" variant="ghost" *ngIf="editingGoal" (buttonClick)="onCancel()">
            Cancel
          </ui-button>
        </div>
      </form>
    </ui-card>
  `,
  styleUrl: './goal-form.component.css',
})
export class GoalFormComponent {
  private toastService = inject(ToastService);
  
  @Input() editingGoal?: FinancialGoal;
  @Output() save = new EventEmitter<FinancialGoal>();
  @Output() cancel = new EventEmitter<void>();

  title = '';
  description = '';
  targetAmount = 0;
  currentAmount = 0;
  type: 'savings' | 'debt' | 'expense_limit' | 'income_target' = 'savings';
  deadline = '';
  submitting = false;
  errors = signal<{ title?: string; targetAmount?: string }>({});

  typeOptions = [
    { label: 'Savings', value: 'savings' },
    { label: 'Debt', value: 'debt' },
    { label: 'Expense Limit', value: 'expense_limit' },
    { label: 'Income Target', value: 'income_target' },
  ];

  todayIso = todayIso;

  ngOnChanges() {
    if (this.editingGoal) {
      this.title = this.editingGoal.title;
      this.description = this.editingGoal.description || '';
      this.targetAmount = this.editingGoal.targetAmount;
      this.currentAmount = this.editingGoal.currentAmount;
      this.type = this.editingGoal.type;
      this.deadline = this.editingGoal.deadline || '';
    } else {
      this.reset();
    }
  }

  onSubmit() {
    const newErrors: { title?: string; targetAmount?: string; currentAmount?: string; deadline?: string } = {};
    
    // Validar título
    if (!this.title.trim()) {
      newErrors.title = 'Goal title is required';
    } else if (this.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    // Validar monto objetivo
    if (!this.targetAmount || this.targetAmount <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than zero';
    } else if (this.targetAmount > 10000000) {
      newErrors.targetAmount = 'Target amount is too large (maximum: 10,000,000)';
    } else if (this.targetAmount < 0.01) {
      newErrors.targetAmount = 'Target amount must be at least 0.01';
    }
    
    // Validar monto actual
    if (this.currentAmount < 0) {
      newErrors.currentAmount = 'Current amount cannot be negative';
    } else if (this.currentAmount > this.targetAmount) {
      newErrors.currentAmount = 'Current amount cannot exceed target amount';
    }
    
    // Validar deadline si existe
    if (this.deadline) {
      const deadlineDate = new Date(this.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      deadlineDate.setHours(0, 0, 0, 0);
      if (deadlineDate < today) {
        newErrors.deadline = 'Deadline cannot be in the past';
      }
    }
    
    this.errors.set(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      this.toastService.error('Please fix the errors in the form', 'Validation Error');
      return;
    }
    
    this.submitting = true;
    const goal: FinancialGoal = this.editingGoal
      ? {
          ...this.editingGoal,
          title: this.title.trim(),
          description: this.description.trim() || undefined,
          targetAmount: this.targetAmount,
          currentAmount: this.currentAmount,
          type: this.type,
          deadline: this.deadline || undefined,
        }
      : {
          id: crypto.randomUUID(),
          title: this.title.trim(),
          description: this.description.trim() || undefined,
          targetAmount: this.targetAmount,
          currentAmount: this.currentAmount,
          type: this.type,
          deadline: this.deadline || undefined,
          icon: 'Target',
          color: this.getColor('--color-primary', '#6366f1'),
          createdAt: todayIso(),
        };

    this.errors.set({});
    this.save.emit(goal);
    this.submitting = false;
    if (!this.editingGoal) {
      this.reset();
      this.toastService.success(`Goal "${goal.title}" created successfully`);
    } else {
      this.toastService.success(`Goal "${goal.title}" updated`);
    }
  }

  onCancel() {
    this.cancel.emit();
    this.reset();
  }

  private reset() {
    this.title = '';
    this.description = '';
    this.targetAmount = 0;
    this.currentAmount = 0;
    this.type = 'savings';
    this.deadline = '';
    this.errors.set({});
  }

  getTypeDescription(): string {
    const descriptions: Record<string, string> = {
      savings: 'Auto-calculated: Total income minus expenses. Tracks your net savings.',
      debt: 'Auto-calculated: Sum of all expenses. Tracks total debt/spending.',
      expense_limit: 'Auto-calculated: Sum of expenses in selected category (or all if none). Tracks spending limit.',
      income_target: 'Auto-calculated: Sum of all income transactions. Tracks income goal.',
    };
    return descriptions[this.type] || 'Select a goal type';
  }

  private getColor(varName: string, fallback: string): string {
    if (typeof document === 'undefined') return fallback;
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return value || fallback;
  }
}

