import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type CardPadding = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() eyebrow?: string;
  @Input() hoverable = false;
  @Input() padding: CardPadding = 'md';
}











