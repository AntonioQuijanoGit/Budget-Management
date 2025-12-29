import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { GastosComponent } from './gastos.component';
import { PresupuestoService } from '../../services/presupuesto.service';

describe('GastosComponent', () => {
  let component: GastosComponent;
  let fixture: ComponentFixture<GastosComponent>;
  let presupuestoService: jasmine.SpyObj<PresupuestoService>;
  let router: jasmine.SpyObj<Router>;
  let gastosSubject: BehaviorSubject<any[]>;

  beforeEach(async () => {
    gastosSubject = new BehaviorSubject<any[]>([]);
    
    presupuestoService = jasmine.createSpyObj('PresupuestoService', ['getGastos'], {
      presupuesto: 1000,
      restante: 1000,
      getGastos: () => gastosSubject.asObservable()
    });
    
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [GastosComponent],
      providers: [
        { provide: PresupuestoService, useValue: presupuestoService },
        { provide: Router, useValue: router }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
