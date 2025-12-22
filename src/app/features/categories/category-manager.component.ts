import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../core/models/finance.models';
import { LucideAngularModule } from 'lucide-angular';
import { CardComponent } from '../../components/ui/card/card.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { BadgeComponent } from '../../components/ui/badge/badge.component';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    CardComponent,
    InputComponent,
    ButtonComponent,
    BadgeComponent,
  ],
  templateUrl: './category-manager.component.html',
  styleUrl: './category-manager.component.css',
})
export class CategoryManagerComponent implements OnInit {
  @Input() categories: Category[] = [];
  @Output() add = new EventEmitter<Category>();
  @Output() update = new EventEmitter<{ id: string; patch: Partial<Category> }>();
  @Output() remove = new EventEmitter<string>();

  name = '';
  color = this.getColor('--color-primary', '#3b82f6');
  icon = 'Tag';
  type: 'expense' | 'income' = 'expense';
  budgetMonthly?: number;
  submitting = false;

  ngOnInit() {
    // Asegurar que los valores por defecto estén inicializados
    if (!this.color) {
      this.color = this.getColor('--color-primary', '#3b82f6');
    }
    if (!this.icon) {
      this.icon = 'Tag';
    }
  }
  typeOptions = [
    { label: 'Expense', value: 'expense' },
    { label: 'Income', value: 'income' },
  ];

  onSubmit() {
    // Validar que el nombre no esté vacío
    if (!this.name || !this.name.trim()) {
      return;
    }

    // Validar que el icono no esté vacío
    if (!this.icon || !this.icon.trim()) {
      return;
    }

    this.submitting = true;

    // Crear la categoría
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: this.name.trim(),
      color: this.color || this.getColor('--color-primary', '#3b82f6'),
      icon: this.icon.trim(),
      type: this.type,
      budgetMonthly: this.budgetMonthly,
    };

    // Emitir el evento
    this.add.emit(newCategory);

    // Limpiar el formulario SOLO después de emitir exitosamente
    setTimeout(() => {
      this.reset();
      this.submitting = false;
    }, 100);
  }

  reset() {
    this.name = '';
    this.color = this.getColor('--color-primary', '#3b82f6');
    this.icon = 'Tag';
    this.type = 'expense';
    this.budgetMonthly = undefined;
  }

  updateBudget(cat: Category, value: number | null) {
    this.update.emit({ id: cat.id, patch: { budgetMonthly: value || undefined } });
  }

  private getColor(varName: string, fallback: string) {
    if (typeof document === 'undefined') return fallback;
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return value || fallback;
  }
}

