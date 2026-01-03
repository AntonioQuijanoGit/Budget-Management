import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Wallet, BarChart3, Tag, TrendingUp, X, ArrowRight } from 'lucide-angular';
import { ButtonComponent } from '../ui/button/button.component';

interface Feature {
  icon: any;
  title: string;
  description: string;
}

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ButtonComponent],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  showWelcome = signal(true);
  isClosing = signal(false); // Flag para prevenir animaciones durante el cierre
  
  // Lucide icons
  Wallet = Wallet;
  BarChart3 = BarChart3;
  Tag = Tag;
  TrendingUp = TrendingUp;
  X = X;
  ArrowRight = ArrowRight;

  constructor(private router: Router) {}

  features: Feature[] = [
    {
      icon: BarChart3,
      title: 'Visual Analytics',
      description: 'Interactive charts showing spending patterns and trends'
    },
    {
      icon: Tag,
      title: 'Category Tracking',
      description: 'Organize expenses by categories for better insights'
    },
    {
      icon: TrendingUp,
      title: 'Monthly Reports',
      description: 'Comprehensive reports with category breakdowns'
    }
  ];

  ngOnInit() {
    // Always show welcome on component init
    // User can close it if they want, but it will show again on next visit
    this.showWelcome.set(true);
  }

  closeWelcome() {
    this.isClosing.set(true); // Marcar como cerrando para deshabilitar animaciones
    this.showWelcome.set(false);
    // Navigate to dashboard when closing welcome
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 150); // Reducido el tiempo
  }

  getStarted(event?: Event) {
    // Prevenir cualquier propagación de eventos
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.closeWelcome();
  }
}


