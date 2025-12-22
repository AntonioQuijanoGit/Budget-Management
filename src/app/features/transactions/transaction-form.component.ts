import { Component, EventEmitter, Input, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category, Transaction, TransactionType } from '../../core/models/finance.models';
import { todayIso } from '../../utils/date';
import { CardComponent } from '../../components/ui/card/card.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { BadgeComponent } from '../../components/ui/badge/badge.component';
import { TagsInputComponent } from '../../components/ui/tags-input/tags-input.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    InputComponent,
    ButtonComponent,
    BadgeComponent,
    TagsInputComponent,
  ],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css',
})
export class TransactionFormComponent {
  private toastService = inject(ToastService);
  
  @Input() categories: Category[] = [];
  @Input() set editing(value: Transaction | null) {
    this.editingTx = value;
    if (value) {
      this.type = value.type;
      this.categoryId = value.categoryId;
      this.amount = value.amount;
      this.description = value.description;
      this.date = value.date;
      this.notes = value.notes || '';
      this.tags = value.tags || [];
    } else {
      this.reset();
    }
  }
  @Output() save = new EventEmitter<Transaction>();
  @Output() cancelEdit = new EventEmitter<void>();

  type: TransactionType = 'expense';
  categoryId: string = 'food';
  amount = 0;
  description = '';
  date = todayIso();
  notes = '';
  tags: string[] = [];
  editingTx: Transaction | null = null;
  submitting = signal(false);
  errors = signal<{ description?: string; amount?: string; categoryId?: string }>({});

  get categoryOptions() {
    return this.categories.map(cat => ({ label: cat.name, value: cat.id }));
  }

  onSubmit() {
    const newErrors: { description?: string; amount?: string; categoryId?: string } = {};
    
    // Validar descripción
    if (!this.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    // Validar categoría
    if (!this.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    // Validar monto
    if (!this.amount || this.amount <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    } else if (this.amount > 1000000) {
      newErrors.amount = 'Amount is too large';
    }
    
    this.errors.set(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      this.toastService.error('Please fix the errors in the form', 'Validation Error');
      return;
    }
    
    this.submitting.set(true);
    const tx: Transaction = this.editingTx
      ? { ...this.editingTx, type: this.type, categoryId: this.categoryId, amount: this.amount, description: this.description.trim(), date: this.date, notes: this.notes, tags: this.tags }
      : {
          id: crypto.randomUUID(),
          type: this.type,
          categoryId: this.categoryId,
          amount: this.amount,
          description: this.description.trim(),
          date: this.date,
          notes: this.notes,
          tags: this.tags,
        };
    this.errors.set({});
    this.save.emit(tx);
    this.submitting.set(false);
    if (!this.editingTx) {
      this.reset();
      this.toastService.success(`Transaction "${tx.description}" added successfully`);
    } else {
      this.toastService.success(`Transaction "${tx.description}" updated`);
    }
  }

  onCancelEdit() {
    this.reset();
    this.cancelEdit.emit();
  }

  private reset() {
    this.type = 'expense';
    this.categoryId = this.categories.find(c => c.type === 'expense')?.id || 'food';
    this.amount = 0;
    this.description = '';
    this.date = todayIso();
    this.notes = '';
    this.tags = [];
    this.editingTx = null;
    this.errors.set({});
  }
}

