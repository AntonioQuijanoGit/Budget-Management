import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'ui-search',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="search-wrapper">
      <lucide-icon name="Search" class="search-icon" [size]="18" aria-hidden="true"></lucide-icon>
      <input
        type="search"
        class="search-input"
        [placeholder]="placeholder"
        [value]="value"
        (input)="onInput($event)"
        (focus)="onFocus.emit()"
        (blur)="onBlur.emit()"
        [attr.aria-label]="placeholder"
      />
      <button
        *ngIf="value"
        class="search-clear"
        (click)="clear()"
        aria-label="Clear search"
        type="button"
      >
        <lucide-icon name="X" [size]="16"></lucide-icon>
      </button>
    </div>
  `,
  styleUrl: './search.component.css',
})
export class SearchComponent {
  @Input() placeholder = 'Buscar...';
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() onFocus = new EventEmitter<void>();
  @Output() onBlur = new EventEmitter<void>();

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.valueChange.emit(this.value);
  }

  clear() {
    this.value = '';
    this.valueChange.emit('');
  }
}











