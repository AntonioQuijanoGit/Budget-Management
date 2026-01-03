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
      min-width: 56px; /* Apple System Design: mínimo 56px para FAB */
      min-height: 56px;
      border-radius: var(--radius-full);
      background: var(--primary);
      color: var(--primary-foreground);
      border: none;
      box-shadow: 
        0 10px 15px -3px color-mix(in srgb, var(--primary) 30%, transparent),
        0 4px 6px -2px color-mix(in srgb, var(--primary) 20%, transparent);
      cursor: pointer;
      transition: background var(--transition-base), 
                  box-shadow var(--transition-base), 
                  transform var(--transition-active);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-base);
      -webkit-tap-highlight-color: transparent;
    }

    .fab:hover {
      background: color-mix(in srgb, var(--primary) 90%, black);
      transform: translateY(-2px) scale(1.02);
      box-shadow: 
        0 20px 25px -5px color-mix(in srgb, var(--primary) 40%, transparent),
        0 10px 10px -5px color-mix(in srgb, var(--primary) 30%, transparent);
    }

    .fab:active {
      transform: translateY(0) scale(0.98);
      box-shadow: 
        0 10px 15px -3px color-mix(in srgb, var(--primary) 30%, transparent),
        0 4px 6px -2px color-mix(in srgb, var(--primary) 20%, transparent);
      transition: all var(--transition-fast);
    }

    .fab:focus-visible {
      outline: 2px solid var(--ring);
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



