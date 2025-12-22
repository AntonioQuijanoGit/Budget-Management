import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinancialGoal } from '../../core/models/finance.models';
import { CardComponent } from '../../components/ui/card/card.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { BadgeComponent } from '../../components/ui/badge/badge.component';
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
          placeholder="e.g. Save for vacation"
        ></ui-input>

        <ui-input
          label="Description"
          [(ngModel)]="description"
          name="description"
          [textarea]="true"
          [rows]="2"
          placeholder="Describe your goal..."
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
          ></ui-input>
        </div>

        <ui-input
          label="Type"
          name="type"
          [options]="typeOptions"
          [(ngModel)]="type"
        ></ui-input>

        <ui-input
          label="Deadline (optional)"
          type="date"
          [(ngModel)]="deadline"
          name="deadline"
          [min]="todayIso()"
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
    if (!this.title.trim() || this.targetAmount <= 0) return;
    
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
          color: this.getColor('--color-primary', '#007aff'),
          createdAt: todayIso(),
        };

    this.save.emit(goal);
    this.submitting = false;
    if (!this.editingGoal) this.reset();
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
  }

  private getColor(varName: string, fallback: string): string {
    if (typeof document === 'undefined') return fallback;
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return value || fallback;
  }
}

