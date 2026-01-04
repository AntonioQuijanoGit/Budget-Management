import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() block = false;
  @Input() ripple = true;
  @Input() iconLeft?: string;
  @Input() iconRight?: string;

  @Output() buttonClick = new EventEmitter<MouseEvent>();

  @HostBinding('class.block')
  get hostBlock() {
    return this.block;
  }

  onClick(event: MouseEvent) {
    if (this.disabled || this.loading) {
      event.preventDefault();
      return;
    }

    this.buttonClick.emit(event);
  }

  get variantClass() {
    return `variant-${this.variant}`;
  }

  get sizeClass() {
    return `size-${this.size}`;
  }
}
