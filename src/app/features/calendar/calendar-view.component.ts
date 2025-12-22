import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../core/models/finance.models';
import { LucideAngularModule } from 'lucide-angular';

interface DayCell {
  date: Date;
  total: number;
}

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.css',
})
export class CalendarViewComponent {
  @Input() transactions: Transaction[] = [];

  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();

  get days(): DayCell[] {
    const first = new Date(this.currentYear, this.currentMonth, 1);
    const last = new Date(this.currentYear, this.currentMonth + 1, 0);
    const days: DayCell[] = [];
    for (let d = 1; d <= last.getDate(); d++) {
      const date = new Date(this.currentYear, this.currentMonth, d);
      const iso = date.toISOString().slice(0, 10);
      const total = this.transactions
        .filter(t => t.date.slice(0, 10) === iso && t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);
      days.push({ date, total });
    }
    return days;
  }

  get monthName(): string {
    return new Date(this.currentYear, this.currentMonth, 1).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }

  goToToday() {
    const now = new Date();
    this.currentMonth = now.getMonth();
    this.currentYear = now.getFullYear();
  }
}

