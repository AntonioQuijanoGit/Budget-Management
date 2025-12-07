import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PresupuestoService } from '../../services/presupuesto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ingresar-presupuesto',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ingresar-presupuesto.component.html',
  styleUrl: './ingresar-presupuesto.component.css',
})
export class IngresarPresupuestoComponent implements OnInit {
  cantidad: number | string = '';
  cantidadIncorrecta = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  constructor(
    private _presupuestoService: PresupuestoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Reset if navigating back
    if (this._presupuestoService.presupuesto > 0) {
      this.cantidad = this._presupuestoService.presupuesto;
    }
  }

  onInputChange(value: any): void {
    // Convert to number
    const numValue = parseFloat(value) || 0;
    this.cantidad = numValue;
    
    if (this.cantidadIncorrecta() && numValue > 0) {
      this.cantidadIncorrecta.set(false);
    }
  }

  agregar(): void {
    // Get the value directly from the input element to be sure
    const input = document.querySelector('#presupuesto-input') as HTMLInputElement;
    const inputValue = input ? parseFloat(input.value) : parseFloat(String(this.cantidad));
    
    if (inputValue && inputValue > 0 && !isNaN(inputValue)) {
      this.cantidad = inputValue;
      this.isSubmitting.set(true);
      this.cantidadIncorrecta.set(false);
      
      // Small delay for better UX feedback
      setTimeout(() => {
        this._presupuestoService.presupuesto = inputValue;
        this._presupuestoService.restante = inputValue;
        this.router.navigate(['/gastos']);
      }, 200);
    } else {
      this.cantidadIncorrecta.set(true);
      // Focus back on input for accessibility
      if (input) {
        input.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.agregar();
    }
  }
}
