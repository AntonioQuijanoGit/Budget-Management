import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecurringTransaction } from '../../core/models/finance.models';
import { CardComponent } from '../../components/ui/card/card.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { CategoriesService } from '../../services/categories.service';
import { todayIso } from '../../utils/date';

@Component({
  selector: 'app-recurring-form',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, InputComponent, ButtonComponent],
  template: `
    <ui-card 
      [eyebrow]="editingRecurring ? 'Edit Recurring' : 'New Recurring Transaction'"
      [title]="editingRecurring ? 'Update Recurring' : 'Create Recurring Transaction'"
      [hoverable]="true"
      padding="md"
    >
      <form class="recurring-form" (ngSubmit)="onSubmit()">
        <ui-input
          label="Name"
          [(ngModel)]="name"
          name="name"
          [required]="true"
          placeholder="Monthly Salary, Rent..."
        ></ui-input>

        <ui-input
          label="Type"
          name="type"
          [options]="typeOptions"
          [(ngModel)]="type"
          helper="Select whether this is an income or expense"
        ></ui-input>

        <ui-input
          label="Category"
          name="categoryId"
          [options]="categoryOptions"
          [(ngModel)]="categoryId"
          [required]="true"
          helper="Choose the category for this transaction"
        ></ui-input>

        <ui-input
          label="Amount"
          type="number"
          [(ngModel)]="amount"
          name="amount"
          [required]="true"
          [min]="0"
          [step]="0.01"
          suffix="€"
          placeholder="0.00"
          helper="Enter the transaction amount"
        ></ui-input>

        <ui-input
          label="Frequency"
          name="frequency"
          [options]="frequencyOptions"
          [(ngModel)]="frequency"
          [required]="true"
          helper="How often should this transaction repeat?"
        ></ui-input>

        <div class="form-row">
          <ui-input
            label="Start Date"
            type="date"
            [(ngModel)]="startDate"
            name="startDate"
            [required]="true"
            [min]="todayIso()"
            helper="When should this recurring transaction start?"
          ></ui-input>

          <ui-input
            label="End Date"
            type="date"
            [(ngModel)]="endDate"
            name="endDate"
            [min]="startDate || todayIso()"
            helper="Optional - leave empty for indefinite recurrence"
          ></ui-input>
        </div>

        <div class="form-actions">
          <ui-button type="submit" variant="primary" [loading]="submitting">
            {{ editingRecurring ? 'Update' : 'Create Recurring' }}
          </ui-button>
          <ui-button type="button" variant="ghost" *ngIf="editingRecurring" (buttonClick)="onCancel()">
            Cancel
          </ui-button>
        </div>
      </form>
    </ui-card>
  `,
  styleUrl: './recurring-form.component.css',
})
export class RecurringFormComponent {
  @Input() editingRecurring?: RecurringTransaction;
  @Input() categories: any[] = [];
  @Output() save = new EventEmitter<RecurringTransaction>();
  @Output() cancel = new EventEmitter<void>();

  private catSvc = inject(CategoriesService);

  name = '';
  type: 'expense' | 'income' = 'expense';
  categoryId = '';
  amount = 0;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly';
  startDate = todayIso().split('T')[0];
  endDate = '';
  submitting = false;

  typeOptions = [
    { label: 'Expense', value: 'expense' },
    { label: 'Income', value: 'income' },
  ];

  frequencyOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
  ];

  get categoryOptions() {
    return this.categories
      .filter(c => !c.type || c.type === this.type)
      .map(c => ({ label: c.name, value: c.id }));
  }

  todayIso = () => todayIso().split('T')[0];

  ngOnChanges() {
    if (this.editingRecurring) {
      this.name = this.editingRecurring.name;
      this.type = this.editingRecurring.type;
      this.categoryId = this.editingRecurring.categoryId;
      this.amount = this.editingRecurring.amount;
      this.frequency = this.editingRecurring.frequency;
      this.startDate = this.editingRecurring.startDate.split('T')[0];
      this.endDate = this.editingRecurring.endDate?.split('T')[0] || '';
    } else {
      this.reset();
    }
  }

  onSubmit() {
    if (!this.name.trim() || !this.categoryId || this.amount <= 0) return;

    this.submitting = true;
    const nextDueDate = this.calculateNextDueDate(this.startDate, this.frequency);
    
    const recurring: RecurringTransaction = this.editingRecurring
      ? {
          ...this.editingRecurring,
          name: this.name.trim(),
          type: this.type,
          categoryId: this.categoryId,
          amount: this.amount,
          frequency: this.frequency,
          startDate: this.startDate,
          endDate: this.endDate || undefined,
          nextDueDate,
        }
      : {
          id: crypto.randomUUID(),
          name: this.name.trim(),
          type: this.type,
          categoryId: this.categoryId,
          amount: this.amount,
          frequency: this.frequency,
          startDate: this.startDate,
          endDate: this.endDate || undefined,
          nextDueDate,
          isActive: true,
        };

    this.save.emit(recurring);
    this.submitting = false;
    if (!this.editingRecurring) this.reset();
  }

  onCancel() {
    this.cancel.emit();
    this.reset();
  }

  private calculateNextDueDate(start: string, freq: string): string {
    const date = new Date(start);
    const today = new Date();
    
    if (date > today) return start;

    while (date <= today) {
      switch (freq) {
        case 'daily':
          date.setDate(date.getDate() + 1);
          break;
        case 'weekly':
          date.setDate(date.getDate() + 7);
          break;
        case 'monthly':
          date.setMonth(date.getMonth() + 1);
          break;
        case 'yearly':
          date.setFullYear(date.getFullYear() + 1);
          break;
      }
    }
    
    return date.toISOString().split('T')[0];
  }

  private reset() {
    this.name = '';
    this.type = 'expense';
    this.categoryId = '';
    this.amount = 0;
    this.frequency = 'monthly';
    this.startDate = todayIso().split('T')[0];
    this.endDate = '';
  }
}

