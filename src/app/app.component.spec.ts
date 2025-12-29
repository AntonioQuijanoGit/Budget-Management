import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';
import { ThemeService } from './services/theme.service';
import { AutoRecurringService } from './services/auto-recurring.service';
import { ReminderCheckerService } from './services/reminder-checker.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            events: { pipe: () => ({ subscribe: () => {} }) },
            navigate: () => Promise.resolve(true)
          }
        },
        {
          provide: ThemeService,
          useValue: {
            theme: () => 'light',
            setTheme: () => {}
          }
        },
        {
          provide: AutoRecurringService,
          useValue: {
            initialize: () => {}
          }
        },
        {
          provide: ReminderCheckerService,
          useValue: {
            initialize: () => {}
          }
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'presupuesto' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('presupuesto');
  });
});
