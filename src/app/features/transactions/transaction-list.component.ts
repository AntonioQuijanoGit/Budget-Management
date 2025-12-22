import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category, Transaction } from '../../core/models/finance.models';
import { TransactionCardComponent } from './transaction-card.component';
import { CardComponent } from '../../components/ui/card/card.component';
import { BadgeComponent } from '../../components/ui/badge/badge.component';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, TransactionCardComponent, CardComponent, BadgeComponent],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css',
})
export class TransactionListComponent {
  @Input() transactions: Transaction[] = [];
  @Input() categories: Category[] = [];
  @Output() edit = new EventEmitter<Transaction>();
  @Output() remove = new EventEmitter<string>();

  findCategory(id: string) {
    return this.categories.find(c => c.id === id);
  }

  get hasItems() {
    return this.transactions && this.transactions.length > 0;
  }
}

