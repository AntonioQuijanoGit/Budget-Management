import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reminder } from '../../core/models/finance.models';
import { CardComponent } from '../../components/ui/card/card.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { todayIso } from '../../utils/date';

@Component({
  selector: 'app-reminder-form',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, InputComponent, ButtonComponent],
  template: `
    <ui-card 
      [eyebrow]="editingReminder ? 'Edit Reminder' : 'New Reminder'"
      [title]="editingReminder ? 'Update Reminder' : 'Create Reminder'"
      [hoverable]="true"
      padding="md"
    >
      <form class="reminder-form" (ngSubmit)="onSubmit()">
        <ui-input
          label="Title"
          [(ngModel)]="title"
          name="title"
          [required]="true"
          placeholder="e.g. Pay electricity bill"
        ></ui-input>

        <ui-input
          label="Description"
          [(ngModel)]="description"
          name="description"
          [textarea]="true"
          [rows]="2"
          placeholder="Add additional details..."
          helper="Optional - add more context about this reminder"
        ></ui-input>

        <div class="form-row">
          <ui-input
            label="Date"
            type="date"
            [(ngModel)]="date"
            name="date"
            [required]="true"
            [min]="todayIso()"
            helper="When should this reminder trigger?"
          ></ui-input>

          <ui-input
            label="Time"
            type="time"
            [(ngModel)]="time"
            name="time"
            helper="Optional - set a specific time for this reminder"
          ></ui-input>
        </div>

        <div class="form-row">
          <ui-input
            label="Type"
            name="type"
            [options]="typeOptions"
            [(ngModel)]="type"
            [required]="true"
          ></ui-input>

          <ui-input
            label="Priority"
            name="priority"
            [options]="priorityOptions"
            [(ngModel)]="priority"
            [required]="true"
          ></ui-input>
        </div>

        <div class="form-actions">
          <ui-button type="submit" variant="primary" [loading]="submitting">
            {{ editingReminder ? 'Update' : 'Create Reminder' }}
          </ui-button>
          <ui-button type="button" variant="ghost" *ngIf="editingReminder" (buttonClick)="onCancel()">
            Cancel
          </ui-button>
        </div>
      </form>
    </ui-card>
  `,
  styleUrl: './reminder-form.component.css',
})
export class ReminderFormComponent {
  @Input() editingReminder?: Reminder;
  @Output() save = new EventEmitter<Reminder>();
  @Output() cancel = new EventEmitter<void>();

  title = '';
  description = '';
  date = todayIso().split('T')[0];
  time = '';
  type: 'transaction' | 'bill' | 'goal' | 'budget' = 'bill';
  priority: 'low' | 'medium' | 'high' = 'medium';
  submitting = false;

  typeOptions = [
    { label: 'Transaction', value: 'transaction' },
    { label: 'Bill', value: 'bill' },
    { label: 'Goal', value: 'goal' },
    { label: 'Budget', value: 'budget' },
  ];

  priorityOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
  ];

  todayIso = () => todayIso().split('T')[0];

  ngOnChanges() {
    if (this.editingReminder) {
      this.title = this.editingReminder.title;
      this.description = this.editingReminder.description || '';
      this.date = this.editingReminder.date.split('T')[0];
      this.time = this.editingReminder.time || '';
      this.type = this.editingReminder.type;
      this.priority = this.editingReminder.priority;
    } else {
      this.reset();
    }
  }

  onSubmit() {
    if (!this.title.trim()) return;

    this.submitting = true;
    const reminder: Reminder = this.editingReminder
      ? {
          ...this.editingReminder,
          title: this.title.trim(),
          description: this.description.trim() || undefined,
          date: this.date,
          time: this.time || undefined,
          type: this.type,
          priority: this.priority,
        }
      : {
          id: crypto.randomUUID(),
          title: this.title.trim(),
          description: this.description.trim() || undefined,
          date: this.date,
          time: this.time || undefined,
          type: this.type,
          priority: this.priority,
          isCompleted: false,
        };

    this.save.emit(reminder);
    this.submitting = false;
    if (!this.editingReminder) this.reset();
  }

  onCancel() {
    this.cancel.emit();
    this.reset();
  }

  private reset() {
    this.title = '';
    this.description = '';
    this.date = todayIso().split('T')[0];
    this.time = '';
    this.type = 'bill';
    this.priority = 'medium';
  }
}

