# 📱 Responsive Design & 🌓 Theme System

## ✅ Responsive Design - Implementado

### Breakpoints

El sistema usa breakpoints consistentes definidos en `design-tokens.css`:

```css
--breakpoint-sm: 640px;   /* Mobile pequeño */
--breakpoint-md: 768px;   /* Mobile grande / Tablet pequeño */
--breakpoint-lg: 1024px;  /* Tablet / Desktop pequeño */
--breakpoint-xl: 1280px;  /* Desktop */
--breakpoint-2xl: 1536px; /* Desktop grande */
```

### Estrategia Mobile-First

La aplicación está diseñada con enfoque **mobile-first**:

1. **Estilos base**: Para móvil (hasta 640px)
2. **Tablet**: Media queries para 768px+
3. **Desktop**: Media queries para 1024px+

### Componentes Responsive

#### 1. **App Shell (Layout Principal)**

```css
/* Desktop: min-width 1024px */
@media (min-width: 1024px) {
  .app-shell {
    grid-template-columns: var(--sidebar-width) 1fr;
  }
  .sidebar { display: flex; }
  .bottom-nav { display: none; }
}

/* Mobile: max-width 1024px */
@media (max-width: 1024px) {
  .app-shell {
    grid-template-columns: 1fr;
  }
  .sidebar { display: none; }
  .bottom-nav { display: grid; }
}
```

#### 2. **Sidebar**

- **Desktop**: Visible, sticky, 260px de ancho
- **Mobile**: Oculto, reemplazado por bottom navigation

#### 3. **Bottom Navigation**

- **Desktop**: Oculto (sidebar visible)
- **Mobile**: Visible, fijo en la parte inferior

#### 4. **Pages**

```css
/* Base (mobile) */
.page {
  padding: var(--space-8) var(--space-6);
}

/* Tablet */
@media (max-width: 1024px) {
  .page {
    padding: var(--space-6) var(--space-4);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .page {
    padding: var(--space-5) var(--space-4);
    gap: var(--space-item); /* Gaps más pequeños */
  }
}
```

#### 5. **Grids Responsive**

```css
/* Dashboard grids */
.widgets-grid {
  grid-template-columns: 1fr; /* Mobile */
}

@media (min-width: 768px) {
  .widgets-grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet */
  }
}

@media (min-width: 1024px) {
  .widgets-grid {
    grid-template-columns: repeat(3, 1fr); /* Desktop */
  }
}
```

### Características Responsive

✅ **Sidebar se oculta en móvil**
✅ **Bottom navigation aparece en móvil**
✅ **Espaciado adaptativo** (padding y gaps más pequeños en móvil)
✅ **Grids responsivos** (1 columna móvil → 2 tablet → 3 desktop)
✅ **Tipografía fluida** (clamp() para tamaños de fuente)
✅ **Touch targets** mínimo 44x44px en móvil
✅ **Modales** optimizados para pantallas pequeñas

---

## 🌓 Theme System - Implementado

### Tema Claro y Oscuro

El sistema soporta **Dark Mode** (por defecto) y **Light Mode**.

### Cómo Funciona

#### 1. **Service de Tema**

```typescript
// src/app/services/theme.service.ts
export class ThemeService {
  theme = computed(() => this.themeSignal());
  
  setTheme(theme: 'dark' | 'light') {
    // Aplica clase al <html>
    // Persiste en localStorage
  }
  
  toggle() {
    // Alterna entre dark/light
  }
}
```

#### 2. **CSS Variables**

Los temas se implementan con CSS Variables:

```css
/* Dark theme (default) */
:root.dark {
  --background: #000000;
  --foreground: #fafafa;
  --card: #171717;
  --border: #333333;
  /* ... */
}

/* Light theme */
:root.light {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --card: #ffffff;
  --border: rgba(0, 0, 0, 0.1);
  /* ... */
}
```

#### 3. **Aplicación Automática**

- Al cargar: Lee `localStorage` o preferencia del sistema
- Al cambiar: Actualiza clase en `<html>` y persiste
- Sin refresh: Cambio instantáneo sin recargar página

### Uso

#### En Settings Page

```html
<select [(ngModel)]="theme" (ngModelChange)="onThemeChange()">
  <option value="dark">Dark</option>
  <option value="light">Light</option>
</select>
```

#### En Cualquier Componente

```typescript
export class MyComponent {
  themeService = inject(ThemeService);
  
  theme = this.themeService.theme(); // Signal reactivo
  
  toggleTheme() {
    this.themeService.toggle();
  }
}
```

### Colores por Tema

| Elemento | Dark Mode | Light Mode |
|----------|-----------|------------|
| Background | `#000000` | `#ffffff` |
| Foreground | `#fafafa` | `#0a0a0a` |
| Card | `#171717` | `#ffffff` |
| Border | `#333333` | `rgba(0,0,0,0.1)` |
| Primary | `#0070f3` | `#0070f3` (mismo) |
| Muted | `#262626` | `#f5f5f5` |

### Persistencia

- El tema se guarda en `localStorage` como `bm_theme_v1`
- Se carga automáticamente al iniciar la app
- Si no hay preferencia guardada, usa la preferencia del sistema

---

## 📐 Testing Responsive

### Breakpoints a Probar

1. **320px** - Mobile muy pequeño
2. **375px** - iPhone SE / Mobile estándar
3. **768px** - Tablet pequeño
4. **1024px** - Tablet / Desktop pequeño
5. **1280px** - Desktop estándar
6. **1920px** - Desktop grande

### Herramientas

- Chrome DevTools (F12 → Toggle Device Toolbar)
- Responsive Design Mode
- Testing real en dispositivos

---

## 🎨 Best Practices

### Responsive

1. ✅ **Mobile-first**: Escribe estilos base para móvil primero
2. ✅ **Breakpoints consistentes**: Usa los tokens definidos
3. ✅ **Espaciado adaptativo**: Reduce padding/gaps en móvil
4. ✅ **Touch targets**: Mínimo 44x44px en móvil
5. ✅ **Tipografía fluida**: Usa `clamp()` para tamaños de fuente

### Theme

1. ✅ **CSS Variables**: Usa variables, nunca colores hardcoded
2. ✅ **Service centralizado**: Usa `ThemeService` para cambiar tema
3. ✅ **Persistencia**: El servicio maneja localStorage automáticamente
4. ✅ **Sin refresh**: Los cambios son instantáneos

---

## 📚 Referencias

- **Theme Service:** `src/app/services/theme.service.ts`
- **Design Tokens:** `src/styles/design-tokens.css`
- **Responsive CSS:** `src/app/app.component.css`, `src/styles/page-base.css`

