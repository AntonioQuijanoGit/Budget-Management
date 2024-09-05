import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PresupuestoService } from '../../../services/presupuesto.service';

@Component({
  selector: 'app-ingresar-gasto',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ingresar-gasto.component.html',
  styleUrl: './ingresar-gasto.component.css',
})
export class IngresarGastoComponent implements OnInit {
  nombreGasto: string;
  cantidad: number;
  formularioIncorrecto: boolean;
  textIncorrecto: string;

  constructor(private _presupuestoService: PresupuestoService) {
    this.nombreGasto = '';
    this.cantidad = 0;
    this.formularioIncorrecto = false;
    this.textIncorrecto = 'Nombre del gasto o cantidad inorrecta';
  }

  ngOnInit(): void {}

  agregarGasto() {
    if (this.cantidad > this._presupuestoService.restante) {
      this.formularioIncorrecto = true;
      this.textIncorrecto = 'Cantidad ingresada es mayor al restante';
      return;
    }

    if (this.nombreGasto === '' || this.cantidad <= 0) {
      this.formularioIncorrecto = true;
    } else {
      //Creamos el objeto
      const GASTO = {
        nombre: this.nombreGasto,
        cantidad: this.cantidad,
      };

      //Enviamos el objeto a los suscriptores via subject
      this._presupuestoService.agregarGasto(GASTO);
      //Reseteamos formulario

      this.formularioIncorrecto = false;
      this.nombreGasto = '';
      this.cantidad = 0;
    }
  }
}
