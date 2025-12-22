import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TransactionsService } from './transactions.service';
import { CategoriesService } from './categories.service';
import { Transaction } from '../core/models/finance.models';
import { todayIso } from '../utils/date';

const STORAGE_KEY_PRESUPUESTO = 'bm_presupuesto_v1';
const STORAGE_KEY_GASTOS = 'bm_gastos_legacy_v1';

@Injectable({
  providedIn: 'root',
})
export class PresupuestoService {
  private txService = inject(TransactionsService);
  private catService = inject(CategoriesService);
  
  private presupuesto$ = new BehaviorSubject<number>(this.loadPresupuesto());
  private restante$ = new BehaviorSubject<number>(this.loadPresupuesto());
  private gastos$ = new BehaviorSubject<any[]>(this.loadGastos());

  get presupuesto(): number {
    return this.presupuesto$.value;
  }

  set presupuesto(value: number) {
    this.presupuesto$.next(value);
    this.restante$.next(value);
    this.savePresupuesto(value);
  }

  get restante(): number {
    return this.restante$.value;
  }

  set restante(value: number) {
    this.restante$.next(value);
  }

  constructor() {
    // Calcular restante inicial basado en gastos existentes
    const gastos = this.gastos$.value;
    const totalGastado = gastos.reduce((sum, g) => sum + (g.cantidad || 0), 0);
    const presupuestoInicial = this.presupuesto$.value;
    this.restante$.next(Math.max(0, presupuestoInicial - totalGastado));
  }

  agregarGasto(gasto: any) {
    if (!gasto || !gasto.nombre || !gasto.cantidad) {
      console.error('Gasto inválido:', gasto);
      return;
    }
    
    // Agregar a la lista de gastos legacy
    const gastosActuales = this.gastos$.value;
    const gastoConId = { ...gasto, id: crypto.randomUUID(), fecha: new Date().toISOString() };
    const nuevosGastos = [...gastosActuales, gastoConId];
    this.gastos$.next(nuevosGastos);
    this.saveGastos(nuevosGastos);
    
    // Crear transacción en el nuevo sistema
    // Usar categoría por defecto 'food' (siempre existe en las categorías por defecto)
    // Si necesitamos la lista completa, se puede obtener de forma asíncrona
    const transaction: Transaction = {
      id: gastoConId.id,
      type: 'expense',
      categoryId: 'food', // Usar categoría por defecto
      amount: gasto.cantidad,
      date: todayIso(),
      description: gasto.nombre,
      notes: 'Migrated from legacy expenses',
    };
    this.txService.add(transaction);
    
    // Actualizar el restante
    const nuevoRestante = this.restante$.value - gasto.cantidad;
    this.restante = Math.max(0, nuevoRestante);
  }

  getGastos(): Observable<any[]> {
    return this.gastos$.asObservable();
  }

  eliminarGasto(id: string) {
    const gastosActuales = this.gastos$.value;
    const gasto = gastosActuales.find(g => g.id === id);
    if (gasto) {
      const nuevosGastos = gastosActuales.filter(g => g.id !== id);
      this.gastos$.next(nuevosGastos);
      this.saveGastos(nuevosGastos);
      // Actualizar restante
      const nuevoRestante = this.restante$.value + gasto.cantidad;
      this.restante = nuevoRestante;
    }
  }

  private savePresupuesto(value: number) {
    try {
      localStorage.setItem(STORAGE_KEY_PRESUPUESTO, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving presupuesto', e);
    }
  }

  private loadPresupuesto(): number {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PRESUPUESTO);
      return raw ? JSON.parse(raw) : 0;
    } catch (e) {
      console.error('Error loading presupuesto', e);
      return 0;
    }
  }

  private saveGastos(gastos: any[]) {
    try {
      localStorage.setItem(STORAGE_KEY_GASTOS, JSON.stringify(gastos));
    } catch (e) {
      console.error('Error saving gastos', e);
    }
  }

  private loadGastos(): any[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_GASTOS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Error loading gastos', e);
      return [];
    }
  }

  reset() {
    this.presupuesto$.next(0);
    this.restante$.next(0);
    this.gastos$.next([]);
    localStorage.removeItem(STORAGE_KEY_PRESUPUESTO);
    localStorage.removeItem(STORAGE_KEY_GASTOS);
  }
}
