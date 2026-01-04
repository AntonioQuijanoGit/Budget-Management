import { Component, EventEmitter, Input, Output, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Category, Transaction, TransactionType } from '../../core/models/finance.models';
import { todayIso, todayIsoDate, isFutureDate, isValidDate } from '../../utils/date';
import { CardComponent } from '../../components/ui/card/card.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { BadgeComponent } from '../../components/ui/badge/badge.component';
import { TagsInputComponent } from '../../components/ui/tags-input/tags-input.component';
import { ToastService } from '../../services/toast.service';
import { BudgetsService } from '../../services/budgets.service';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
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
  private budgetsSvc = inject(BudgetsService);
  private txSvc = inject(TransactionsService);
  
  @Input() categories: Category[] = [];
  @Input() transactions: Transaction[] = [];
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
  date = todayIsoDate();
  notes = '';
  tags: string[] = [];
  editingTx: Transaction | null = null;
  submitting = signal(false);
  errors = signal<{ description?: string; amount?: string; categoryId?: string; date?: string }>({});

  // Budget feedback in real-time
  budgetFeedback = computed(() => {
    if (this.type !== 'expense' || !this.amount || this.amount <= 0 || !this.categoryId) {
      return null;
    }

    const category = this.categories.find(c => c.id === this.categoryId);
    if (!category || !category.budgetMonthly) {
      return null;
    }

    const existingTx = this.editingTx;
    const transactionsToCheck = existingTx 
      ? this.transactions.filter(t => t.id !== existingTx.id)
      : this.transactions;

    const budgetCheck = this.budgetsSvc.checkBudgetBeforeAdd(
      {
        id: '',
        type: 'expense',
        categoryId: this.categoryId,
        amount: this.amount,
        date: this.date,
        description: this.description,
      },
      this.categories,
      transactionsToCheck
    );

    if (!budgetCheck.category) return null;

    const remaining = budgetCheck.limit! - (budgetCheck.currentSpent || 0) - this.amount;
    const newRatio = budgetCheck.newRatio || 0;

    return {
      category: budgetCheck.category.name,
      remaining,
      newRatio,
      wouldExceed: budgetCheck.wouldExceed,
      warning: budgetCheck.warning,
    };
  });

  get categoryOptions() {
    // Filtrar categorías que coincidan con el tipo de transacción
    return this.categories
      .filter(cat => !cat.type || cat.type === this.type)
      .map(cat => ({ label: cat.name, value: cat.id }));
  }

  get todayIsoDate() {
    return todayIsoDate;
  }

  onTypeChange() {
    // Cuando cambia el tipo, validar que la categoría seleccionada sea compatible
    const selectedCategory = this.categories.find(c => c.id === this.categoryId);
    if (selectedCategory && selectedCategory.type && selectedCategory.type !== this.type) {
      // Si la categoría no coincide, seleccionar la primera categoría compatible
      const compatibleCategory = this.categories.find(c => !c.type || c.type === this.type);
      this.categoryId = compatibleCategory?.id || '';
    }
  }

  onSubmit() {
    const newErrors: { description?: string; amount?: string; categoryId?: string; date?: string } = {};
    
    // Validate description
    if (!this.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (this.description.trim().length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }
    
    // Validate category
    if (!this.categoryId) {
      newErrors.categoryId = 'Category is required';
    } else {
      const selectedCategory = this.categories.find(c => c.id === this.categoryId);
      if (!selectedCategory) {
        newErrors.categoryId = 'Selected category does not exist';
      } else if (selectedCategory.type && selectedCategory.type !== this.type) {
        newErrors.categoryId = `Category "${selectedCategory.name}" is for ${selectedCategory.type} transactions, not ${this.type}`;
      }
    }
    
    // Validate amount
    if (!this.amount || this.amount <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    } else if (this.amount > 1000000) {
      newErrors.amount = 'Amount is too large (maximum: 1,000,000)';
    } else if (this.amount < 0.01) {
      newErrors.amount = 'Amount must be at least 0.01';
    }
    
    // Validate date
    if (!this.date) {
      newErrors.date = 'Date is required';
    } else if (!isValidDate(this.date)) {
      newErrors.date = 'Invalid date format';
    } else if (isFutureDate(this.date)) {
      newErrors.date = 'Date cannot be in the future';
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
    
    // Simulate a small delay to show loading state
    setTimeout(() => {
      this.save.emit(tx);
      this.submitting.set(false);
      if (!this.editingTx) {
        this.reset();
        this.toastService.success(`Transaction "${tx.description}" added successfully`, 'Success');
      } else {
        this.toastService.success(`Transaction "${tx.description}" updated`, 'Updated');
      }
    }, 300);
  }

  onCancelEdit() {
    this.reset();
    this.cancelEdit.emit();
  }

  private reset() {
    this.type = 'expense';
    this.categoryId = this.categories.find(c => !c.type || c.type === 'expense')?.id || 'food';
    this.amount = 0;
    this.description = '';
    this.date = todayIsoDate();
    this.notes = '';
    this.tags = [];
    this.editingTx = null;
    this.errors.set({});
  }

  // Expose Math for template
  Math = Math;
}

