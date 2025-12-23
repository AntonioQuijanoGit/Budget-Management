# 🎨 Sistema de Diseño - Vercel Style

## 📋 Resumen del Estilo

**Minimalista y limpio** - Inspirado en Vercel (azul #0070f3, negro puro)  
**Moderno**: Angular + CSS Variables + Lucide Icons  
**Consistente**: Sistema de diseño unificado  
**Profesional**: Tipografía clara, espaciado generoso  
**Accesible**: Contraste adecuado, semántica correcta

---

## 🎨 Iconos

### Librería
- **Librería**: Lucide Angular (`lucide-angular`)
- **Estilo**: Minimalista, outline, consistente
- **Tamaños estándar**: 4x4, 5x5, 6x6 (16px, 20px, 24px)

### Tamaños Disponibles

```css
--icon-size-xs: 12px;   /* 3x3 - muy pequeño (tags) */
--icon-size-sm: 16px;   /* 4x4 - pequeño (acciones, inputs) */
--icon-size-md: 20px;   /* 5x5 - medio (listas, cards) */
--icon-size-lg: 24px;   /* 6x6 - grande (navegación, destacados) */
--icon-size-xl: 32px;   /* 8x8 - extra grande */
```

### Aliases Semánticos

```css
--icon-navigation: 24px;  /* Sidebar, navegación principal */
--icon-card: 20px;        /* Cards principales */
--icon-list: 20px;        /* Listas de items */
--icon-action: 16px;      /* Botones, inputs */
--icon-metadata: 14px;    /* Badges, textos pequeños */
--icon-tag: 12px;         /* Tags, elementos muy pequeños */
--icon-empty: 48px;       /* Empty states */
```

### Ejemplos de Uso

```html
<!-- Navegación -->
<lucide-icon name="Home" [size]="24"></lucide-icon>

<!-- Cards -->
<lucide-icon name="Wallet" [size]="20"></lucide-icon>

<!-- Botones/Acciones -->
<lucide-icon name="Plus" [size]="16"></lucide-icon>

<!-- Empty States -->
<lucide-icon name="FileJson" [size]="48"></lucide-icon>
```

### Iconos Comunes
- `FileJson`, `Code`, `Search`, `Sparkles`, `Network`
- `Home`, `Wallet`, `List`, `Tag`, `Target`, `Bell`, `Settings`

---

## 🔤 Fuentes

### Fuente Principal
- **Familia**: Inter (Google Fonts)
- **Pesos**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Variable CSS**: `--font-inter`
- **Fallback**: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

```css
--font-inter: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-family: var(--font-inter);
```

### Fuente Monospace
- **Familia**: Geist Mono (oficial de Vercel) / JetBrains Mono (alternativa)
- **Variable CSS**: `--font-geist-mono`
- **Uso**: Código, valores técnicos, JSON

```css
--font-geist-mono: 'JetBrains Mono', 'Geist Mono', 'Menlo', 'Monaco', 'Courier New', monospace;
--font-family-mono: var(--font-geist-mono);
```

### Antialiasing
- **Activado**: `-webkit-font-smoothing: antialiased`
- **Aplicado**: Globalmente en `styles.css`

### Tamaños de Fuente

```css
--font-size-xs: 11px;
--font-size-sm: 13px;
--font-size-base: 15px;
--font-size-lg: 17px;
--font-size-xl: 22px;
--font-size-2xl: 28px;
--font-size-3xl: 34px;
```

---

## 🎨 Paleta de Colores (Tema Oscuro por Defecto)

### Colores Base

```css
/* Fondos */
--background: #000000;        /* Background principal - negro puro */
--card: #171717;              /* Cards - gris muy oscuro */
--muted: #262626;             /* Muted - gris medio */

/* Texto */
--foreground: #fafafa;        /* Texto principal - casi blanco */
--muted-foreground: #a1a1aa;  /* Texto secundario */

/* Acciones */
--primary: #0070f3;           /* Primary - azul Vercel */
--primary-foreground: #ffffff;

/* Destructivo */
--destructive: #e00;          /* Destructive - rojo */
--destructive-foreground: #ffffff;

/* Bordes */
--border: #333333;            /* Borders - gris oscuro */
--input: #333333;
--ring: #0070f3;              /* Focus ring - azul Vercel */
```

### Esquema Completo

| Variable | Valor | Uso |
|----------|-------|-----|
| `--background` | `#000000` | Fondo principal de la app |
| `--foreground` | `#fafafa` | Texto principal |
| `--primary` | `#0070f3` | Acciones principales (botones, links) |
| `--card` | `#171717` | Fondo de cards y componentes elevados |
| `--muted` | `#262626` | Fondos sutiles, elementos deshabilitados |
| `--border` | `#333333` | Bordes de componentes |
| `--destructive` | `#e00` | Acciones destructivas (eliminar, error) |
| `--ring` | `#0070f3` | Anillo de foco en inputs y botones |

### Colores Semánticos

```css
/* Success (verde) */
--color-success: #00ff88;

/* Warning (amarillo) */
--color-warning: #ffaa00;

/* Error (rojo) - usa --destructive */
--color-error: var(--destructive);
```

---

## 📐 Espaciado y Layout

### Sistema de Espaciado (Base 4px)

```css
--space-1: 4px;    /* 1x */
--space-2: 8px;    /* 2x */
--space-3: 12px;   /* 3x */
--space-4: 16px;   /* 4x */
--space-5: 20px;   /* 5x */
--space-6: 24px;   /* 6x */
--space-8: 32px;   /* 8x */
--space-12: 48px;  /* 12x */
--space-16: 64px;  /* 16x */
```

### Espaciado Semántico

```css
--space-section: 32px;  /* Entre secciones grandes */
--space-group: 24px;    /* Entre grupos de elementos */
--space-item: 16px;     /* Entre items individuales */
```

### Padding Típico

- **Cards**: `padding: var(--space-6)` (24px)
- **Botones**: `padding: var(--space-3) var(--space-4)` (12px 16px)
- **Inputs**: `padding: var(--space-3) var(--space-4)` (12px 16px)
- **Secciones**: `padding: var(--space-8)` (32px)

### Gaps Comunes

```css
gap: var(--space-2);  /* 8px - gaps pequeños */
gap: var(--space-4);  /* 16px - gaps medianos */
gap: var(--space-6);  /* 24px - gaps grandes */
```

---

## 🔲 Border Radius

### Sistema Unificado (Base 0.5rem = 8px)

```css
--radius: 0.5rem;           /* 8px - base */

--radius-sm: 8px;           /* 0.5rem - pequeño */
--radius-md: 12px;          /* 0.75rem - medio */
--radius-lg: 16px;          /* 1rem - grande */
--radius-xl: 20px;          /* 1.25rem - extra grande */
--radius-2xl: 24px;         /* 1.5rem */
--radius-3xl: 32px;         /* 2rem */
--radius-4xl: 40px;         /* 2.5rem */
--radius-full: 9999px;      /* Circular/pill */
```

### Uso Típico

- **Botones**: `var(--radius-md)` (12px)
- **Cards**: `var(--radius-lg)` (16px)
- **Inputs**: `var(--radius-md)` (12px)
- **Modales**: `var(--radius-xl)` (20px)
- **Badges (pill)**: `var(--radius-full)`

---

## 🎭 Componentes UI

### Estilo Base
- **Inspiración**: shadcn/ui "new-york" style
- **Base**: Componentes custom Angular (no shadcn directamente)
- **Patrón**: CSS Variables + View Encapsulation

### Componentes Disponibles

- `ui-button` - Botones con variantes (primary, secondary, ghost, destructive)
- `ui-card` - Cards con header, body, footer
- `ui-input` - Inputs de texto con validación
- `ui-badge` - Badges con variantes
- `ui-modal` - Modales/dialogs
- `ui-toast` - Notificaciones toast
- `ui-search` - Barra de búsqueda
- `ui-empty-state` - Estados vacíos

### Ejemplo de Uso

```html
<ui-card padding="md" [hoverable]="true">
  <div class="ui-card__header">
    <p class="eyebrow">Finance</p>
    <h2 class="ui-card__title">Monthly Budget</h2>
  </div>
  <div class="ui-card__body">
    Content here
  </div>
</ui-card>
```

---

## ✨ Efectos y Animaciones

### Transiciones

```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Hover States

```css
/* Hover en cards */
.ui-card.is-hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: color-mix(in srgb, var(--primary) 30%, var(--border));
}

/* Hover en botones */
.ui-btn:hover {
  background: var(--primary);
  color: var(--primary-foreground);
}
```

### Micro-interacciones

- **Hover lifts**: Cards se elevan ligeramente (`translateY(-2px)`)
- **Scale transforms**: Botones con scale sutil en hover/active
- **Focus rings**: Anillo de foco con color primary (`--ring`)

---

## 🌓 Temas

### Dark Mode (Por Defecto)

- **Activado con**: `<html class="dark">`
- **Colores**: Negro puro (#000000), grises oscuros (#171717, #262626)
- **Texto**: Casi blanco (#fafafa)

### Light Mode

- **Activado con**: `<html class="light">`
- **Colores**: Blanco (#ffffff), grises claros (#fafafa, #f5f5f5)
- **Texto**: Casi negro (#0a0a0a)

### Cambiar Tema

```html
<!-- Dark (default) -->
<html class="dark">

<!-- Light -->
<html class="light">
```

---

## 🎯 Características Visuales

### Glassmorphism
- **Backdrop blur**: `backdrop-filter: blur(20px)` en modales
- **Uso**: Sidebar, modales overlay

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5);
```

### Borders
- **Finos**: `border: 1px solid var(--border)`
- **Color**: `#333333` (gris oscuro) en dark mode
- **Sutiles**: No muy contrastados, integrados con el diseño

---

## 📱 Responsive

### Breakpoints

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

### Layout Típico

```css
/* Grid responsive */
display: grid;
grid-template-columns: 1fr;
gap: var(--space-6);

@media (min-width: 1024px) {
  grid-template-columns: repeat(2, 1fr);
}
```

---

## 📝 Ejemplos de Uso

### Botón Primary

```html
<ui-button variant="primary" size="md">
  <lucide-icon name="Plus" [size]="16"></lucide-icon>
  Add Transaction
</ui-button>
```

### Card con Hover

```html
<ui-card padding="md" [hoverable]="true">
  <div class="ui-card__header">
    <h2 class="ui-card__title">Title</h2>
  </div>
  <div class="ui-card__body">
    Content
  </div>
</ui-card>
```

### Input con Validación

```html
<ui-input
  type="text"
  label="Amount"
  placeholder="0.00"
  [hasError]="hasError"
  errorMessage="Invalid amount"
></ui-input>
```

---

## 🎨 Resumen del Estilo

✅ **Minimalista y limpio**  
✅ **Inspirado en Vercel** (azul #0070f3, negro puro)  
✅ **Moderno**: Angular + CSS Variables + Lucide Icons  
✅ **Consistente**: Sistema de diseño unificado  
✅ **Profesional**: Tipografía clara, espaciado generoso  
✅ **Accesible**: Contraste adecuado, semántica correcta

---

## 📚 Referencias

- **Vercel Design**: https://vercel.com/design
- **Lucide Icons**: https://lucide.dev
- **Inter Font**: https://rsms.me/inter/
- **Geist Mono**: Fuente oficial de Vercel (si está disponible)

---

**Última actualización**: Basado en el sistema de diseño Vercel, adaptado para Angular.

