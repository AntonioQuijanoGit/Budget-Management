import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionFormComponent } from '../../features/transactions/transaction-form.component';
import { TransactionListComponent } from '../../features/transactions/transaction-list.component';
import { TransactionFiltersComponent } from '../../features/transactions/transaction-filters.component';
import { SearchComponent } from '../../components/ui/search/search.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { ModalComponent } from '../../components/ui/modal/modal.component';
import { BadgeComponent } from '../../components/ui/badge/badge.component';
import { CardComponent } from '../../components/ui/card/card.component';
import { LucideAngularModule } from 'lucide-angular';
import { TransactionsService } from '../../services/transactions.service';
import { CategoriesService } from '../../services/categories.service';
import { TransactionFiltersService, TransactionFilters } from '../../services/transaction-filters.service';
import { BudgetsService } from '../../services/budgets.service';
import { ToastService } from '../../services/toast.service';
import { Category, Transaction } from '../../core/models/finance.models';

@Component({
  standalone: true,
  selector: 'app-transactions-page',
  templateUrl: './transactions.page.html',
  styleUrl: './transactions.page.css',
  imports: [
    CommonModule,
    TransactionFormComponent,
    TransactionListComponent,
    TransactionFiltersComponent,
    SearchComponent,
    ButtonComponent,
    ModalComponent,
    BadgeComponent,
    CardComponent,
    LucideAngularModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsPage {
  private txSvc = inject(TransactionsService);
  private catSvc = inject(CategoriesService);
  private budgetsSvc = inject(BudgetsService);
  private toastService = inject(ToastService);
  filtersSvc = inject(TransactionFiltersService);
  
  searchQuery = signal('');

  transactions = signal<Transaction[]>([]);
  categories = signal<Category[]>([]);
  editing = signal<Transaction | null>(null);
  deletingId = signal<string | null>(null);
  
  deletingTransaction = computed(() => {
    const id = this.deletingId();
    if (!id) return null;
    return this.transactions().find(t => t.id === id) || null;
  });

  filtered = computed(() => {
    let result = this.filtersSvc.apply(this.transactions());
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(tx => 
        tx.description.toLowerCase().includes(query) ||
        tx.notes?.toLowerCase().includes(query)
      );
    }
    return result;
  });

  // Active filters for display
  activeFilters = computed(() => {
    const filters = this.filtersSvc.filters();
    const active: Array<{ label: string; value: string; key: string }> = [];
    
    if (filters.type !== 'all') {
      active.push({ label: 'Type', value: filters.type === 'expense' ? 'Expenses' : 'Income', key: 'type' });
    }
    if (filters.categoryId !== 'all') {
      const category = this.categories().find(c => c.id === filters.categoryId);
      if (category) {
        active.push({ label: 'Category', value: category.name, key: 'categoryId' });
      }
    }
    if (filters.min !== undefined) {
      active.push({ label: 'Min', value: `€${filters.min}`, key: 'min' });
    }
    if (filters.max !== undefined) {
      active.push({ label: 'Max', value: `€${filters.max}`, key: 'max' });
    }
    if (filters.from) {
      active.push({ label: 'From', value: new Date(filters.from).toLocaleDateString(), key: 'from' });
    }
    if (filters.to) {
      active.push({ label: 'To', value: new Date(filters.to).toLocaleDateString(), key: 'to' });
    }
    if (filters.q) {
      active.push({ label: 'Search', value: filters.q, key: 'q' });
    }
    if (filters.isRecurring !== 'all') {
      active.push({ label: 'Recurring', value: filters.isRecurring === 'yes' ? 'Yes' : 'No', key: 'isRecurring' });
    }
    
    return active;
  });

  clearFilter(key: string) {
    const filters = this.filtersSvc.filters();
    if (key === 'type') {
      this.filtersSvc.filters.update(f => ({ ...f, type: 'all' }));
    } else if (key === 'categoryId') {
      this.filtersSvc.filters.update(f => ({ ...f, categoryId: 'all' }));
    } else if (key === 'min') {
      this.filtersSvc.filters.update(f => ({ ...f, min: undefined }));
    } else if (key === 'max') {
      this.filtersSvc.filters.update(f => ({ ...f, max: undefined }));
    } else if (key === 'from') {
      this.filtersSvc.filters.update(f => ({ ...f, from: undefined }));
    } else if (key === 'to') {
      this.filtersSvc.filters.update(f => ({ ...f, to: undefined }));
    } else if (key === 'q') {
      this.filtersSvc.filters.update(f => ({ ...f, q: '' }));
    } else if (key === 'isRecurring') {
      this.filtersSvc.filters.update(f => ({ ...f, isRecurring: 'all' }));
    }
  }

  clearAllFilters() {
    this.filtersSvc.reset();
  }

  constructor() {
    this.txSvc.transactions$.subscribe(t => this.transactions.set(t));
    this.catSvc.categories$.subscribe(c => this.categories.set(c));
  }

  onFiltersChange(partial: Partial<TransactionFilters>) {
    this.filtersSvc.filters.update(v => ({ ...v, ...partial }));
  }

  async handleSave(tx: Transaction) {
    try {
      // Check for duplicates (only for new transactions)
      if (!this.editing()) {
        const duplicate = this.transactions().find(t => 
          t.type === tx.type &&
          t.categoryId === tx.categoryId &&
          t.amount === tx.amount &&
          t.date === tx.date &&
          t.description.toLowerCase().trim() === tx.description.toLowerCase().trim()
        );
        
        if (duplicate) {
          const proceed = confirm(
            `⚠️ Duplicate Transaction\n\nA similar transaction already exists:\n"${duplicate.description}" - ${tx.amount}€ on ${tx.date}\n\nDo you want to add it anyway?`
          );
          if (!proceed) {
            return;
          }
        }
      }

      // Check budget before adding/editing expenses
      if (tx.type === 'expense') {
        const existingTx = this.editing() ? this.transactions().find(t => t.id === tx.id) : null;
        const transactionsToCheck = existingTx 
          ? this.transactions().filter(t => t.id !== tx.id) // Exclude the one being edited
          : this.transactions();
        
        const budgetCheck = this.budgetsSvc.checkBudgetBeforeAdd(
          tx,
          this.categories(),
          transactionsToCheck
        );

        if (budgetCheck.wouldExceed) {
          // Show warning toast but allow transaction to proceed
          this.toastService.warning(
            budgetCheck.warning || 'This expense exceeds your budget',
            'Budget Exceeded'
          );
        } else if (budgetCheck.warning) {
          // Show info toast
          this.toastService.info(budgetCheck.warning, 'Budget Info');
        }
      }

      if (this.editing()) {
        this.txSvc.update(tx.id, tx);
        this.editing.set(null);
      } else {
        this.txSvc.add(tx);
        
        // Check and notify budget alerts after adding
        setTimeout(async () => {
          await this.budgetsSvc.checkAndNotifyBudgetAlerts(
            this.categories(),
            this.transactions()
          );
        }, 100);
      }
    } catch (e: any) {
      this.toastService.error(e.message || 'Failed to save transaction', 'Error');
    }
  }

  handleEdit(tx: Transaction) {
    this.editing.set(tx);
  }

  handleRemove(id: string) {
    this.deletingId.set(id);
  }

  confirmDelete() {
    const id = this.deletingId();
    if (!id) return;
    
    const tx = this.transactions().find(t => t.id === id);
    if (!tx) {
      this.deletingId.set(null);
      return;
    }
    
    this.txSvc.remove(id);
    this.toastService.success(`Transaction "${tx.description}" deleted`, 'Deleted');
    this.deletingId.set(null);
  }

  cancelDelete() {
    this.deletingId.set(null);
  }
  
  onSearchChange(query: string) {
    this.searchQuery.set(query);
  }

  cancelEdit() {
    this.editing.set(null);
  }

  getCategoryName(categoryId?: string): string {
    if (!categoryId) return 'Uncategorized';
    const category = this.categories().find(c => c.id === categoryId);
    return category?.name || 'Uncategorized';
  }

  scrollToForm() {
    setTimeout(() => {
      const form = document.querySelector('app-transaction-form');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}

