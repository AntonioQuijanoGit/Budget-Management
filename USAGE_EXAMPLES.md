# 📖 Ejemplos de Uso - Stack Moderno

## 1. Store con Signals (Estado Global)

### Uso Básico

```typescript
import { Component, inject } from '@angular/core';
import { AppStore } from './core/store/app.store';

@Component({
  selector: 'app-transactions',
  template: `
    <div>
      <h2>Transactions</h2>
      <p>Balance: {{ balance() | currency }}</p>
      <ul>
        <li *ngFor="let tx of transactions()">
          {{ tx.description }} - {{ tx.amount }}
        </li>
      </ul>
    </div>
  `
})
export class TransactionsComponent {
  store = inject(AppStore);
  
  // Acceder a estado (reactivo)
  transactions = this.store.transactions;
  balance = this.store.balance; // Computed value
  
  // Mutar estado
  addTransaction() {
    this.store.addTransaction({
      id: crypto.randomUUID(),
      type: 'expense',
      categoryId: 'cat-1',
      amount: 100,
      date: new Date().toISOString(),
      description: 'New transaction'
    });
  }
}
```

### Computed Values

```typescript
// Los computed values se actualizan automáticamente
totalIncome = this.store.totalIncome;
totalExpenses = this.store.totalExpenses;
balance = this.store.balance;

// En el template
<p>Income: {{ totalIncome() }}</p>
<p>Expenses: {{ totalExpenses() }}</p>
<p>Balance: {{ balance() }}</p>
```

---

## 2. Animaciones

### Uso Básico

```typescript
import { Component } from '@angular/core';
import { fadeIn, slideInUp, listStagger } from './core/animations/animations';

@Component({
  selector: 'app-list',
  animations: [fadeIn, slideInUp, listStagger],
  template: `
    <div @fadeIn>
      <h1>Title</h1>
    </div>
    
    <div @slideInUp>
      <p>Content slides up</p>
    </div>
    
    <ul @listStagger>
      <li *ngFor="let item of items">Item</li>
    </ul>
  `
})
export class ListComponent {
  items = [1, 2, 3, 4, 5];
}
```

### Animaciones de Modal

```typescript
import { modalEnter, backdropFade } from './core/animations/animations';

@Component({
  animations: [modalEnter, backdropFade],
  template: `
    <div class="backdrop" @backdropFade *ngIf="isOpen"></div>
    <div class="modal" @modalEnter *ngIf="isOpen">
      <h2>Modal Title</h2>
      <p>Modal content</p>
    </div>
  `
})
export class ModalComponent {
  isOpen = false;
}
```

### Animaciones de Card

```typescript
import { cardEnter } from './core/animations/animations';

@Component({
  animations: [cardEnter],
  template: `
    <div class="card" @cardEnter *ngFor="let card of cards">
      {{ card.title }}
    </div>
  `
})
export class CardsComponent {
  cards = [...];
}
```

---

## 3. Tailwind CSS (Opcional)

### Uso Básico

```html
<!-- Puedes usar utilidades de Tailwind -->
<div class="flex items-center gap-4 p-6 bg-card rounded-lg">
  <span class="text-foreground font-semibold">Title</span>
  <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md">
    Click me
  </button>
</div>
```

### Combinar con CSS Variables

```html
<!-- Mezclar Tailwind con tu sistema actual -->
<div class="ui-card flex gap-4">
  <!-- ui-card usa CSS Variables -->
  <!-- flex gap-4 usa Tailwind -->
</div>
```

### Colores Personalizados

```html
<!-- Los colores de Tailwind están integrados con CSS Variables -->
<div class="bg-primary text-primary-foreground">
  Uses --primary from CSS Variables
</div>

<div class="bg-card text-card-foreground">
  Uses --card from CSS Variables
</div>
```

---

## 4. Combinar Todo

### Ejemplo Completo

```typescript
import { Component, inject } from '@angular/core';
import { AppStore } from './core/store/app.store';
import { fadeIn, listStagger } from './core/animations/animations';

@Component({
  selector: 'app-dashboard',
  animations: [fadeIn, listStagger],
  template: `
    <div class="p-6" @fadeIn>
      <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
      
      <!-- Stats usando Tailwind -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-card p-4 rounded-lg">
          <p class="text-muted-foreground">Balance</p>
          <p class="text-2xl font-bold">{{ balance() | currency }}</p>
        </div>
        <div class="bg-card p-4 rounded-lg">
          <p class="text-muted-foreground">Income</p>
          <p class="text-2xl font-bold text-green-500">{{ totalIncome() | currency }}</p>
        </div>
        <div class="bg-card p-4 rounded-lg">
          <p class="text-muted-foreground">Expenses</p>
          <p class="text-2xl font-bold text-red-500">{{ totalExpenses() | currency }}</p>
        </div>
      </div>
      
      <!-- List usando animaciones -->
      <ul @listStagger>
        <li 
          *ngFor="let tx of transactions()"
          class="bg-card p-4 rounded-lg mb-2"
        >
          {{ tx.description }} - {{ tx.amount | currency }}
        </li>
      </ul>
    </div>
  `
})
export class DashboardComponent {
  store = inject(AppStore);
  
  // Store signals
  transactions = this.store.transactions;
  balance = this.store.balance;
  totalIncome = this.store.totalIncome;
  totalExpenses = this.store.totalExpenses;
}
```

---

## 5. Migración Gradual

### Mantener Services Existentes

No necesitas migrar todo de golpe. Puedes usar ambos:

```typescript
// Opción 1: Usar Store (nuevo)
this.store.addTransaction(tx);

// Opción 2: Usar Service (existente)
this.txService.add(tx);
```

### Migrar cuando sea conveniente

```typescript
// Antes
this.txService.transactions$.subscribe(txs => {
  this.transactions = txs;
});

// Después (más simple)
transactions = this.store.transactions; // Signal, no necesitas subscribe
```

---

## 6. Best Practices

### Store
- ✅ Usa computed values para datos derivados
- ✅ Mutaciones siempre a través de métodos del store
- ✅ No modifiques el state directamente

### Animaciones
- ✅ Usa animaciones apropiadas para cada contexto
- ✅ No abuses de animaciones complejas (performance)
- ✅ Prefiere animaciones suaves y rápidas

### Tailwind
- ✅ Úsalo cuando sea más conveniente que CSS custom
- ✅ Combina con CSS Variables para consistencia
- ✅ No reemplaces completamente tu sistema actual

---

## 📚 Referencias

- **Store:** `src/app/core/store/app.store.ts`
- **Animaciones:** `src/app/core/animations/animations.ts`
- **Tailwind Config:** `tailwind.config.ts`
- **Design System:** `DESIGN_SYSTEM.md`

