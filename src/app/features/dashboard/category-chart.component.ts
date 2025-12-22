import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
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
})
export class CategoryChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() transactions: Transaction[] = [];
  @Input() categories: Category[] = [];
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  chart?: Chart;
  private palette = {
    text: this.getVar('--color-text-primary', '#1d1d1f'),
    textMuted: this.getVar('--color-text-secondary', '#6e6e73'),
    border: this.getVar('--color-border', 'rgba(0,0,0,0.1)'),
    surface: this.getVar('--color-bg-tertiary', '#e8e8ed'),
    primary: this.getVar('--color-primary', '#007aff'),
  };

  ngAfterViewInit() {
    // Esperar un tick para asegurar que el canvas esté disponible
    setTimeout(() => {
      this.buildChart();
    }, 100);
  }

  ngOnChanges() {
    // Si el canvas está disponible, construir o actualizar el gráfico
    if (this.canvas?.nativeElement) {
      if (this.chart) {
        this.updateChart();
      } else {
        setTimeout(() => {
          this.buildChart();
        }, 100);
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
          },
          responsive: true,
          maintainAspectRatio: true,
          color: this.palette.text,
        },
      });
    } catch (error) {
      // Silently fail - el mensaje de "no data" se mostrará
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
    
    // Actualizar los datos del gráfico existente
    try {
      this.chart.data.labels = data.map(d => d.label);
      this.chart.data.datasets[0].data = data.map(d => d.value);
      (this.chart.data.datasets[0] as any).backgroundColor = data.map(d => d.color || this.palette.primary);
      (this.chart.data.datasets[0] as any).borderColor = this.palette.surface;
      this.chart.update('active');
    } catch (error) {
      // Si hay error, reconstruir el gráfico
      this.buildChart();
    }
  }

  private getVar(name: string, fallback: string) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }
}

