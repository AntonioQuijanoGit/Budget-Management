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
        <div class="empty-icon-wrapper" *ngIf="icon">
          <lucide-icon [name]="icon" [size]="64" class="empty-icon"></lucide-icon>
        </div>
        <h3 *ngIf="title" class="empty-title">{{ title }}</h3>
        <p *ngIf="description" class="empty-description">{{ description }}</p>
        <div class="empty-actions">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .empty-state {
      text-align: center;
      padding: var(--space-12) var(--space-4);
    }

    .empty-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-8) var(--space-4);
      max-width: 480px;
      margin: 0 auto;
    }

    .empty-icon-wrapper {
      width: 96px;
      height: 96px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-2xl);
      background: var(--color-bg-tertiary);
      margin-bottom: var(--space-2);
    }

    .empty-icon {
      color: var(--color-text-tertiary);
      opacity: 0.6;
    }

    .empty-title {
      margin: 0;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      line-height: var(--line-height-tight);
    }

    .empty-description {
      margin: 0;
      color: var(--color-text-secondary);
      max-width: 400px;
      line-height: var(--line-height-relaxed);
      font-size: var(--font-size-base);
    }

    .empty-actions {
      margin-top: var(--space-2);
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      align-items: center;
      width: 100%;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon?: string;
  @Input() title?: string;
  @Input() description?: string;
}








