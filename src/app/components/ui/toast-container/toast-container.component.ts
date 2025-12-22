import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../services/toast.service';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'ui-toast-container',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  template: `
    <div class="toast-container" aria-live="polite" aria-label="Notifications">
      <ui-toast
        *ngFor="let toast of toasts"
        [type]="toast.type"
        [message]="toast.message"
        [title]="toast.title"
        [duration]="toast.duration || 5000"
        [close]="getCloseHandler(toast.id)"
      ></ui-toast>
    </div>
  `,
  styleUrl: './toast-container.component.css',
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private sub?: any;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.sub = this.toastService.toasts.subscribe((toasts) => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  remove(id: string) {
    this.toastService.remove(id);
  }

  getCloseHandler(id: string) {
    return () => this.remove(id);
  }
}

