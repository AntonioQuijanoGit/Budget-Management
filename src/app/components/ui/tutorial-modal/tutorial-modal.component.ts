import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '../button/button.component';

export interface TutorialStep {
  title: string;
  desc: string;
  img?: string;
}

@Component({
  selector: 'app-tutorial-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ButtonComponent],
  templateUrl: './tutorial-modal.component.html',
  styleUrl: './tutorial-modal.component.css',
})
export class TutorialModalComponent {
  @Input() open = false;
  @Input() step = 0;
  @Input() steps: TutorialStep[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() skip = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
  onNext() {
    this.next.emit();
  }
  onPrev() {
    this.prev.emit();
  }
  onSkip() {
    this.skip.emit();
  }
}

