import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton" [class]="'skeleton-' + variant" [style.width]="width" [style.height]="height" [style.border-radius]="radius">
      <span class="sr-only">{{ label || 'Loading...' }}</span>
    </div>
  `,
  styles: [`
    .skeleton {
      background: linear-gradient(
        90deg,
        var(--color-bg-tertiary) 25%,
        var(--color-bg-secondary) 50%,
        var(--color-bg-tertiary) 75%
      );
      background-size: 200% 100%;
      animation: loading 1.5s ease-in-out infinite;
      display: block;
    }

    .skeleton-text {
      height: 1em;
      border-radius: var(--radius-sm);
    }

    .skeleton-title {
      height: 1.5em;
      border-radius: var(--radius-sm);
    }

    .skeleton-avatar {
      border-radius: var(--radius-full);
    }

    .skeleton-card {
      border-radius: var(--radius-lg);
      height: 120px;
    }

    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  `]
})
export class SkeletonComponent {
  @Input() variant: 'text' | 'title' | 'avatar' | 'card' = 'text';
  @Input() width?: string;
  @Input() height?: string;
  @Input() radius?: string;
  @Input() label?: string;
}






