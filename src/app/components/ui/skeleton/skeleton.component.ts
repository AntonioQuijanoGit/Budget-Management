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
        var(--color-bg-tertiary) 0%,
        color-mix(in srgb, var(--color-bg-tertiary) 80%, var(--color-text-primary)) 50%,
        var(--color-bg-tertiary) 100%
      );
      background-size: 200% 100%;
      animation: loading 1.8s ease-in-out infinite;
      display: block;
      position: relative;
      overflow: hidden;
    }
    
    .skeleton::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        color-mix(in srgb, var(--color-text-primary) 5%, transparent) 50%,
        transparent 100%
      );
      animation: shimmer 1.8s ease-in-out infinite;
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
    
    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
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










