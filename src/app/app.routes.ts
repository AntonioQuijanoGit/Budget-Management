import { RouterModule, Routes } from '@angular/router';
import { IngresarPresupuestoComponent } from './components/ingresar-presupuesto/ingresar-presupuesto.component';
import { GastosComponent } from './components/gastos/gastos.component';
import { NgModule } from '@angular/core';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { WelcomePage } from './pages/welcome/welcome.page';
import { TransactionsPage } from './pages/transactions/transactions.page';
import { CategoriesPage } from './pages/categories/categories.page';
import { BudgetsPage } from './pages/budgets/budgets.page';
import { StatisticsPage } from './pages/statistics/statistics.page';
import { SettingsPage } from './pages/settings/settings.page';
import { HistoryPage } from './pages/history/history.page';
import { GoalsPage } from './pages/goals/goals.page';
import { RecurringPage } from './pages/recurring/recurring.page';
import { RemindersPage } from './pages/reminders/reminders.page';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'welcome', component: WelcomePage },
  { path: 'dashboard', component: DashboardPage },
  { path: 'transactions', component: TransactionsPage },
  { path: 'categories', component: CategoriesPage },
  { path: 'budgets', component: BudgetsPage },
  { path: 'goals', component: GoalsPage },
  { path: 'recurring', component: RecurringPage },
  { path: 'reminders', component: RemindersPage },
  { path: 'statistics', component: StatisticsPage },
  { path: 'settings', component: SettingsPage },
  { path: 'history', component: HistoryPage },
  // Legacy routes preserved
  { path: 'ingresarPresupuesto', component: IngresarPresupuestoComponent },
  { path: 'gastos', component: GastosComponent },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
