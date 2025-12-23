import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'ui-toast',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="toast" [ngClass]="['type-' + type, visible ? 'visible' : '']" role="alert" [attr.aria-live]="type === 'error' ? 'assertive' : 'polite'">
      <div class="toast__icon">
        <lucide-icon [name]="iconName" [size]="18"></lucide-icon>
      </div>
      <div class="toast__content">
        <p class="toast__title" *ngIf="title">{{ title }}</p>
        <p class="toast__message">{{ message }}</p>
      </div>
      <button class="toast__close" (click)="close()" aria-label="Close notification">
        <lucide-icon name="X" [size]="16"></lucide-icon>
      </button>
    </div>
  `,
  styleUrl: './toast.component.css',
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() type: ToastType = 'info';
  @Input() message = '';
  @Input() title?: string;
  @Input() duration = 5000;
  @Input() close = () => {};

  visible = false;
  private timeoutId?: number;

  get iconName(): string {
    const icons = {
      success: 'CheckCircle2',
      error: 'AlertCircle',
      warning: 'AlertTriangle',
      info: 'Info',
    };
    return icons[this.type];
  }

  ngOnInit() {
    setTimeout(() => (this.visible = true), 10);
    if (this.duration > 0) {
      this.timeoutId = window.setTimeout(() => this.close(), this.duration);
    }
  }

  ngOnDestroy() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}


