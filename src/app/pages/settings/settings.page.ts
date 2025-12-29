import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../components/ui/card/card.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { ToastService } from '../../services/toast.service';
import { TransactionsService } from '../../services/transactions.service';
import { CategoriesService } from '../../services/categories.service';
import { ConfigService } from '../../services/config.service';
import { ThemeService } from '../../services/theme.service';
import { Transaction } from '../../core/models/finance.models';
import { firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-settings-page',
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.css',
  imports: [CommonModule, FormsModule, CardComponent, ButtonComponent],
})
export class SettingsPage implements OnInit {
  private toastService = inject(ToastService);
  private txService = inject(TransactionsService);
  private catService = inject(CategoriesService);
  private configService = inject(ConfigService);
  themeService = inject(ThemeService);

  currency = 'EUR';
  locale = 'es-ES';
  theme: 'dark' | 'light' = 'dark';

  constructor() {
    // Watch theme changes with effect
    effect(() => {
      this.theme = this.themeService.theme();
    });
  }

  ngOnInit() {
    this.currency = this.configService.currency;
    this.locale = this.configService.locale;
    this.theme = this.themeService.theme();
    
    // Subscribe to config changes
    this.configService.config.subscribe(config => {
      this.currency = config.currency;
      this.locale = config.locale;
    });
  }

  onCurrencyChange() {
    this.configService.currency = this.currency;
    this.toastService.success(`Currency changed to ${this.currency}`, 'Settings Updated');
  }

  onLocaleChange() {
    this.configService.locale = this.locale;
    this.toastService.success(`Locale changed to ${this.locale}`, 'Settings Updated');
  }

  onThemeChange() {
    this.themeService.setTheme(this.theme);
    this.toastService.success(`Theme changed to ${this.theme}`, 'Settings Updated');
  }

  async exportData() {
    try {
      const txs = await firstValueFrom(this.txService.transactions$);
      const csv = this.convertToCSV(txs);
      this.downloadFile(csv, 'transactions.csv', 'text/csv');
      this.toastService.success('Data exported successfully', 'Export successful');
    } catch (error) {
      this.toastService.error('Error exporting data', 'Error');
    }
  }

  async exportJSON() {
    try {
      const txs = await firstValueFrom(this.txService.transactions$);
      const json = JSON.stringify(txs, null, 2);
      this.downloadFile(json, 'transactions.json', 'application/json');
      this.toastService.success('Data exported as JSON', 'Export successful');
    } catch (error) {
      this.toastService.error('Error exporting data', 'Error');
    }
  }

  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event: any) => {
          try {
            const data = JSON.parse(event.target.result);
            
            // Validar estructura básica
            if (!Array.isArray(data)) {
              this.toastService.error('The file must contain an array of transactions', 'Error');
              return;
            }

            // Validar que cada item tenga campos requeridos
            const requiredFields = ['id', 'type', 'categoryId', 'amount', 'date', 'description'];
            const invalidItems = data.filter((item: any) => 
              !requiredFields.every(field => item.hasOwnProperty(field))
            );

            if (invalidItems.length > 0) {
              this.toastService.error(`${invalidItems.length} transactions have invalid fields`, 'Error');
              return;
            }

            // Importar transacciones
            for (const tx of data) {
              // Validar que no exista ya
              const existing = await firstValueFrom(this.txService.transactions$);
              if (!existing.find(t => t.id === tx.id)) {
                this.txService.add(tx as Transaction);
              }
            }

            this.toastService.success(`${data.length} transactions imported successfully`, 'Import successful');
          } catch (error) {
            console.error('Error importing data:', error);
            this.toastService.error('Error importing file. Please verify the JSON format.', 'Error');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  clearAllData() {
    if (confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      localStorage.clear();
      this.toastService.warning('All data has been deleted', 'Data Deleted');
      setTimeout(() => window.location.reload(), 1000);
    }
  }

  private convertToCSV(data: any[]): string {
    if (!data.length) return '';
    const headers = Object.keys(data[0]);
    const rows = data.map((row) => headers.map((h) => JSON.stringify(row[h] || '')).join(','));
    return [headers.join(','), ...rows].join('\n');
  }

  private downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  openGitHub() {
    window.open('https://github.com/AntonioQuijanoGit/Budget-Management', '_blank', 'noopener,noreferrer');
  }
}

