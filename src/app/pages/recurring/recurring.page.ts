import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecurringTransaction } from '../../core/models/finance.models';
import { RecurringTransactionsService } from '../../services/recurring-transactions.service';
import { CategoriesService } from '../../services/categories.service';
import { RecurringListComponent } from '../../features/recurring/recurring-list.component';
import { RecurringFormComponent } from '../../features/recurring/recurring-form.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-recurring-page',
  standalone: true,
  imports: [CommonModule, RecurringListComponent, RecurringFormComponent],
  templateUrl: './recurring.page.html',
  styleUrl: './recurring.page.css',
})
export class RecurringPage {
  private recurringSvc = inject(RecurringTransactionsService);
  private catSvc = inject(CategoriesService);
  private toastSvc = inject(ToastService);

  recurring = signal<RecurringTransaction[]>([]);
  categories = signal([] as any);
  editing = signal<RecurringTransaction | null>(null);

  constructor() {
    this.recurringSvc.recurring.subscribe(r => this.recurring.set(r));
    this.catSvc.categories$.subscribe(c => this.categories.set(c));
  }

  handleSave(recurring: RecurringTransaction) {
    if (this.editing()) {
      this.recurringSvc.update(recurring.id, recurring);
      this.editing.set(null);
      this.toastSvc.success('Recurring transaction updated');
    } else {
      this.recurringSvc.add(recurring);
      this.toastSvc.success('Recurring transaction created');
    }
  }

  handleEdit(recurring: RecurringTransaction) {
    this.editing.set(recurring);
  }

  handleToggle(id: string) {
    const item = this.recurring().find(r => r.id === id);
    if (item) {
      this.recurringSvc.update(id, { isActive: !item.isActive });
      this.toastSvc.info(item.isActive ? 'Recurring transaction paused' : 'Recurring transaction activated');
    }
  }

  handleRemove(id: string) {
    if (confirm('Are you sure you want to delete this recurring transaction?')) {
      this.recurringSvc.remove(id);
      this.toastSvc.info('Recurring transaction deleted');
    }
  }

  cancelEdit() {
    this.editing.set(null);
  }
}

