import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryManagerComponent } from '../../features/categories/category-manager.component';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../core/models/finance.models';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-categories-page',
  templateUrl: './categories.page.html',
  styleUrl: './categories.page.css',
  imports: [CommonModule, CategoryManagerComponent, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPage {
  private catSvc = inject(CategoriesService);
  private toastSvc = inject(ToastService);
  categories = signal<Category[]>([]);

  constructor() {
    this.catSvc.categories$.subscribe(c => this.categories.set(c));
  }

  add(cat: Category) {
    try {
      this.catSvc.add(cat);
    } catch (e: any) {
      this.toastSvc.error(e.message || 'Failed to add category', 'Error');
    }
  }

  update(ev: { id: string; patch: Partial<Category> }) {
    try {
      this.catSvc.update(ev.id, ev.patch);
    } catch (e: any) {
      this.toastSvc.error(e.message || 'Failed to update category', 'Error');
    }
  }

  remove(id: string) {
    try {
      this.catSvc.remove(id);
    } catch (e: any) {
      this.toastSvc.error(e.message || 'Failed to remove category', 'Error');
    }
  }
}

