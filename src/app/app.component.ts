import { Component, signal, computed, inject } from '@angular/core';
import { RouterModule, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { HelpButtonComponent } from './components/ui/help-button/help-button.component';
import { TutorialModalComponent, TutorialStep } from './components/ui/tutorial-modal/tutorial-modal.component';
import { ToastContainerComponent } from './components/ui/toast-container/toast-container.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    LucideAngularModule,
    HelpButtonComponent,
    TutorialModalComponent,
    ToastContainerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private router = inject(Router);
  title = 'presupuesto';

  // Detect if we're on a legacy route
  currentRoute = signal<string>('');
  isLegacyRoute = computed(() => {
    const route = this.currentRoute();
    return route === '/ingresarPresupuesto' || route === '/gastos';
  });

  // Tutorial state
  tutorialOpen = signal(false);
  tutorialStep = signal(0);
  tutorialSteps: TutorialStep[] = [
    { title: 'Welcome', desc: 'Quick overview of how to track income and expenses.', img: '' },
    { title: 'Dashboard & Balance', desc: 'See balance, income, expenses and trends at a glance.', img: '' },
    { title: 'Add Transactions', desc: 'Create incomes or expenses with categories and notes.', img: '' },
    { title: 'Filters & Search', desc: 'Refine by type, category, date range, and keywords.', img: '' },
    { title: 'Charts & Stats', desc: 'Analyze distribution by category and monthly evolution.', img: '' },
    { title: 'Start now', desc: 'Add your first transaction and stay on top of spending.', img: '' },
  ];

  constructor() {
    // Update current route on navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute.set(event.url);
      });
    // Set initial route
    this.currentRoute.set(this.router.url);
  }

  openTutorial() {
    this.tutorialStep.set(0);
    this.tutorialOpen.set(true);
  }
  closeTutorial() {
    this.tutorialOpen.set(false);
  }
  nextStep() {
    this.tutorialStep.update((s) => Math.min(s + 1, this.tutorialSteps.length - 1));
  }
  prevStep() {
    this.tutorialStep.update((s) => Math.max(s - 1, 0));
  }
}
