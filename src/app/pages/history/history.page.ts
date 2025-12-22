import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarViewComponent } from '../../features/calendar/calendar-view.component';
import { TransactionsService } from '../../services/transactions.service';
import { Transaction } from '../../core/models/finance.models';
import { TransactionCardComponent } from '../../features/transactions/transaction-card.component';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../core/models/finance.models';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-history-page',
  templateUrl: './history.page.html',
  styleUrl: './history.page.css',
  imports: [CommonModule, CalendarViewComponent, TransactionCardComponent, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryPage {
  private txSvc = inject(TransactionsService);
  private catSvc = inject(CategoriesService);
  transactions = signal<Transaction[]>([]);
  categories = signal<Category[]>([]);

  constructor() {
    this.txSvc.transactions$.subscribe(t => this.transactions.set(t));
    this.catSvc.categories$.subscribe(c => this.categories.set(c));
  }

  category(id: string) {
    return this.categories().find(c => c.id === id);
  }
}

