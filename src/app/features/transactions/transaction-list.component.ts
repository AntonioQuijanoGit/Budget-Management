import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category, Transaction } from '../../core/models/finance.models';
import { TransactionCardComponent } from './transaction-card.component';
import { CardComponent } from '../../components/ui/card/card.component';
import { BadgeComponent } from '../../components/ui/badge/badge.component';
import { EmptyStateComponent } from '../../components/ui/empty-state/empty-state.component';
import { ButtonComponent } from '../../components/ui/button/button.component';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    CommonModule,
    TransactionCardComponent,
    CardComponent,
    BadgeComponent,
    EmptyStateComponent,
    ButtonComponent
  ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css',
})
export class TransactionListComponent {
  @Input() transactions: Transaction[] = [];
  @Input() categories: Category[] = [];
  @Output() edit = new EventEmitter<Transaction>();
  @Output() remove = new EventEmitter<string>();
  @Output() addTransaction = new EventEmitter<void>();

  findCategory(id: string) {
    return this.categories.find(c => c.id === id);
  }

  get hasItems() {
    return this.transactions && this.transactions.length > 0;
  }

  scrollToForm() {
    this.addTransaction.emit();
    // Scroll suave al formulario
    setTimeout(() => {
      const form = document.querySelector('app-transaction-form');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}

