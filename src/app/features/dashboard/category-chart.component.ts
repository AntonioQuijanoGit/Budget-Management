import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  EventEmitter,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { Category, Transaction } from '../../core/models/finance.models';
import { groupExpensesByCategory } from '../../utils/calculations';

@Component({
  selector: 'app-category-chart',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="card">
    <header class="card-header">
      <div>
        <p class="eyebrow">Expenses by category</p>
        <h3 class="title">Distribution</h3>
      </div>
    </header>
    <div class="chart-container">
      <canvas #canvas aria-label="Expenses by category chart"></canvas>
      <p *ngIf="hasNoData()" class="empty-message">No expenses to display. Add transactions to see the distribution.</p>
    </div>
  </div>`,
  styleUrl: './charts.css',
  // Usar Default para asegurar detección de cambios
})
export class CategoryChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() transactions: Transaction[] = [];
  @Input() categories: Category[] = [];
  @Output() categoryClick = new EventEmitter<string>();
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  chart?: Chart;
  private palette = {
    text: this.getVar('--color-text-primary', '#1d1d1f'),
    textMuted: this.getVar('--color-text-secondary', '#6e6e73'),
    border: this.getVar('--color-border', 'rgba(0,0,0,0.1)'),
    surface: this.getVar('--color-bg-tertiary', '#e8e8ed'),
    primary: this.getVar('--color-primary', '#6366f1'),
  };
  private previousTransactionsLength = 0;
  private previousCategoriesLength = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // Esperar un tick para asegurar que el canvas esté disponible
    setTimeout(() => {
      this.buildChart();
      this.previousTransactionsLength = this.transactions.length;
      this.previousCategoriesLength = this.categories.length;
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    // Detectar cambios en transactions o categories
    const transactionsChanged = changes['transactions'] && 
      (changes['transactions'].previousValue?.length !== changes['transactions'].currentValue?.length ||
       changes['transactions'].previousValue !== changes['transactions'].currentValue);
    
    const categoriesChanged = changes['categories'] && 
      (changes['categories'].previousValue?.length !== changes['categories'].currentValue?.length ||
       changes['categories'].previousValue !== changes['categories'].currentValue);

    // También verificar cambios por longitud (más eficiente)
    const lengthChanged = this.transactions.length !== this.previousTransactionsLength ||
                         this.categories.length !== this.previousCategoriesLength;

    if (transactionsChanged || categoriesChanged || lengthChanged) {
      this.previousTransactionsLength = this.transactions.length;
      this.previousCategoriesLength = this.categories.length;
      
      // Si el canvas está disponible, construir o actualizar el gráfico
      if (this.canvas?.nativeElement) {
        // Usar requestAnimationFrame para asegurar que el DOM esté actualizado
        requestAnimationFrame(() => {
          if (this.chart) {
            this.updateChart();
          } else {
            this.buildChart();
          }
        });
      }
    }
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  hasNoData(): boolean {
    const data = groupExpensesByCategory(this.transactions, this.categories);
    return data.length === 0;
  }

  private buildChart() {
    if (!this.canvas?.nativeElement) {
      return;
    }
    
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }
    
    // Si ya existe un gráfico, destruirlo primero
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
    
    const data = groupExpensesByCategory(this.transactions || [], this.categories || []);
    
    // Si no hay datos, no crear gráfico (el mensaje se mostrará por el template)
    if (data.length === 0) {
      return;
    }
    
    try {
      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: data.map(d => d.label),
          datasets: [
            {
              data: data.map(d => d.value),
              backgroundColor: data.map(d => d.color || this.palette.primary),
              borderWidth: 1,
              borderColor: this.palette.surface,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              position: 'bottom',
              labels: { 
                color: this.palette.textMuted,
                padding: 12,
                usePointStyle: true,
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = formatCurrency(context.parsed);
                  return `${label}: ${value}`;
                }
              }
            }
          },
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const index = elements[0].index;
              const categoryLabel = data[index].label;
              const category = this.categories.find(c => c.name === categoryLabel);
              if (category) {
                this.categoryClick.emit(category.id);
              }
            }
          },
          responsive: true,
          maintainAspectRatio: true,
          color: this.palette.text,
        },
      });
    } catch (error) {
      console.error('Error building chart:', error);
    }
  }

  private updateChart() {
    if (!this.canvas?.nativeElement) return;
    
    const data = groupExpensesByCategory(this.transactions || [], this.categories || []);
    
    // Si no hay datos y existe un gráfico, destruirlo
    if (data.length === 0) {
      if (this.chart) {
        this.chart.destroy();
        this.chart = undefined;
      }
      return;
    }
    
    // Si no existe gráfico pero hay datos, construirlo
    if (!this.chart) {
      this.buildChart();
      return;
    }
    
    // Reconstruir el gráfico completamente para asegurar que se actualice correctamente
    // Esto es más confiable que actualizar solo los datos
    try {
      this.chart.destroy();
      this.chart = undefined;
      this.buildChart();
    } catch (error) {
      // Si hay error, intentar reconstruir de nuevo
      this.chart = undefined;
      setTimeout(() => this.buildChart(), 100);
    }
  }

  private getVar(name: string, fallback: string) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

