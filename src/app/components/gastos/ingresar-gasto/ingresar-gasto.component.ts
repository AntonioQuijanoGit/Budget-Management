import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PresupuestoService } from '../../../services/presupuesto.service';

interface ErrorState {
  show: boolean;
  message: string;
}

@Component({
  selector: 'app-ingresar-gasto',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ingresar-gasto.component.html',
  styleUrl: './ingresar-gasto.component.css',
})
export class IngresarGastoComponent implements OnInit {
  nombreGasto = signal<string>('');
  cantidad = signal<number>(0);
  error = signal<ErrorState>({ show: false, message: '' });
  isSubmitting = signal<boolean>(false);
  restante = signal<number>(0);
  successMessage = signal<string>('');

  get buttonText(): string {
    return this.isSubmitting() ? 'Adding...' : 'Add Expense';
  }

  constructor(private _presupuestoService: PresupuestoService) {}

  ngOnInit(): void {
    this.updateRestante();
  }

  private updateRestante(): void {
    this.restante.set(this._presupuestoService.restante);
  }

  onNombreChange(value: string): void {
    // No hacer trim mientras el usuario está escribiendo, solo al guardar
    this.nombreGasto.set(value);
    if (this.error().show && value.trim().length > 0) {
      this.error.set({ show: false, message: '' });
    }
  }

  onCantidadChange(value: any): void {
    // Manejar tanto string como number
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : (value || 0);
    this.cantidad.set(numValue);
    this.updateRestante();
    
    if (this.error().show && numValue > 0 && numValue <= this.restante()) {
      this.error.set({ show: false, message: '' });
    }
  }

  agregarGasto(): void {
    // Obtener valores directamente del input para asegurar que tenemos los datos correctos
    const nombreInput = document.querySelector('#nombre-gasto') as HTMLInputElement;
    const cantidadInput = document.querySelector('#cantidad-gasto') as HTMLInputElement;
    
    const nombre = nombreInput ? nombreInput.value.trim() : this.nombreGasto().trim();
    const cantidadStr = cantidadInput ? cantidadInput.value : String(this.cantidad());
    const cantidad = parseFloat(cantidadStr) || 0;
    const restante = this._presupuestoService.restante;

    console.log('Agregando gasto - Nombre:', nombre, 'Cantidad:', cantidad, 'Restante:', restante);

    // Validations
    if (!nombre || nombre === '') {
      this.error.set({
        show: true,
        message: 'Expense name is required',
      });
      this.focusInput('nombre');
      return;
    }

    if (!cantidad || cantidad <= 0 || isNaN(cantidad)) {
      this.error.set({
        show: true,
        message: 'Amount must be greater than zero',
      });
      this.focusInput('cantidad');
      return;
    }

    if (cantidad > restante) {
      this.error.set({
        show: true,
        message: `Amount exceeds remaining budget (${restante.toFixed(2)} EUR)`,
      });
      this.focusInput('cantidad');
      return;
    }

    // Crear y enviar gasto
    this.isSubmitting.set(true);
    const GASTO = {
      nombre: nombre,
      cantidad: cantidad,
    };

    console.log('Gasto creado:', GASTO);

    // Agregar el gasto al servicio
    try {
      this._presupuestoService.agregarGasto(GASTO);
      console.log('Gasto agregado al servicio');
      
      // Actualizar el restante inmediatamente
      this.updateRestante();

      // Mostrar mensaje de éxito
      this.successMessage.set(`"${nombre}" added successfully!`);
      
      // Resetear formulario con feedback visual
      setTimeout(() => {
        this.nombreGasto.set('');
        this.cantidad.set(0);
        if (nombreInput) nombreInput.value = '';
        if (cantidadInput) cantidadInput.value = '';
        this.error.set({ show: false, message: '' });
        this.isSubmitting.set(false);
        this.updateRestante();
        this.focusInput('nombre');
        
        // Ocultar mensaje de éxito después de 2 segundos
        setTimeout(() => {
          this.successMessage.set('');
        }, 2000);
        
        // Scroll suave a la lista de gastos para mostrar el nuevo gasto
        setTimeout(() => {
          const expenseList = document.querySelector('.expenses-list');
          if (expenseList) {
            expenseList.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
      }, 300);
    } catch (error) {
      console.error('Error al agregar gasto:', error);
      this.error.set({
        show: true,
        message: 'Error adding expense. Please try again.',
      });
      this.isSubmitting.set(false);
    }
  }

  private focusInput(type: 'nombre' | 'cantidad'): void {
    setTimeout(() => {
      const input = document.querySelector(
        `input[data-input="${type}"]`
      ) as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 100);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.agregarGasto();
    }
  }

  get restanteDisponible(): number {
    this.updateRestante();
    const restanteValue = this.restante();
    // Asegurar que siempre devolvamos un número válido
    return restanteValue >= 0 ? restanteValue : 0;
  }
}
