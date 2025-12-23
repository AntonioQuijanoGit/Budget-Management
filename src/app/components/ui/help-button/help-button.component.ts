import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-help-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <button class="help-button" type="button" (click)="open.emit()" aria-label="Open tutorial">
      <lucide-icon name="HelpCircle" [size]="24"></lucide-icon>
    </button>
  `,
  styleUrl: './help-button.component.css',
})
export class HelpButtonComponent {
  @Output() open = new EventEmitter<void>();
}


