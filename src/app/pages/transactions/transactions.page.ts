import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionFormComponent } from '../../features/transactions/transaction-form.component';
import { TransactionListComponent } from '../../features/transactions/transaction-list.component';
import { TransactionFiltersComponent } from '../../features/transactions/transaction-filters.component';
import { SearchComponent } from '../../components/ui/search/search.component';
import { TransactionsService } from '../../services/transactions.service';
import { CategoriesService } from '../../services/categories.service';
import { TransactionFiltersService, TransactionFilters } from '../../services/transaction-filters.service';
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsPage {
  private txSvc = inject(TransactionsService);
  private catSvc = inject(CategoriesService);
  private toastService = inject(ToastService);
  filtersSvc = inject(TransactionFiltersService);
  
  searchQuery = signal('');

  transactions = signal<Transaction[]>([]);
  categories = signal<Category[]>([]);
  editing = signal<Transaction | null>(null);

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

  constructor() {
    this.txSvc.transactions$.subscribe(t => this.transactions.set(t));
    this.catSvc.categories$.subscribe(c => this.categories.set(c));
  }

  onFiltersChange(partial: Partial<TransactionFilters>) {
    this.filtersSvc.filters.update(v => ({ ...v, ...partial }));
  }

  handleSave(tx: Transaction) {
    if (this.editing()) {
      this.txSvc.update(tx.id, tx);
      this.editing.set(null);
    } else {
      this.txSvc.add(tx);
    }
  }

  handleEdit(tx: Transaction) {
    this.editing.set(tx);
  }

  handleRemove(id: string) {
    const tx = this.transactions().find(t => t.id === id);
    if (!tx) return;
    
    if (confirm(`Are you sure you want to delete the transaction "${tx.description}"?`)) {
      this.txSvc.remove(id);
      this.toastService.success(`Transaction "${tx.description}" deleted`, 'Deleted');
    }
  }
  
  onSearchChange(query: string) {
    this.searchQuery.set(query);
  }

  cancelEdit() {
    this.editing.set(null);
  }
}

