import { Component, OnDestroy, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { PresupuestoService } from '../../../services/presupuesto.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

interface Gasto {
  nombre: string;
  cantidad: number;
}

@Component({
  selector: 'app-listar-gasto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-gasto.component.html',
  styleUrl: './listar-gasto.component.css',
})
export class ListarGastoComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  presupuesto = signal<number>(0);
  restante = signal<number>(0);
  listGastos = signal<Gasto[]>([]);

  // Computed values
  porcentajeUsado = computed(() => {
    const presup = this.presupuesto();
    if (presup === 0) return 0;
    return ((presup - this.restante()) / presup) * 100;
  });

  porcentajeRestante = computed(() => {
    const presup = this.presupuesto();
    if (presup === 0) return 0;
    return (this.restante() / presup) * 100;
  });

  estadoPresupuesto = computed(() => {
    const rest = this.restante();
    const presup = this.presupuesto();
    
    if (presup === 0) return 'neutral';
    if (rest <= presup / 4) return 'danger';
    if (rest <= presup / 2) return 'warning';
    return 'success';
  });

  totalGastado = computed(() => {
    return this.listGastos().reduce((sum, gasto) => sum + gasto.cantidad, 0);
  });

  constructor(
    private _presupuestoService: PresupuestoService,
    private cdr: ChangeDetectorRef
  ) {
    // Inicializar la suscripción
    this.subscription = this._presupuestoService.getGastos().subscribe((data) => {
      if (data && data.nombre && data.cantidad) {
        // Agregar el nuevo gasto al principio de la lista
        this.listGastos.update(gastos => [data, ...gastos]);
        
        // Sincronizar valores del servicio
        this.restante.set(this._presupuestoService.restante);
        this.presupuesto.set(this._presupuestoService.presupuesto);
        
        // Forzar detección de cambios
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit(): void {
    this.presupuesto.set(this._presupuestoService.presupuesto);
    this.restante.set(this._presupuestoService.restante);
    
    // Forzar detección de cambios inicial
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getEstadoClass(): string {
    const estado = this.estadoPresupuesto();
    return `budget-status budget-status--${estado}`;
  }

  formatearMoneda(cantidad: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(cantidad);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
