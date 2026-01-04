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
import { Transaction } from '../../core/models/finance.models';
import { trendByMonth } from '../../utils/calculations';

@Component({
  selector: 'app-trend-chart',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="card trend-card">
    <header class="card-header">
      <div>
        <p class="eyebrow">Trend</p>
        <h3 class="title">Monthly Evolution</h3>
      </div>
    </header>
    <div class="chart-container">
      <canvas #canvas aria-label="Monthly evolution chart"></canvas>
    </div>
  </div>`,
  styleUrl: './charts.css',
})
export class TrendChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() transactions: Transaction[] = [];
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  chart?: Chart;
  private palette = {
    success: this.getVar('--color-success', '#34c759'),
    danger: this.getVar('--color-error', '#ff3b30'),
    text: this.getVar('--color-text-primary', '#1d1d1f'),
    textMuted: this.getVar('--color-text-secondary', '#6e6e73'),
    border: this.getVar('--color-border', 'rgba(0,0,0,0.1)'),
  };

  ngAfterViewInit() {
    this.buildChart();
  }

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  private buildChart() {
    if (!this.canvas) return;
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;
    const trend = trendByMonth(this.transactions);
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: trend.map(t => this.formatMonthLabel(t.month)),
        datasets: [
          {
            label: 'Income',
            data: trend.map(t => t.income),
            borderColor: this.palette.success,
            backgroundColor: withAlpha(this.palette.success, 0.08),
            borderWidth: 2,
            fill: true,
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointBackgroundColor: this.palette.success,
            pointBorderColor: this.getVar('--color-bg-primary', '#ffffff'),
            pointBorderWidth: 2,
            pointHoverBackgroundColor: this.palette.success,
            pointHoverBorderColor: this.getVar('--color-bg-primary', '#ffffff'),
            pointHoverBorderWidth: 3,
            pointHitRadius: 8,
          },
          {
            label: 'Expenses',
            data: trend.map(t => t.expense),
            borderColor: this.palette.danger,
            backgroundColor: withAlpha(this.palette.danger, 0.08),
            borderWidth: 2,
            fill: true,
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointBackgroundColor: this.palette.danger,
            pointBorderColor: this.getVar('--color-bg-primary', '#ffffff'),
            pointBorderWidth: 2,
            pointHoverBackgroundColor: this.palette.danger,
            pointHoverBorderColor: this.getVar('--color-bg-primary', '#ffffff'),
            pointHoverBorderWidth: 3,
            pointHitRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              color: this.palette.textMuted,
              font: {
                family: this.getVar('--font-family', 'system-ui, -apple-system, sans-serif'),
                size: 12,
                weight: 500,
              },
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 6,
              boxHeight: 6,
            },
          },
          tooltip: {
            backgroundColor: this.getVar('--color-bg-primary', '#ffffff'),
            titleColor: this.palette.text,
            bodyColor: this.palette.text,
            borderColor: this.palette.border,
            borderWidth: 1,
            padding: 12,
            titleFont: {
              family: this.getVar('--font-family', 'system-ui, -apple-system, sans-serif'),
              size: 11,
              weight: 600,
            },
            bodyFont: {
              family: this.getVar('--font-family', 'system-ui, -apple-system, sans-serif'),
              size: 12,
              weight: 500,
            },
            cornerRadius: 8,
            displayColors: true,
            boxPadding: 6,
            callbacks: {
              label: (context) => {
                const value = context.parsed.y;
                if (value === null || value === undefined) {
                  return `${context.dataset.label}: €0`;
                }
                return `${context.dataset.label}: ${this.formatCurrency(value)}`;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: this.palette.textMuted,
              font: {
                family: this.getVar('--font-family', 'system-ui, -apple-system, sans-serif'),
                size: 11,
                weight: 400,
              },
              padding: 10,
            },
            grid: {
              color: this.palette.border,
              lineWidth: 1,
              drawOnChartArea: true,
            },
            border: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: this.palette.textMuted,
              font: {
                family: this.getVar('--font-family', 'system-ui, -apple-system, sans-serif'),
                size: 11,
                weight: 400,
              },
              padding: 12,
              callback: (value) => {
                return this.formatCurrencyShort(value as number);
              },
            },
            grid: {
              color: this.palette.border,
              lineWidth: 1,
              drawOnChartArea: true,
            },
            border: {
              display: false,
            },
          },
        },
      },
    });
  }

  private updateChart() {
    if (!this.chart) return;
    const trend = trendByMonth(this.transactions);
    this.chart.data.labels = trend.map(t => this.formatMonthLabel(t.month));
    this.chart.data.datasets[0].data = trend.map(t => t.income);
    this.chart.data.datasets[1].data = trend.map(t => t.expense);
    this.chart.update();
  }

  private getVar(name: string, fallback: string) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  private formatMonthLabel(month: string): string {
    // Formato: "2024-01" -> "Jan 2024" o "Jan"
    const [year, monthNum] = month.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(monthNum, 10) - 1;
    return monthNames[monthIndex] || month;
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  private formatCurrencyShort(value: number): string {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `€${(value / 1000).toFixed(1)}k`;
    }
    return `€${Math.round(value)}`;
  }
}

function colorMix(color: string, alpha: number) {
  return `color-mix(in srgb, ${color} ${alpha * 100}%, transparent)`;
}

function withAlpha(color: string, alpha: number) {
  const hex = color.replace('#', '');
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return colorMix(color, alpha);
}

