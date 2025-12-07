import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PresupuestoService {
  presupuesto: number;
  restante: number;
  private gastos$ = new Subject<any>();

  constructor() {
    this.presupuesto = 0;
    this.restante = 0;
  }

  agregarGasto(gasto: any) {
    if (!gasto || !gasto.nombre || !gasto.cantidad) {
      console.error('Gasto inválido:', gasto);
      return;
    }
    
    // Actualizar el restante
    this.restante = this.restante - gasto.cantidad;
    
    // Emitir el gasto a través del Subject
    this.gastos$.next(gasto);
  }

  getGastos(): Observable<any> {
    return this.gastos$.asObservable();
  }
}
