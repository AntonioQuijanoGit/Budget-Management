import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BadgeComponent } from '../badge/badge.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'ui-tags-input',
  standalone: true,
  imports: [CommonModule, FormsModule, BadgeComponent, LucideAngularModule],
  template: `
    <div class="tags-input">
      <label *ngIf="label" class="tags-input__label">{{ label }}</label>
      <div class="tags-input__container">
        <div class="tags-list" *ngIf="tags.length > 0">
          <ui-badge *ngFor="let tag of tags; let i = index" variant="primary" size="sm" class="tag-badge">
            {{ tag }}
            <button
              type="button"
              class="tag-remove"
              (click)="removeTag(i)"
              [attr.aria-label]="'Remove tag ' + tag"
            >
              <lucide-icon name="X" [size]="12"></lucide-icon>
            </button>
          </ui-badge>
        </div>
        <input
          type="text"
          class="tags-input__field"
          [placeholder]="placeholder"
          [(ngModel)]="inputValue"
          (keydown.enter)="addTag($event)"
          (keydown)="onKeyDown($event)"
          (blur)="addTag($event)"
          [disabled]="disabled"
        />
      </div>
      <p *ngIf="helper" class="tags-input__helper">{{ helper }}</p>
    </div>
  `,
  styleUrl: './tags-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagsInputComponent),
      multi: true,
    },
  ],
})
export class TagsInputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() helper?: string;
  @Input() placeholder = 'Add tags (Enter or comma)';
  @Input() disabled = false;

  tags: string[] = [];
  inputValue = '';

  private onChange = (value: string[]) => {};
  private onTouched = () => {};

  writeValue(value: string[]): void {
    this.tags = value || [];
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === ',' || event.key === 'Enter') {
      event.preventDefault();
      this.addTag(event);
    }
  }

  addTag(event: Event): void {
    event.preventDefault();
    const value = this.inputValue.trim().toLowerCase();
    if (value && !this.tags.includes(value)) {
      this.tags = [...this.tags, value];
      this.onChange(this.tags);
      this.inputValue = '';
    }
  }

  removeTag(index: number): void {
    this.tags = this.tags.filter((_, i) => i !== index);
    this.onChange(this.tags);
  }
}

