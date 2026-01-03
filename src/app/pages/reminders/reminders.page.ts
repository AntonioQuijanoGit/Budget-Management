import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reminder } from '../../core/models/finance.models';
import { RemindersService } from '../../services/reminders.service';
import { RemindersListComponent } from '../../features/reminders/reminders-list.component';
import { ReminderFormComponent } from '../../features/reminders/reminder-form.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reminders-page',
  standalone: true,
  imports: [CommonModule, RemindersListComponent, ReminderFormComponent],
  templateUrl: './reminders.page.html',
  styleUrl: './reminders.page.css',
})
export class RemindersPage {
  private remindersSvc = inject(RemindersService);
  private toastSvc = inject(ToastService);

  reminders = signal<Reminder[]>([]);
  editing = signal<Reminder | null>(null);

  constructor() {
    this.remindersSvc.reminders.subscribe(r => this.reminders.set(r));
  }

  handleSave(reminder: Reminder) {
    try {
      if (this.editing()) {
        this.remindersSvc.update(reminder.id, reminder);
        this.editing.set(null);
        this.toastSvc.success('Reminder updated');
      } else {
        this.remindersSvc.add(reminder);
        this.toastSvc.success('Reminder created');
      }
    } catch (e: any) {
      this.toastSvc.error(e.message || 'Failed to save reminder', 'Error');
    }
  }

  handleEdit(reminder: Reminder) {
    this.editing.set(reminder);
  }

  handleToggle(id: string) {
    const reminder = this.reminders().find(r => r.id === id);
    if (reminder) {
      this.remindersSvc.update(id, { isCompleted: !reminder.isCompleted });
      this.toastSvc.info(reminder.isCompleted ? 'Reminder reopened' : 'Reminder completed');
    }
  }

  handleRemove(id: string) {
    if (confirm('Are you sure you want to delete this reminder?')) {
      this.remindersSvc.remove(id);
      this.toastSvc.info('Reminder deleted');
    }
  }

  cancelEdit() {
    this.editing.set(null);
  }
}

