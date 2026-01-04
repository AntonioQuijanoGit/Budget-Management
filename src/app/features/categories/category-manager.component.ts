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
  color = this.getColor('--color-primary', '#6366f1');
  icon = 'Tag';
  type: 'expense' | 'income' = 'expense';
  budgetMonthly?: number;
  submitting = false;

  ngOnInit() {
    // Asegurar que los valores por defecto estén inicializados
    if (!this.color) {
      this.color = this.getColor('--color-primary', '#6366f1');
    }
    if (!this.icon) {
      this.icon = 'Tag';
    }
  }

  /**
   * Get color with opacity - handles hex, rgb, and named colors
   * Converts any color format to rgba for consistent borders and backgrounds
   */
  getColorWithOpacity(color: string, opacity: number): string {
    if (!color) return `rgba(128, 128, 128, ${opacity})`;
    
    // If it's a hex color (#rrggbb or #rgb)
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      let r: number, g: number, b: number;
      
      if (hex.length === 3) {
        // Short hex (#rgb)
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else if (hex.length === 6) {
        // Full hex (#rrggbb)
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      } else {
        // Invalid hex, fallback to gray
        return `rgba(128, 128, 128, ${opacity})`;
      }
      
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    // If it's already rgba or rgb
    if (color.startsWith('rgb')) {
      const match = color.match(/\d+/g);
      if (match && match.length >= 3) {
        return `rgba(${match[0]}, ${match[1]}, ${match[2]}, ${opacity})`;
      }
    }
    
    // For CSS variables or named colors, use a canvas to get computed color
    // Fallback: return a default gray color with opacity
    return `rgba(128, 128, 128, ${opacity})`;
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

