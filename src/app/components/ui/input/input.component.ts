import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

type InputType = 'text' | 'number' | 'email' | 'password' | 'date' | 'time' | 'search';

let inputAutoId = 0;

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  @Input() label?: string;
  @Input() helper?: string;
  @Input() error?: string;
  @Input() placeholder = '';
  @Input() type: InputType = 'text';
  @Input() textarea = false;
  @Input() rows = 3;
  @Input() disabled = false;
  @Input() required = false;
  @Input() name?: string;
  @Input() iconLeft?: string;
  @Input() iconRight?: string;
  @Input() prefix?: string;
  @Input() suffix?: string;
  @Input() options?: { label: string; value: string | number }[];
  @Input() size: 'md' | 'lg' = 'md';
  @Input() min?: string | number;
  @Input() max?: string | number;
  @Input() step?: string | number;
  @Input() maxlength?: number;

  @Output() focus = new EventEmitter<FocusEvent>();
  @Output() blur = new EventEmitter<FocusEvent>();

  value: string | number | null = null;
  controlId = `ui-input-${++inputAutoId}`;

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Si el valor inicial es null/undefined y hay un placeholder, mantenerlo vacío para mostrar placeholder
    if (this.value === null || this.value === undefined) {
      this.value = '';
    }
  }

  ngAfterViewInit() {
    // Forzar detección de cambios después de que la vista se inicialice
    this.cdr.detectChanges();
  }

  writeValue(value: any): void {
    // Aceptar cualquier valor, incluso strings vacíos, pero convertir null/undefined a ''
    if (value === null || value === undefined) {
      this.value = '';
    } else {
      this.value = value;
    }
    // Forzar detección de cambios cuando se escribe un valor
    this.cdr.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInput(event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const newValue = target.value;
    this.value = this.type === 'number' ? (newValue === '' ? null : Number(newValue)) : newValue;
    this.onChange(this.value);
  }

  handleFocus(event: FocusEvent) {
    this.focus.emit(event);
  }

  handleBlur(event: FocusEvent) {
    this.onTouched();
    this.blur.emit(event);
  }
}

