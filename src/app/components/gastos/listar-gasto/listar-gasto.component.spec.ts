import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ListarGastoComponent } from './listar-gasto.component';
import { PresupuestoService } from '../../../services/presupuesto.service';

describe('ListarGastoComponent', () => {
  let component: ListarGastoComponent;
  let fixture: ComponentFixture<ListarGastoComponent>;
  let presupuestoService: jasmine.SpyObj<PresupuestoService>;
  let gastosSubject: BehaviorSubject<any[]>;

  beforeEach(async () => {
    gastosSubject = new BehaviorSubject<any[]>([]);
    
    presupuestoService = jasmine.createSpyObj('PresupuestoService', ['getGastos'], {
      presupuesto: 1000,
      restante: 1000,
      getGastos: () => gastosSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [ListarGastoComponent],
      providers: [
        { provide: PresupuestoService, useValue: presupuestoService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarGastoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
