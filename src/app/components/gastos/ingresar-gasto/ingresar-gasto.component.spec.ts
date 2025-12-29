import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { IngresarGastoComponent } from './ingresar-gasto.component';
import { PresupuestoService } from '../../../services/presupuesto.service';

describe('IngresarGastoComponent', () => {
  let component: IngresarGastoComponent;
  let fixture: ComponentFixture<IngresarGastoComponent>;
  let presupuestoService: jasmine.SpyObj<PresupuestoService>;

  beforeEach(async () => {
    const gastosSubject = new BehaviorSubject<any[]>([]);
    
    presupuestoService = jasmine.createSpyObj('PresupuestoService', ['agregarGasto', 'getGastos'], {
      restante: 1000,
      presupuesto: 1000,
      getGastos: () => gastosSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [IngresarGastoComponent],
      providers: [
        { provide: PresupuestoService, useValue: presupuestoService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngresarGastoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
