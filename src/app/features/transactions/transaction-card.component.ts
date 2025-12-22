import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category, Transaction } from '../../core/models/finance.models';
import { formatCurrency } from '../../utils/currency';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-transaction-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './transaction-card.component.html',
  styleUrl: './transaction-card.component.css',
})
export class TransactionCardComponent {
  @Input() transaction!: Transaction;
  @Input() category?: Category | undefined;
  @Output() edit = new EventEmitter<Transaction>();
  @Output() remove = new EventEmitter<string>();

  get amountLabel() {
    const sign = this.transaction.type === 'expense' ? '-' : '+';
    return `${sign}${formatCurrency(this.transaction.amount)}`;
  }

  onEdit() {
    this.edit.emit(this.transaction);
  }

  onRemove() {
    this.remove.emit(this.transaction.id);
  }
}

