import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryManagerComponent } from '../../features/categories/category-manager.component';
import { CategoriesService } from '../../services/categories.service';
import { TransactionsService } from '../../services/transactions.service';
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
  private txSvc = inject(TransactionsService);
  private toastSvc = inject(ToastService);
  categories = signal<Category[]>([]);
  transactions = signal<any[]>([]);

  constructor() {
    this.catSvc.categories$.subscribe(c => this.categories.set(c));
    this.txSvc.transactions$.subscribe(t => this.transactions.set(t));
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
      // Check if category has transactions
      const transactionsInCategory = this.transactions().filter(t => t.categoryId === id);
      
      if (transactionsInCategory.length > 0) {
        const proceed = confirm(
          `⚠️ Cannot Delete Category\n\nThis category has ${transactionsInCategory.length} transaction(s).\n\nWould you like to:\n1. Migrate transactions to "Uncategorized" and delete\n2. Cancel\n\n(Click OK to migrate and delete, Cancel to abort)`
        );
        
        if (proceed) {
          // Migrate transactions to uncategorized (or first available category)
          const otherCategory = this.categories().find(c => c.id !== id);
          if (otherCategory) {
            transactionsInCategory.forEach(tx => {
              this.txSvc.update(tx.id, { categoryId: otherCategory.id });
            });
            this.toastSvc.info(`${transactionsInCategory.length} transactions migrated to "${otherCategory.name}"`, 'Transactions Migrated');
          }
          this.catSvc.remove(id);
          this.toastSvc.success('Category deleted', 'Deleted');
        }
      } else {
        this.catSvc.remove(id);
        this.toastSvc.success('Category deleted', 'Deleted');
      }
    } catch (e: any) {
      this.toastSvc.error(e.message || 'Failed to remove category', 'Error');
    }
  }
}

