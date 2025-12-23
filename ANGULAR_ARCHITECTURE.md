# 🧠 Por Qué Funciona Así - Arquitectura Angular + Estilo

> 💡 **Para detalles específicos sobre nesting CSS y estructura de estilos**, ver [`CSS_NESTING_ARCHITECTURE.md`](./CSS_NESTING_ARCHITECTURE.md)

## 🏗️ A NIVEL DE ANGULAR (Component-based Architecture)

### 1. **Componentes Standalone** (Standalone Components)

```
src/app/
  app.component.ts          ← Componente raíz (shell de la app)
  app.routes.ts            ← Configuración de rutas
  pages/
    dashboard.page.ts      ← Página standalone
    transactions.page.ts   ← Página standalone
  components/
    ui/
      button/              ← Componente UI reutilizable
      card/                ← Componente UI reutilizable
```

**Por qué funciona:**

- Angular **standalone components** no necesitan NgModules
- Cada componente se importa directamente donde se necesita
- Menos boilerplate, más modularidad
- Fácil tree-shaking (el bundler elimina código no usado)

**Ejemplo:**

```typescript
// app.component.ts - Shell principal
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],  // ← Importa solo lo necesario
  template: `
    <aside><app-sidebar></app-sidebar></aside>
    <main><router-outlet></router-outlet></main>
  `
})

// dashboard.page.ts - Página standalone
@Component({
  standalone: true,
  imports: [CardComponent, ButtonComponent],  // ← Solo importa lo que usa
  template: `...`
})
```

### 2. **Signal-based State Management**

```typescript
// Signals (Angular 18+)
export class AppComponent {
  tutorialOpen = signal(false);  // Estado reactivo
  tutorialStep = signal(0);
  
  isLegacyRoute = computed(() => {  // Estado derivado
    return this.currentRoute() === '/legacy';
  });
}
```

**Por qué funciona:**

- **Signals**: Estado reactivo más eficiente que BehaviorSubject
- **Computed**: Calcula valores derivados automáticamente
- **Granular change detection**: Solo actualiza lo que cambió
- **Type-safe**: TypeScript infiere tipos automáticamente

### 3. **Dependency Injection (Services)**

```typescript
// Services con providedIn: 'root'
@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private tx$ = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.tx$.asObservable();  // Observable público
}
```

**Por qué funciona:**

- **Singleton**: Una sola instancia compartida en toda la app
- **Lazy loading**: Se carga solo cuando se necesita
- **Testeable**: Fácil de mockear en tests
- **Observables**: Manejo reactivo de datos asíncronos

### 4. **Routing con Guards y Resolvers**

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: 'dashboard', component: DashboardPage },
  { path: 'transactions', component: TransactionsPage },
  { path: '**', redirectTo: '/dashboard' }
];
```

**Por qué funciona:**

- **Lazy loading**: Cada ruta puede cargar su módulo on-demand
- **Guards**: Control de acceso antes de navegar
- **Resolvers**: Pre-carga datos antes de mostrar la página
- **Params/Observables**: Cambios de ruta reactivos

---

## 🎨 A NIVEL DE ESTILO (Vercel Design System)

### 1. **Sistema de Colores con Variables CSS**

```css
/* design-tokens.css */
:root {
  /* Base radius unificado */
  --radius: 0.5rem;  /* 8px - base unified radius */
  
  /* Dark theme (default) */
  --background: #000000;
  --foreground: #fafafa;
  --primary: #ffffff;
  --destructive: #ff4444;
  --border: rgba(255, 255, 255, 0.1);
}

:root.light {
  --background: #ffffff;
  --foreground: #0a0a0a;
  /* ... */
}
```

**Por qué funciona:**

- **Consistencia**: Todos los componentes usan las mismas variables
- **Temas**: Cambias `.dark` a `.light` en `<html>` y todo se adapta
- **Mantenibilidad**: Cambias un color en un lugar, se actualiza todo
- **Performance**: CSS variables son nativas del navegador (muy rápidas)

### 2. **Border Radius Unificado**

```css
:root {
  --radius: 0.5rem;  /* 8px - base */
  
  --radius-sm: calc(var(--radius) * 1);      /* 8px */
  --radius-md: calc(var(--radius) * 1.5);    /* 12px */
  --radius-lg: calc(var(--radius) * 2);      /* 16px */
  --radius-xl: calc(var(--radius) * 2.5);    /* 20px */
}
```

**Por qué funciona:**

- **Un solo valor base**: Todos los bordes redondeados son múltiplos de `--radius`
- **Escalable**: Cambias `--radius` y todo se ajusta proporcionalmente
- **Brand identity**: Se ve más profesional y cohesivo
- **Consistencia visual**: Mismo ratio en toda la app

### 3. **Spacing System (Múltiplos de 4px)**

```css
:root {
  --space-1: 4px;    /* 1x */
  --space-2: 8px;    /* 2x */
  --space-3: 12px;   /* 3x */
  --space-4: 16px;   /* 4x */
  --space-6: 24px;   /* 6x */
  --space-8: 32px;   /* 8x */
}
```

**Por qué funciona:**

- **4px base**: Todo es múltiplo de 4 (4, 8, 12, 16, 20, 24...)
- **Visual harmony**: Espaciado consistente en toda la app
- **Escalable**: Fácil mantener proporciones
- **Responsive**: Funciona bien en todos los tamaños de pantalla

### 4. **Component-based CSS (View Encapsulation)**

```typescript
@Component({
  selector: 'ui-button',
  styleUrls: ['./button.component.css'],  // ← CSS scoped al componente
  template: `<button class="btn">...</button>`
})
```

**Por qué funciona:**

- **Encapsulación**: Los estilos no se filtran a otros componentes
- **Scoped CSS**: Cada componente tiene su propio namespace
- **Reusabilidad**: Puedes usar las mismas clases en diferentes componentes
- **Mantenibilidad**: CSS junto al componente (colocation)

### 5. **Global Styles + Component Styles**

```
src/
  styles/
    design-tokens.css    ← Variables globales (CSS Variables)
    page-base.css        ← Utilidades globales (.page, .page-header)
    styles.css           ← Resets y estilos base
  app/
    components/
      button/
        button.component.css  ← Estilos específicos del botón
```

**Por qué funciona:**

- **Design tokens**: Variables compartidas en `design-tokens.css`
- **Utilidades globales**: Clases reutilizables en `page-base.css`
- **Estilos específicos**: Cada componente tiene su propio CSS
- **Cascada controlada**: Angular maneja la especificidad automáticamente

---

## 🔄 Flujo Completo: Cómo Funciona Todo Juntos

### 1. **Usuario entra a `/dashboard`**

```
1. Angular Router busca: routes['/dashboard']
2. Encuentra: { path: 'dashboard', component: DashboardPage }
3. Carga DashboardPage (si es lazy, carga el módulo)
4. Renderiza el template con los estilos del componente
5. Aplica estilos globales de styles.css
6. Usa variables CSS de design-tokens.css
7. Reactividad: Signals actualizan la vista cuando cambian
```

### 2. **Usuario hace clic en botón "Add Transaction"**

```typescript
// Client-side interactivity
@Component({
  template: `
    <ui-button (click)="openModal()">Add Transaction</ui-button>
    <ui-modal [open]="modalOpen()">
      <transaction-form (submit)="handleSubmit($event)"></transaction-form>
    </ui-modal>
  `
})
export class TransactionsPage {
  modalOpen = signal(false);
  
  openModal() {
    this.modalOpen.set(true);  // Signal update
  }
  
  handleSubmit(data: Transaction) {
    this.transactionsService.add(data);  // Service update
    this.modalOpen.set(false);
  }
}
```

**Por qué funciona:**

- **Signal update**: `modalOpen.set(true)` dispara change detection
- **Service**: Centraliza la lógica de negocio
- **Event binding**: `(click)` y `(submit)` manejan eventos
- **Re-render**: Angular actualiza solo el DOM que cambió

### 3. **El servicio actualiza el estado**

```typescript
@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private tx$ = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.tx$.asObservable();
  
  add(transaction: Transaction) {
    const current = this.tx$.value;
    this.tx$.next([...current, transaction]);  // Inmutable update
    this.persist();  // Guarda en localStorage
  }
}
```

**Por qué funciona:**

- **Inmutable updates**: `[...current, transaction]` crea nuevo array
- **Reactive streams**: Los componentes suscritos a `transactions$` se actualizan
- **Persistence**: `localStorage` guarda los datos entre sesiones
- **Single source of truth**: Un solo lugar maneja el estado

---

## 🎯 Principios Clave

### 1. **Component-based Architecture**

- Componentes pequeños y reutilizables
- Separación de concerns (lógica, template, estilos)
- Composición sobre herencia

### 2. **CSS Variables para Temas**

- Un solo lugar para cambiar colores (`design-tokens.css`)
- Cambio de tema sin recompilar (clase `.dark`/`.light`)
- Compatibilidad hacia atrás (aliases para código legacy)

### 3. **Signals para Reactividad**

- Estado reactivo más eficiente que RxJS (cuando aplica)
- Computed values automáticos
- Granular change detection

### 4. **Services para Lógica de Negocio**

- Separación entre presentación (componentes) y lógica (services)
- Singleton pattern (una instancia compartida)
- Observable streams para datos asíncronos

### 5. **Consistencia Visual**

- Mismo spacing, mismo radius, mismos colores
- Design tokens centralizados
- Sistema de componentes UI reutilizable

---

## 🚀 Ventajas de Esta Arquitectura

✅ **Performance**: Change detection granular + lazy loading
✅ **Mantenibilidad**: CSS Variables = fácil cambiar temas
✅ **Escalabilidad**: Componentes standalone = fácil agregar features
✅ **Consistencia**: Design tokens = componentes uniformes
✅ **Developer Experience**: TypeScript + Angular CLI = autocomplete y type safety
✅ **Testeabilidad**: Services y componentes fáciles de testear
✅ **Reusabilidad**: Componentes UI pueden usarse en cualquier parte

---

## 📦 Estructura de Archivos

```
src/
├── app/
│   ├── app.component.ts          # Shell principal (sidebar + router-outlet)
│   ├── app.routes.ts             # Configuración de rutas
│   ├── components/
│   │   ├── ui/                   # Componentes UI reutilizables
│   │   │   ├── button/
│   │   │   ├── card/
│   │   │   └── modal/
│   │   └── features/             # Componentes de features
│   ├── pages/                    # Páginas (rutas principales)
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   └── settings/
│   ├── services/                 # Lógica de negocio
│   │   ├── transactions.service.ts
│   │   └── categories.service.ts
│   └── core/
│       └── models/               # Interfaces y tipos
├── styles/
│   ├── design-tokens.css         # Variables CSS (colores, spacing, etc.)
│   ├── page-base.css             # Utilidades globales (.page, .page-header)
│   └── styles.css                # Resets y estilos base
└── index.html                    # HTML root (tiene class="dark" para tema)
```

---

## 🔧 Cambiar de Tema

### Actualmente (Dark por defecto)

```html
<!-- index.html -->
<html lang="en" class="dark">
```

### Para Light theme

```html
<!-- index.html -->
<html lang="en" class="light">
```

### Implementación futura (toggle dinámico)

```typescript
// theme.service.ts (futuro)
@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = signal<'dark' | 'light'>('dark');
  
  toggle() {
    const newTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem('theme', newTheme);
  }
}
```

---

## 🎨 Uso de Variables CSS

### En Component Styles

```css
/* button.component.css */
.btn {
  background: var(--primary);
  color: var(--primary-foreground);
  border-radius: var(--radius);
  padding: var(--space-3) var(--space-4);
}
```

### En Templates (Inline Styles)

```html
<!-- No recomendado, pero posible -->
<div [style.background-color]="'var(--background)'">
  Content
</div>
```

### En TypeScript (Style Binding)

```typescript
@Component({
  template: `
    <div [style.border-radius]="'var(--radius)'">
      Content
    </div>
  `
})
```

---

## 📝 Mejores Prácticas

1. **Usa design tokens**: Siempre usa variables CSS, nunca valores hardcodeados
2. **Componentes pequeños**: Un componente = una responsabilidad
3. **Services para lógica**: Los componentes solo manejan presentación
4. **Signals para estado local**: Usa `signal()` en lugar de propiedades simples cuando necesitas reactividad
5. **Observables para streams**: Usa RxJS para datos asíncronos o compartidos
6. **CSS scoped**: Cada componente tiene su propio CSS file
7. **Type safety**: Usa interfaces TypeScript para todos los datos

---

**En resumen:** Angular Standalone + CSS Variables + Design Tokens + Signals = Arquitectura moderna, escalable y fácil de mantener. 🚀

