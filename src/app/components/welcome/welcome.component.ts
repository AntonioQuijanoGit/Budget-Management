import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, DollarSign, TrendingUp, PieChart, X, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  showWelcome = signal(true);
  
  // Lucide icons
  DollarSign = DollarSign;
  TrendingUp = TrendingUp;
  PieChart = PieChart;
  X = X;
  ArrowRight = ArrowRight;

  ngOnInit() {
    // Check if user has seen welcome screen before
    const hasSeenWelcome = localStorage.getItem('budget-welcome-seen');
    if (hasSeenWelcome === 'true') {
      this.showWelcome.set(false);
    }
  }

  closeWelcome() {
    this.showWelcome.set(false);
    localStorage.setItem('budget-welcome-seen', 'true');
  }

  getStarted() {
    this.closeWelcome();
    // Scroll to main content
    setTimeout(() => {
      const mainContent = document.querySelector('main') || document.querySelector('router-outlet');
      if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }
}

