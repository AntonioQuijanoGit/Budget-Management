import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

type ModalSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements AfterViewInit, OnChanges {
  @Input() open = false;
  @Input() title?: string;
  @Input() description?: string;
  @Input() size: ModalSize = 'md';

  @Output() close = new EventEmitter<void>();

  @ViewChild('modalElement') modalElement?: ElementRef<HTMLDivElement>;
  private previousActiveElement: HTMLElement | null = null;
  private tabKeyHandler?: (e: KeyboardEvent) => void;

  ngAfterViewInit() {
    if (this.open) {
      this.trapFocus();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open']) {
      if (this.open) {
        // Guardar elemento activo antes de abrir
        this.previousActiveElement = document.activeElement as HTMLElement;
        // Usar setTimeout para asegurar que el DOM esté actualizado
        setTimeout(() => {
          this.trapFocus();
        }, 0);
      } else {
        // Limpiar focus trap cuando se cierra
        this.cleanupFocusTrap();
        // Restaurar focus cuando se cierra
        if (this.previousActiveElement) {
          this.previousActiveElement.focus();
          this.previousActiveElement = null;
        }
      }
    }
  }

  private trapFocus() {
    if (!this.modalElement?.nativeElement) return;

    const modal = this.modalElement.nativeElement;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus en el primer elemento
    firstElement.focus();

    // Limpiar handler anterior si existe
    this.cleanupFocusTrap();

    // Manejar Tab key
    this.tabKeyHandler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    modal.addEventListener('keydown', this.tabKeyHandler);
  }

  private cleanupFocusTrap() {
    if (this.tabKeyHandler && this.modalElement?.nativeElement) {
      this.modalElement.nativeElement.removeEventListener('keydown', this.tabKeyHandler);
      this.tabKeyHandler = undefined;
    }
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.open) this.close.emit();
  }

  handleBackdrop(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}


