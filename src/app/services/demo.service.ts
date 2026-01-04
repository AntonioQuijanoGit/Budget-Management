import { Injectable, inject } from '@angular/core';
import { AppStore } from '../core/store/app.store';
import { TransactionsService } from './transactions.service';
import { CategoriesService } from './categories.service';
import { GoalsService } from './goals.service';
import { RemindersService } from './reminders.service';
import { Transaction, Category, FinancialGoal, Reminder } from '../core/models/finance.models';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class DemoService {
  private store = inject(AppStore);
  private txSvc = inject(TransactionsService);
  private catSvc = inject(CategoriesService);
  private goalsSvc = inject(GoalsService);
  private remindersSvc = inject(RemindersService);
  private toastService = inject(ToastService);

  private readonly DEMO_FLAG_KEY = 'bm_demo_mode';
  private readonly FIRST_VISIT_KEY = 'bm_first_visit';

  /**
   * Check if we should auto-load demo data (only on first visit)
   */
  shouldLoadDemo(): boolean {
    // Si ya se hizo la primera visita, no auto-cargar
    if (localStorage.getItem(this.FIRST_VISIT_KEY) === 'done') {
      return false;
    }
    // Solo auto-cargar si no hay transacciones (primera visita real)
    const transactions = this.store.transactions();
    return transactions.length === 0;
  }

  /**
   * Mark that first visit is done (no more auto-loading)
   */
  markFirstVisitDone(): void {
    localStorage.setItem(this.FIRST_VISIT_KEY, 'done');
  }

  /**
   * Check if currently in demo mode
   */
  isDemoMode(): boolean {
    return localStorage.getItem(this.DEMO_FLAG_KEY) === 'true';
  }

  /**
   * Set demo mode flag
   */
  setDemoMode(isDemo: boolean): void {
    if (isDemo) {
      localStorage.setItem(this.DEMO_FLAG_KEY, 'true');
    } else {
      localStorage.removeItem(this.DEMO_FLAG_KEY);
    }
  }

  /**
   * Load demo data and mark as demo mode
   */
  loadDemoData(showToast = true): void {
    const today = new Date();
    const getDate = (daysAgo: number) => {
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      return date.toISOString().split('T')[0];
    };

    // Clear existing data
    this.store.setTransactions([]);
    this.store.setGoals([]);
    this.store.setReminders([]);
    this.store.setCategories([]);

    // Create demo categories
    const demoCategories: Category[] = [
      { id: 'salary', name: 'Salary', color: '#34C759', icon: 'Wallet', type: 'income' },
      { id: 'freelance', name: 'Freelance', color: '#34C759', icon: 'Briefcase', type: 'income' },
      { id: 'food', name: 'Food', color: '#ef4444', icon: 'UtensilsCrossed', type: 'expense', budgetMonthly: 400 },
      { id: 'transport', name: 'Transport', color: '#6366f1', icon: 'Bus', type: 'expense', budgetMonthly: 150 },
      { id: 'entertainment', name: 'Entertainment', color: '#FF9500', icon: 'Film', type: 'expense', budgetMonthly: 200 },
      { id: 'shopping', name: 'Shopping', color: '#ec4899', icon: 'ShoppingBag', type: 'expense', budgetMonthly: 300 },
      { id: 'bills', name: 'Bills & Utilities', color: '#3b82f6', icon: 'Receipt', type: 'expense', budgetMonthly: 450 },
      { id: 'housing', name: 'Housing', color: '#06b6d4', icon: 'Home', type: 'expense', budgetMonthly: 1200 },
      { id: 'healthcare', name: 'Healthcare', color: '#f59e0b', icon: 'Heart', type: 'expense', budgetMonthly: 150 },
      { id: 'subscriptions', name: 'Subscriptions', color: '#f97316', icon: 'CreditCard', type: 'expense', budgetMonthly: 80 },
    ];

    demoCategories.forEach(cat => this.store.addCategory(cat));

    // Wait a bit for categories to be saved, then create transactions
    setTimeout(() => {
      const cats = this.store.categories();
      const getCategoryId = (name: string) => cats.find(c => c.name === name)?.id || cats[0]?.id || 'food';

      const demoTransactions: Transaction[] = [
        // Income - last 3 months
        { id: 'demo-1', type: 'income', categoryId: getCategoryId('Salary'), amount: 3200, date: getDate(65), description: 'Monthly Salary - December' },
        { id: 'demo-2', type: 'income', categoryId: getCategoryId('Salary'), amount: 3200, date: getDate(35), description: 'Monthly Salary - January' },
        { id: 'demo-3', type: 'income', categoryId: getCategoryId('Salary'), amount: 3200, date: getDate(5), description: 'Monthly Salary - February' },
        { id: 'demo-4', type: 'income', categoryId: getCategoryId('Freelance'), amount: 850, date: getDate(25), description: 'Freelance Project - Website Design' },
        
        // Recent expenses (this month)
        { id: 'demo-5', type: 'expense', categoryId: getCategoryId('Food'), amount: 45.80, date: getDate(0), description: 'Supermarket - Weekly Groceries' },
        { id: 'demo-6', type: 'expense', categoryId: getCategoryId('Transport'), amount: 32.50, date: getDate(1), description: 'Metro Monthly Pass' },
        { id: 'demo-7', type: 'expense', categoryId: getCategoryId('Food'), amount: 28.90, date: getDate(2), description: 'Restaurant - Lunch Meeting' },
        { id: 'demo-8', type: 'expense', categoryId: getCategoryId('Entertainment'), amount: 15.99, date: getDate(3), description: 'Netflix Subscription' },
        { id: 'demo-9', type: 'expense', categoryId: getCategoryId('Shopping'), amount: 89.50, date: getDate(4), description: 'Amazon - New Headphones' },
        { id: 'demo-10', type: 'expense', categoryId: getCategoryId('Food'), amount: 12.40, date: getDate(5), description: 'Coffee Shop - Morning Coffee' },
        { id: 'demo-11', type: 'expense', categoryId: getCategoryId('Bills & Utilities'), amount: 125.60, date: getDate(6), description: 'Electricity Bill' },
        { id: 'demo-12', type: 'expense', categoryId: getCategoryId('Transport'), amount: 8.50, date: getDate(7), description: 'Uber Ride - Airport' },
        { id: 'demo-13', type: 'expense', categoryId: getCategoryId('Food'), amount: 67.30, date: getDate(8), description: 'Weekend Grocery Shopping' },
        { id: 'demo-14', type: 'expense', categoryId: getCategoryId('Entertainment'), amount: 24.00, date: getDate(10), description: 'Cinema - Movie Tickets' },
        { id: 'demo-15', type: 'expense', categoryId: getCategoryId('Shopping'), amount: 156.00, date: getDate(12), description: 'Zara - New Clothes' },
        { id: 'demo-16', type: 'expense', categoryId: getCategoryId('Housing'), amount: 1200.00, date: getDate(15), description: 'Monthly Rent' },
        { id: 'demo-17', type: 'expense', categoryId: getCategoryId('Bills & Utilities'), amount: 85.40, date: getDate(16), description: 'Internet & Phone Bill' },
        { id: 'demo-18', type: 'expense', categoryId: getCategoryId('Food'), amount: 52.20, date: getDate(18), description: 'Restaurant - Dinner with Friends' },
        { id: 'demo-19', type: 'expense', categoryId: getCategoryId('Healthcare'), amount: 45.00, date: getDate(20), description: 'Pharmacy - Medications' },
        { id: 'demo-20', type: 'expense', categoryId: getCategoryId('Subscriptions'), amount: 29.99, date: getDate(22), description: 'Spotify Premium' },
        
        // More expenses from previous month
        { id: 'demo-21', type: 'expense', categoryId: getCategoryId('Food'), amount: 43.60, date: getDate(30), description: 'Weekly Groceries' },
        { id: 'demo-22', type: 'expense', categoryId: getCategoryId('Transport'), amount: 45.00, date: getDate(32), description: 'Gas Station - Fuel' },
        { id: 'demo-23', type: 'expense', categoryId: getCategoryId('Shopping'), amount: 234.90, date: getDate(35), description: 'IKEA - Home Decor' },
        { id: 'demo-24', type: 'expense', categoryId: getCategoryId('Entertainment'), amount: 68.50, date: getDate(38), description: 'Concert Tickets' },
        { id: 'demo-25', type: 'expense', categoryId: getCategoryId('Food'), amount: 38.75, date: getDate(40), description: 'Restaurant - Birthday Dinner' },
        { id: 'demo-26', type: 'expense', categoryId: getCategoryId('Bills & Utilities'), amount: 125.60, date: getDate(45), description: 'Electricity Bill' },
        { id: 'demo-27', type: 'expense', categoryId: getCategoryId('Housing'), amount: 1200.00, date: getDate(46), description: 'Monthly Rent' },
        { id: 'demo-28', type: 'expense', categoryId: getCategoryId('Shopping'), amount: 89.99, date: getDate(50), description: 'Nike - Running Shoes' },
      ];

      demoTransactions.forEach(tx => this.store.addTransaction(tx));

      // Demo Goals
      const demoGoals: FinancialGoal[] = [
        {
          id: 'goal-1',
          title: 'Emergency Fund',
          description: 'Save 6 months of expenses',
          targetAmount: 15000,
          currentAmount: 8500,
          type: 'savings',
          createdAt: getDate(180),
          deadline: getDate(-120),
          icon: 'PiggyBank',
          color: '#34C759'
        },
        {
          id: 'goal-2',
          title: 'Vacation to Japan',
          description: 'Trip planned for summer',
          targetAmount: 3500,
          currentAmount: 2100,
          type: 'savings',
          createdAt: getDate(200),
          deadline: getDate(-90),
          icon: 'Plane',
          color: '#6366f1'
        }
      ];

      demoGoals.forEach(goal => this.store.addGoal(goal));

      // Demo Reminders
      const demoReminders: Reminder[] = [
        {
          id: 'rem-1',
          title: 'Pay Credit Card Bill',
          description: 'Due date approaching',
          date: getDate(-3),
          priority: 'high',
          type: 'bill',
          isCompleted: false
        },
        {
          id: 'rem-2',
          title: 'Review Monthly Budget',
          description: 'Check spending vs budget',
          date: getDate(-5),
          priority: 'medium',
          type: 'budget',
          isCompleted: false
        }
      ];

      demoReminders.forEach(rem => this.store.addReminder(rem));

      // Mark as demo mode
      this.setDemoMode(true);
      
      // Mark first visit as done (so it won't auto-load again)
      this.markFirstVisitDone();

      // Show toast only if requested
      if (showToast) {
        this.toastService.info('Demo data loaded. You can add your own data anytime.', 'Demo Mode');
      }
    }, 100);
  }

  /**
   * Reset to demo data
   */
  resetToDemo(): void {
    this.loadDemoData(true);
  }

  /**
   * Clear demo mode (when user adds real data)
   */
  clearDemoMode(): void {
    this.setDemoMode(false);
  }
}
