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
      width: 120px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-2xl);
      background: linear-gradient(135deg, 
        color-mix(in srgb, var(--color-primary) 12%, transparent), 
        color-mix(in srgb, var(--color-primary) 6%, transparent));
      border: 1.5px solid color-mix(in srgb, var(--color-primary) 18%, transparent);
      margin-bottom: var(--space-2);
      transition: all var(--transition-base);
      position: relative;
      overflow: hidden;
    }

    .empty-icon-wrapper::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 50%, 
        color-mix(in srgb, var(--color-primary) 15%, transparent) 0%, 
        transparent 70%);
      opacity: 0.6;
      transition: opacity var(--transition-base);
    }

    .empty-icon-wrapper:hover {
      transform: scale(1.03);
      box-shadow: 0 8px 24px color-mix(in srgb, var(--color-primary) 25%, transparent);
      border-color: color-mix(in srgb, var(--color-primary) 30%, transparent);
    }

    .empty-icon-wrapper:hover::before {
      opacity: 0.8;
    }

    .empty-icon {
      color: var(--color-primary);
      opacity: 0.9;
      position: relative;
      z-index: 1;
      filter: drop-shadow(0 2px 4px color-mix(in srgb, var(--color-primary) 20%, transparent));
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








