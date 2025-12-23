# 🎨 Sistema de Nesting y Estilos - Arquitectura CSS

## 🏗️ Estructura de Nesting en CSS

### 1. **Variables CSS Anidadas** (Design Tokens)

```css
/* design-tokens.css */
:root {
  /* Base unificado - Todo parte de aquí */
  --radius: 0.5rem;  /* 8px */
  
  /* Variables derivadas (nesting conceptual) */
  --radius-sm: calc(var(--radius) * 1);      /* 8px */
  --radius-md: calc(var(--radius) * 1.5);    /* 12px */
  --radius-lg: calc(var(--radius) * 2);      /* 16px */
  --radius-xl: calc(var(--radius) * 2.5);    /* 20px */
  
  /* Colores base */
  --primary: #ffffff;
  --background: #000000;
  
  /* Colores semánticos anidados */
  --color-primary: var(--primary);
  --color-bg-primary: var(--background);
  --color-text-primary: var(--foreground);
}
```

**Por qué funciona así:**

- **Un solo valor base** (`--radius`) genera todo el sistema
- **Variables anidadas**: `--radius-md` depende de `--radius`
- **Cambio centralizado**: Cambias `--radius` y TODO se ajusta
- **Mantenibilidad**: Un solo lugar para cambiar toda la escala

**Ejemplo práctico:**

```css
/* Antes (sin nesting) */
.btn { border-radius: 12px; }
.card { border-radius: 16px; }
.modal { border-radius: 20px; }

/* Ahora (con nesting) */
:root {
  --radius: 0.5rem;  /* Cambia ESTO y todo se ajusta */
}

.btn { border-radius: var(--radius-md); }    /* 12px automático */
.card { border-radius: var(--radius-lg); }   /* 16px automático */
.modal { border-radius: var(--radius-xl); }  /* 20px automático */
```

---

### 2. **Nesting de Temas** (Clases CSS Anidadas)

```css
/* Tema base (dark por defecto) */
:root {
  --background: #000000;
  --foreground: #fafafa;
}

/* Tema light - Se activa con clase .light */
:root.light,
.light {
  --background: #ffffff;
  --foreground: #0a0a0a;
}

/* Tema dark explícito - Se activa con clase .dark */
:root.dark,
.dark {
  --background: #000000;
  --foreground: #fafafa;
}
```

**Por qué funciona así:**

- **HTML anida las clases**: `<html class="dark">` aplica tema a toda la app
- **CSS Variables se heredan**: Los componentes automáticamente usan el tema
- **Sin recompilación**: Cambias la clase y todo se actualiza

**Flujo:**

```
1. <html class="dark"> 
   ↓
2. :root.dark { --background: #000000; }
   ↓
3. .ui-card { background: var(--background); }  ← Usa el valor del tema
   ↓
4. Todos los componentes heredan automáticamente
```

---

### 3. **View Encapsulation de Angular** (Scoping Automático)

```typescript
// button.component.ts
@Component({
  selector: 'ui-button',
  styleUrls: ['./button.component.css'],  // ← CSS scoped automáticamente
  template: `
    <button class="ui-btn">
      <span class="label">Click me</span>
    </button>
  `
})
```

```css
/* button.component.css */
/* Angular automáticamente agrega un atributo único a cada selector */
.ui-btn {
  padding: var(--space-3);
  border-radius: var(--radius-md);
}

.ui-btn .label {
  color: var(--foreground);
}

/* Angular transforma esto a algo como: */
/* [_ngcontent-abc123] .ui-btn { ... } */
/* [_ngcontent-abc123] .ui-btn .label { ... } */
```

**Por qué funciona así:**

- **Encapsulación automática**: Angular añade atributos únicos a cada componente
- **Nesting seguro**: `.ui-btn .label` solo afecta labels dentro de este componente
- **Sin conflictos**: Dos componentes pueden usar `.label` sin chocar
- **Scoping nativo**: No necesitas BEM u otras convenciones para evitar conflictos

---

### 4. **BEM + Angular** (Naming Convention para Nesting)

```css
/* card.component.css */
/* Block */
.ui-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
}

/* Block Modifier */
.ui-card.is-hoverable:hover {
  transform: translateY(-2px);
}

/* Block Element (nesting con BEM) */
.ui-card__header {
  display: flex;
  gap: var(--space-3);
}

.ui-card__header .eyebrow {
  /* Nested element dentro de header */
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
}

/* Block Element */
.ui-card__title {
  font-size: var(--font-size-xl);
}

.ui-card__body {
  display: flex;
  flex-direction: column;
}

.ui-card__footer {
  margin-top: auto;
}
```

**Por qué funciona así:**

- **BEM naming**: `block__element` hace el nesting explícito
- **Fácil de leer**: Sabes que `__header` pertenece a `ui-card`
- **Scoping visual**: El guión doble `__` indica nesting
- **Combinado con Angular**: View encapsulation + BEM = máxima seguridad

**Estructura HTML correspondiente:**

```html
<ui-card class="ui-card is-hoverable">
  <div class="ui-card__header">
    <p class="eyebrow">Category</p>
    <h2 class="ui-card__title">Title</h2>
  </div>
  <div class="ui-card__body">
    Content here
  </div>
  <div class="ui-card__footer">
    Actions
  </div>
</ui-card>
```

---

### 5. **CSS Nesting Nativo** (Modern CSS)

Angular soporta CSS nesting nativo (sin necesidad de preprocesadores):

```css
/* button.component.css */
.ui-btn {
  padding: var(--space-3);
  border-radius: var(--radius-md);
  
  /* Nesting directo (CSS moderno) */
  &:hover {
    background: var(--primary);
  }
  
  &.is-block {
    width: 100%;
  }
  
  .label {
    font-weight: var(--font-weight-semibold);
    
    /* Double nesting */
    &::before {
      content: '';
    }
  }
  
  /* Nesting con pseudo-selectores */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
```

**Por qué funciona así:**

- **Sintaxis moderna**: `&` se refiere al selector padre
- **Menos repetición**: No necesitas escribir `.ui-btn` una y otra vez
- **Más legible**: El nesting visual refleja la estructura HTML
- **Nativo del navegador**: No necesitas SASS/LESS

**Equivalente sin nesting:**

```css
/* Sin nesting (más verboso) */
.ui-btn { padding: var(--space-3); }
.ui-btn:hover { background: var(--primary); }
.ui-btn.is-block { width: 100%; }
.ui-btn .label { font-weight: var(--font-weight-semibold); }
.ui-btn .label::before { content: ''; }
.ui-btn:disabled { opacity: 0.6; }
```

---

## 📦 Estructura de Archivos (Nesting de Estilos)

```
src/
├── styles/
│   ├── design-tokens.css    ← Variables globales (base)
│   ├── page-base.css        ← Utilidades globales (.page, .page-header)
│   └── styles.css           ← Resets y estilos base
│
└── app/
    ├── app.component.css    ← Shell principal (sidebar, layout)
    │
    ├── pages/
    │   ├── dashboard/
    │   │   └── dashboard.page.css  ← Estilos específicos de página
    │   └── transactions/
    │       └── transactions.page.css
    │
    └── components/
        ├── ui/
        │   ├── button/
        │   │   └── button.component.css  ← Estilos del componente
        │   ├── card/
        │   │   └── card.component.css
        │   └── modal/
        │       └── modal.component.css
        │
        └── features/
            └── transactions/
                ├── transaction-card.component.css
                └── transaction-list.component.css
```

**Nesting conceptual:**

```
Global (styles/)
  ├── Variables CSS (design-tokens.css)
  │   └── Variables anidadas (--radius → --radius-md)
  │
  ├── Utilidades (page-base.css)
  │   └── .page, .page-header, .page-title
  │
  └── Resets (styles.css)
      └── *, html, body

App Shell (app.component.css)
  ├── .app-shell
  ├── .sidebar
  │   └── nav a (nested)
  └── .content

Pages (pages/*.page.css)
  └── Estilos específicos de cada página

Components (components/**/*.component.css)
  └── Estilos scoped de cada componente
      └── Pueden usar variables globales
      └── Pueden anidar sus propios elementos
```

---

## 🔄 Cascada y Especificidad (Cómo se Resuelven los Estilos)

### Orden de Aplicación:

```css
/* 1. Global - design-tokens.css */
:root {
  --radius: 0.5rem;
  --primary: #ffffff;
}

/* 2. Global - styles.css */
.card {
  border-radius: var(--radius-lg);
}

/* 3. Component - card.component.css */
.ui-card {
  border-radius: var(--radius-lg);  /* Puede sobrescribir .card */
  background: var(--background);    /* Usa variable global */
}

/* 4. Modifier - card.component.css */
.ui-card.is-hoverable:hover {
  /* Más específico, gana sobre .ui-card */
  transform: translateY(-2px);
}
```

**Por qué funciona así:**

- **Variables CSS**: Se resuelven donde se usan (no tienen especificidad)
- **Cascada**: Estilos globales primero, luego componentes
- **View Encapsulation**: Los estilos de componentes NO afectan otros componentes
- **Especificidad**: Selectores más específicos ganan

---

## 🎯 Ejemplos Prácticos del Código

### Ejemplo 1: Card Component (BEM + Nesting)

```css
/* card.component.css */
.ui-card {
  /* Block */
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  
  /* Modifier */
  &.is-hoverable:hover {
    transform: translateY(-2px);
  }
  
  /* Element - Header */
  &__header {
    display: flex;
    gap: var(--space-3);
    
    /* Nested element dentro de header */
    .eyebrow {
      color: var(--color-text-tertiary);
      font-size: var(--font-size-xs);
    }
  }
  
  /* Element - Title */
  &__title {
    font-size: var(--font-size-xl);
    color: var(--color-text-primary);
  }
  
  /* Element - Body */
  &__body {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }
}
```

**HTML correspondiente:**

```html
<ui-card class="ui-card is-hoverable">
  <div class="ui-card__header">
    <p class="eyebrow">Finance</p>
    <h2 class="ui-card__title">Monthly Budget</h2>
  </div>
  <div class="ui-card__body">
    <p>Content here</p>
  </div>
</ui-card>
```

### Ejemplo 2: Button Component (Nesting con Pseudo-selectores)

```css
/* button.component.css */
.ui-btn {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  
  /* Modifier */
  &.is-block {
    width: 100%;
  }
  
  /* Pseudo-selector nested */
  &:hover {
    background: var(--primary);
    color: var(--primary-foreground);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Element nested */
  .label {
    font-weight: var(--font-weight-semibold);
  }
  
  /* Deep selector (para componentes hijos) */
  ::ng-deep lucide-icon {
    width: 16px !important;
    height: 16px !important;
  }
}
```

### Ejemplo 3: App Shell (Layout Nesting)

```css
/* app.component.css */
.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  
  /* Modifier */
  &.legacy-route {
    grid-template-columns: 1fr;
  }
}

.sidebar {
  padding: var(--space-8) var(--space-5);
  border-right: 1px solid var(--color-border);
  
  /* Scrollbar nested */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 3px;
    
    &:hover {
      background: var(--color-text-tertiary);
    }
  }
}

nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  
  /* Links nested */
  a {
    padding: var(--space-3);
    border-radius: var(--radius-md);
    
    &:hover {
      background: color-mix(in srgb, var(--primary) 12%, transparent);
    }
    
    &.active {
      background: var(--color-bg-tertiary);
      border-left: 4px solid var(--primary);
    }
  }
}
```

---

## 🚀 Mejores Prácticas de Nesting

### ✅ DO (Hacer)

1. **Usa variables CSS anidadas** para sistemas escalables
   ```css
   :root {
     --radius: 0.5rem;
     --radius-md: calc(var(--radius) * 1.5);
   }
   ```

2. **Usa BEM para elementos anidados** en componentes complejos
   ```css
   .ui-card__header .eyebrow { ... }
   ```

3. **Aprovecha View Encapsulation** - No necesitas prefijos largos
   ```css
   .label { ... }  /* Angular lo scopes automáticamente */
   ```

4. **Usa nesting moderno** cuando mejora la legibilidad
   ```css
   .btn {
     &:hover { ... }
     &.active { ... }
   }
   ```

### ❌ DON'T (No hacer)

1. **No anides demasiado profundo** (máximo 3-4 niveles)
   ```css
   /* ❌ Mal - demasiado profundo */
   .card .header .title .text .span { ... }
   
   /* ✅ Bien - usa BEM o clases específicas */
   .card__title { ... }
   ```

2. **No uses !important** a menos que sea absolutamente necesario
   ```css
   /* ❌ Mal */
   .text { color: red !important; }
   
   /* ✅ Bien - aumenta especificidad */
   .ui-card .text { color: red; }
   ```

3. **No mezcles estilos globales con componentes** sin necesidad
   ```css
   /* ❌ Mal - estilo global en componente */
   /* button.component.css */
   body { margin: 0; }  /* Esto NO funciona con View Encapsulation */
   
   /* ✅ Bien - en styles.css */
   body { margin: 0; }
   ```

---

## 📝 Resumen: Flujo Completo de Nesting

```
1. Variables CSS (design-tokens.css)
   :root { --radius: 0.5rem; }
        ↓
   --radius-md: calc(var(--radius) * 1.5)
        ↓
   
2. Estilos Globales (styles.css)
   .card { border-radius: var(--radius-lg); }
        ↓
   
3. Component Styles (component.css)
   .ui-card { border-radius: var(--radius-lg); }
        ↓
        ↓ (View Encapsulation de Angular)
        ↓
   
4. HTML Renderizado
   <ui-card class="ui-card">
     <div class="ui-card__header">...</div>
   </ui-card>
        ↓
   
5. CSS Aplicado (combinado)
   - Variables CSS resueltas
   - View Encapsulation aplicado
   - Especificidad calculada
   - Estilos finales aplicados al DOM
```

---

**En resumen:** El nesting en Angular funciona a múltiples niveles:
- **Variables CSS**: Anidación de valores base → derivados
- **Temas CSS**: Anidación de clases `.dark`/`.light` en HTML
- **View Encapsulation**: Scoping automático de componentes
- **BEM + Nesting**: Convenciones para elementos anidados
- **CSS Nesting Moderno**: Sintaxis `&` para pseudo-selectores

Todo esto crea un sistema escalable, mantenible y seguro. 🎨✨

