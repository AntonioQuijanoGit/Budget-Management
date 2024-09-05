import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
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
  cantidad: number;
  cantidadIncorrecta: boolean;

  constructor(
    private _presupuestoService: PresupuestoService,
    private router: Router
  ) {
    this.cantidad = 0;
    this.cantidadIncorrecta = false;
  }

  ngOnInit(): void {}

  agregar() {
    if (this.cantidad > 0) {
      this.cantidadIncorrecta = false;
      this._presupuestoService.presupuesto = this.cantidad;
      this._presupuestoService.restante = this.cantidad;
      this.router.navigate(['/gastos']);
    } else {
      this.cantidadIncorrecta = true;
    }
  }
}
