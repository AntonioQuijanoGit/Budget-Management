import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'ui-fab',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <button 
      class="fab" 
      [class.fab-bottom-right]="position === 'bottom-right'"
      [class.fab-bottom-left]="position === 'bottom-left'"
      [attr.aria-label]="ariaLabel || 'Add transaction'"
      (click)="onClick()"
    >
      <lucide-icon [name]="icon || 'Plus'" [size]="20"></lucide-icon>
      <span class="fab-label" *ngIf="label">{{ label }}</span>
    </button>
  `,
  styles: [`
    .fab {
      position: fixed;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-4);
      min-width: 56px;
      min-height: 56px;
      border-radius: var(--radius-full);
      background: #2563eb; /* blue-600 */
      color: #ffffff;
      border: none;
      box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3), 0 4px 6px -2px rgba(37, 99, 235, 0.2);
      cursor: pointer;
      transition: all var(--transition-fast);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-base);
    }

    .fab:hover {
      background: #1d4ed8; /* blue-700 */
      transform: translateY(-2px);
      box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.4), 0 10px 10px -5px rgba(37, 99, 235, 0.3);
    }

    .fab:active {
      transform: translateY(0);
      box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3), 0 4px 6px -2px rgba(37, 99, 235, 0.2);
    }

    .fab:focus-visible {
      outline: 2px solid #60a5fa; /* blue-400 */
      outline-offset: 2px;
    }

    .fab-bottom-right {
      bottom: calc(var(--space-6) + env(safe-area-inset-bottom));
      right: calc(var(--space-6) + env(safe-area-inset-right));
    }

    .fab-bottom-left {
      bottom: calc(var(--space-6) + env(safe-area-inset-bottom));
      left: calc(var(--space-6) + env(safe-area-inset-left));
    }

    .fab-label {
      white-space: nowrap;
      margin-right: var(--space-1);
    }

    /* Responsive: ocultar en desktop cuando hay sidebar */
    @media (min-width: 1024px) {
      .fab {
        display: none;
      }
    }

    /* Mobile: ajustar posición si hay bottom nav */
    @media (max-width: 1024px) {
      .fab-bottom-right,
      .fab-bottom-left {
        bottom: calc(72px + var(--space-6) + env(safe-area-inset-bottom));
      }
    }
  `]
})
export class FabComponent {
  @Input() icon?: string;
  @Input() label?: string;
  @Input() position: 'bottom-right' | 'bottom-left' = 'bottom-right';
  @Input() ariaLabel?: string;
  @Output() click = new EventEmitter<void>();

  onClick() {
    this.click.emit();
  }
}

