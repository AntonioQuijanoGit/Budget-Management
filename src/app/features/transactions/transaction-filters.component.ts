import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../core/models/finance.models';
import { TransactionFilters } from '../../services/transaction-filters.service';
import { CardComponent } from '../../components/ui/card/card.component';
import { InputComponent } from '../../components/ui/input/input.component';

@Component({
  selector: 'app-transaction-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, InputComponent],
  templateUrl: './transaction-filters.component.html',
  styleUrl: './transaction-filters.component.css',
})
export class TransactionFiltersComponent {
  @Input() categories: Category[] = [];
  @Input() value: TransactionFilters | null = null;
  @Output() change = new EventEmitter<Partial<TransactionFilters>>();

  typeOptions = [
    { label: 'All', value: 'all' },
    { label: 'Expenses', value: 'expense' },
    { label: 'Income', value: 'income' },
  ];

  updateField(field: keyof TransactionFilters, val: any) {
    this.change.emit({ [field]: val });
  }

  trackById(_: number, item: Category) {
    return item.id;
  }

  get categoryOptions() {
    return [
      { label: 'All', value: 'all' },
      ...this.categories.map(cat => ({ label: cat.name, value: cat.id })),
    ];
  }
}

