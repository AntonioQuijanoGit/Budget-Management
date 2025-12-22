import { Component, OnDestroy, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { PresupuestoService } from '../../../services/presupuesto.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { formatCurrency } from '../../../utils/currency';

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
    // Inicializar la suscripción a gastos (ahora retorna array)
    this.subscription = this._presupuestoService.getGastos().subscribe((gastosArray) => {
      if (Array.isArray(gastosArray)) {
        // Actualizar lista completa
        this.listGastos.set(gastosArray);
        
        // Sincronizar valores del servicio
        this.restante.set(this._presupuestoService.restante);
        this.presupuesto.set(this._presupuestoService.presupuesto);
        
        // Forzar detección de cambios
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit(): void {
    // Cargar valores iniciales
    this.presupuesto.set(this._presupuestoService.presupuesto);
    this.restante.set(this._presupuestoService.restante);
    
    // Cargar gastos iniciales - la suscripción en constructor ya maneja esto
    // pero necesitamos el valor inicial
    this._presupuestoService.getGastos().subscribe(gastos => {
      if (Array.isArray(gastos)) {
        this.listGastos.set(gastos);
      }
      this.cdr.detectChanges();
    });
    
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
    // Usa formatCurrency que lee configuración de ConfigService desde localStorage
    return formatCurrency(cantidad);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
