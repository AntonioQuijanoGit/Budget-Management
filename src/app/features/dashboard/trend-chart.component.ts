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
  template: `<div class="card">
    <header class="card-header">
      <div>
        <p class="eyebrow">Tendencia</p>
        <h3 class="title">Evolución mensual</h3>
      </div>
    </header>
    <canvas #canvas aria-label="Gráfico de evolución mensual"></canvas>
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
        labels: trend.map(t => t.month),
        datasets: [
          {
            label: 'Ingresos',
            data: trend.map(t => t.income),
            borderColor: this.palette.success,
            backgroundColor: withAlpha(this.palette.success, 0.16),
            tension: 0.3,
          },
          {
            label: 'Expenses',
            data: trend.map(t => t.expense),
            borderColor: this.palette.danger,
            backgroundColor: withAlpha(this.palette.danger, 0.18),
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom', labels: { color: this.palette.textMuted } } },
        scales: {
          x: { ticks: { color: this.palette.textMuted }, grid: { color: this.palette.border } },
          y: { ticks: { color: this.palette.textMuted }, grid: { color: this.palette.border } },
        },
      },
    });
  }

  private updateChart() {
    if (!this.chart) return;
    const trend = trendByMonth(this.transactions);
    this.chart.data.labels = trend.map(t => t.month);
    this.chart.data.datasets[0].data = trend.map(t => t.income);
    this.chart.data.datasets[1].data = trend.map(t => t.expense);
    this.chart.update();
  }

  private getVar(name: string, fallback: string) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
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

