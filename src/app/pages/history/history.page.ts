import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CalendarViewComponent } from '../../features/calendar/calendar-view.component';
import { TransactionsService } from '../../services/transactions.service';
import { Transaction } from '../../core/models/finance.models';
import { TransactionCardComponent } from '../../features/transactions/transaction-card.component';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../core/models/finance.models';
import { LucideAngularModule } from 'lucide-angular';
import { EmptyStateComponent } from '../../components/ui/empty-state/empty-state.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { ToastService } from '../../services/toast.service';
import { ModalComponent } from '../../components/ui/modal/modal.component';

@Component({
  standalone: true,
  selector: 'app-history-page',
  templateUrl: './history.page.html',
  styleUrl: './history.page.css',
  imports: [
    CommonModule, 
    RouterModule,
    CalendarViewComponent, 
    TransactionCardComponent, 
    LucideAngularModule,
    EmptyStateComponent,
    ButtonComponent,
    ModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryPage {
  private txSvc = inject(TransactionsService);
  private catSvc = inject(CategoriesService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  
  transactions = signal<Transaction[]>([]);
  categories = signal<Category[]>([]);
  deletingId = signal<string | null>(null);

  constructor() {
    this.txSvc.transactions$.subscribe(t => this.transactions.set(t));
    this.catSvc.categories$.subscribe(c => this.categories.set(c));
  }

  category(id: string) {
    return this.categories().find(c => c.id === id);
  }

  deletingTransaction() {
    const id = this.deletingId();
    if (!id) return null;
    return this.transactions().find(t => t.id === id) || null;
  }

  handleEdit(tx: Transaction) {
    // Navigate to transactions page for editing
    this.router.navigate(['/transactions'], { 
      queryParams: { edit: tx.id } 
    });
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
}

