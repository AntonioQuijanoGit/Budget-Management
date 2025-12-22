import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PresupuestoService } from '../../services/presupuesto.service';
import { Router } from '@angular/router';
import { CardComponent } from '../ui/card/card.component';
import { InputComponent } from '../ui/input/input.component';
import { ButtonComponent } from '../ui/button/button.component';

@Component({
  selector: 'app-ingresar-presupuesto',
  standalone: true,
  imports: [FormsModule, CommonModule, CardComponent, InputComponent, ButtonComponent],
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
    const inputValue = typeof this.cantidad === 'number'
      ? this.cantidad
      : parseFloat(String(this.cantidad));

    if (inputValue && inputValue > 0 && !isNaN(inputValue)) {
      this.cantidad = inputValue;
      this.isSubmitting.set(true);
      this.cantidadIncorrecta.set(false);

      setTimeout(() => {
        this._presupuestoService.presupuesto = inputValue;
        this._presupuestoService.restante = inputValue;
        this.router.navigate(['/gastos']);
      }, 200);
      return;
    }

    this.cantidadIncorrecta.set(true);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.agregar();
    }
  }
}
