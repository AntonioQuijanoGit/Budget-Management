import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'ui-empty-state',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="empty-state">
      <div class="empty-content">
        <lucide-icon *ngIf="icon" [name]="icon" [size]="48" class="empty-icon"></lucide-icon>
        <h3 *ngIf="title" class="empty-title">{{ title }}</h3>
        <p *ngIf="description" class="empty-description">{{ description }}</p>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .empty-state {
      text-align: center;
      padding: var(--space-8) var(--space-4);
    }

    .empty-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-8) var(--space-4);
    }

    .empty-icon {
      color: var(--color-text-tertiary);
      opacity: 0.5;
    }

    .empty-title {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
    }

    .empty-description {
      margin: 0;
      color: var(--color-text-secondary);
      max-width: 400px;
      line-height: var(--line-height-relaxed);
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon?: string;
  @Input() title?: string;
  @Input() description?: string;
}

