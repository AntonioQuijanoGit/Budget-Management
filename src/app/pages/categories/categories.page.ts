import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryManagerComponent } from '../../features/categories/category-manager.component';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../core/models/finance.models';
import { LucideAngularModule } from 'lucide-angular';

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
  categories = signal<Category[]>([]);

  constructor() {
    this.catSvc.categories$.subscribe(c => this.categories.set(c));
  }

  add(cat: Category) {
    this.catSvc.add(cat);
  }

  update(ev: { id: string; patch: Partial<Category> }) {
    this.catSvc.update(ev.id, ev.patch);
  }

  remove(id: string) {
    this.catSvc.remove(id);
  }
}

