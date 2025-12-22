# Auditoría QA + Diseño de Producto - Budget Management App

## 🔴 CRÍTICO - Lo que hay que arreglar YA

### Funcionalidad Rota

#### 1. PresupuestoService no persiste datos
- **Ubicación**: `src/app/services/presupuesto.service.ts`
- **Problema**: Los gastos y presupuesto se pierden al recargar la página
- **Impacto**: Pérdida de datos del usuario
- **Fix**: Agregar persistencia en localStorage o migrar a TransactionsService

#### 2. Gastos legacy no se integran con el nuevo sistema
- **Ubicación**: `src/app/components/gastos/ingresar-gasto/ingresar-gasto.component.ts`
- **Problema**: Dos sistemas paralelos, los gastos legacy no aparecen en Dashboard/Transactions
- **Impacto**: Datos fragmentados, experiencia confusa
- **Fix**: Integrar con TransactionsService o migrar completamente

#### 3. Función de importación no implementada
- **Ubicación**: `src/app/pages/settings/settings.page.ts:52`
- **Problema**: El botón "Import Data" solo muestra un toast pero no importa nada
- **Impacto**: Funcionalidad prometida pero no entregada
- **Fix**: Implementar lógica de importación JSON

#### 4. Currency y Locale no persisten
- **Ubicación**: `src/app/pages/settings/settings.page.ts:22-23`
- **Problema**: Propiedades del componente que se pierden al recargar
- **Impacto**: Usuario debe reconfigurar cada vez
- **Fix**: Persistir en localStorage o crear servicio de configuración

### Inconsistencias Graves de Diseño

#### 5. Componentes legacy usan sistema de espaciado diferente
- **Ubicación**: `src/app/components/gastos/listar-gasto/listar-gasto.component.css:4-10`
- **Problema**: Define `--spacing-*` cuando el sistema usa `--space-*`
- **Evidencia**: 
  ```css
  --spacing-xs: var(--space-2);
  --spacing-md: var(--space-5);
  ```
- **Impacto**: Sistema de diseño inconsistente, difícil de mantener
- **Fix**: Eliminar variables locales, usar directamente `--space-*` del sistema

#### 6. Tipografía legacy usa font-weights no definidos en el sistema
- **Ubicación**: `src/app/components/gastos/listar-gasto/listar-gasto.component.css`
- **Problema**: Usa `font-weight: 200` y `font-weight: 300` que no existen en design tokens
- **Evidencia**: 
  - Línea 46: `font-weight: 200;` en `.expense-list-title`
  - Línea 58: `font-weight: 300;` en `.expense-list-subtitle`
  - 15 ocurrencias totales de weights no estándar
- **Sistema define**: `400, 500, 600, 700` solamente
- **Impacto**: Tipografía inconsistente, se ve diferente al resto de la app
- **Fix**: Usar `--font-weight-regular` (400), `--font-weight-medium` (500), etc.

---

## 🟡 IMPORTANTE - Completar funcionalidad

### Iconografía - Inconsistencias de Tamaños

#### Tamaños inconsistentes para contextos similares

1. **Iconos en navegación**: Todos usan `[size]="18"` ✅ (consistente)

2. **Iconos en cards/transacciones**: 
   - `transaction-card.component.html:4`: `[size]="18"` (correcto)
   - `transaction-card.component.html:21-24`: `[size]="16"` para acciones (correcto)
   - Pero `dashboard.page.html:12`: `[size]="20"` en summary cards (inconsistente)
   - **Fix**: Unificar a `18px` para cards, `16px` para acciones

3. **Iconos en listas**:
   - `goals-list.component.ts:20`: `[size]="20"` 
   - `recurring-list.component.ts:19`: `[size]="20"`
   - `reminders-list.component.ts:18`: `[size]="20"`
   - `category-manager.component.html:39`: `[size]="16"` ⚠️ (más pequeño)
   - **Fix**: Unificar a `20px` para iconos en listas de items

4. **Iconos en formularios/inputs**:
   - `input.component.html:9,65`: `[size]="16"` ✅
   - `button.component.html:9,13`: `[size]="16"` ✅
   - **Correcto y consistente**

5. **Iconos pequeños (tags, close)**:
   - `tags-input.component.ts:25`: `[size]="12"` ✅
   - `search.component.ts:30`: `[size]="16"` para close
   - `toast.component.ts:21`: `[size]="16"` para close
   - `tutorial-modal.component.html:33`: `[size]="16"` para close
   - **Fix**: Unificar close buttons a `16px` (está bien)

6. **Iconos en empty states**:
   - Todos usan `[size]="48"` ✅ (consistente)

#### Recomendación de Sistema de Iconos
- **18px**: Navegación, headers de página
- **20px**: Cards principales, listas de items
- **16px**: Botones, inputs, acciones inline
- **14px**: Metadatos, badges, textos pequeños
- **12px**: Tags, elementos muy pequeños
- **48px**: Empty states

**Acción**: Crear constante o enum de tamaños de iconos para evitar magic numbers

### Features Incompletas

1. **Validación de formularios sin feedback visual**
   - `transaction-form.component.ts:64`: Valida pero no muestra mensajes
   - **Fix**: Agregar mensajes de error visuales

2. **Calendar no navega entre meses**
   - `calendar-view.component.ts`: Solo muestra mes actual
   - **Fix**: Agregar controles de navegación

3. **Recurring transactions no se generan automáticamente**
   - `recurring-transactions.service.ts`: Existe `getDueToday()` pero no hay procesamiento
   - **Fix**: Implementar generación automática

4. **Goals no se actualizan desde transacciones**
   - `goals.service.ts`: `currentAmount` es manual
   - **Fix**: Conectar con TransactionsService

5. **Reminders sin notificaciones**
   - `reminders.service.ts`: Solo almacena, no notifica
   - **Fix**: Agregar notificaciones del navegador

6. **Budgets no permite editar límites desde UI**
   - `budgets.page.ts`: Solo muestra alertas
   - **Fix**: Agregar capacidad de edición inline

7. **Falta confirmación para eliminar transacciones**
   - `transactions.page.ts:73`: Elimina sin confirmar
   - **Fix**: Agregar diálogo de confirmación

8. **Importación no valida estructura de datos**
   - `settings.page.ts:51`: Solo hace `JSON.parse()` sin validación
   - **Fix**: Validar esquema antes de importar

### Gaps en Sistema de Diseño

#### Empty States - Estilos inconsistentes

1. **transaction-list.component.css**:
   ```css
   .empty {
     padding: var(--space-6);
     border: 1px dashed var(--color-border);
     background: var(--color-bg-tertiary);
   }
   ```

2. **listar-gasto.component.css**:
   ```css
   .empty-state {
     padding: var(--spacing-xl) var(--spacing-md);  /* ⚠️ Usa --spacing-* */
     border: 1px dashed var(--color-border);
     background: rgba(0, 0, 0, 0.01);  /* ⚠️ Hardcoded en vez de token */
   }
   ```

3. **goals-list.component.css, reminders-list.component.css, recurring-list.component.css**:
   - Todos usan estructura similar pero con clases diferentes
   - Algunos tienen `.empty-icon` con `opacity: 0.5`, otros no
   - **Fix**: Crear componente `ui-empty-state` reutilizable

#### Border-radius inconsistente

- **ui-card**: `border-radius: var(--radius-lg)` (16px) ✅
- **listar-gasto empty-state**: `border-radius: var(--radius-md)` (12px) ⚠️
- **transaction-list empty**: `border-radius: var(--radius-md)` (12px) ⚠️
- **Fix**: Empty states deberían usar `--radius-lg` para consistencia con cards

#### Sombras hardcodeadas

- **listar-gasto.component.css:27**: `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);`
- **listar-gasto.component.css:33**: `box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06);`
- **listar-gasto.component.css:85**: `box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);`
- **Fix**: Usar tokens `--shadow-md`, `--shadow-lg` en vez de valores hardcodeados

---

## 🟢 NICE-TO-HAVE - Pulido y mejoras

### Micro-interactions

1. **Hover states inconsistentes en cards**:
   - `ui-card`: `transform: translateY(-4px)` con `--shadow-xl`
   - `listar-gasto expense-list-section`: `transform: translateY(-2px)` con sombra diferente
   - `.card` (global): `transform: translateY(-2px)` con `--shadow-lg`
   - **Fix**: Unificar hover elevation a `-2px` o `-4px` consistente

2. **Transiciones faltantes**:
   - Algunos botones no tienen transición en `transform`
   - Empty states aparecen sin fade-in
   - **Fix**: Agregar `transition` a todos los elementos interactivos

3. **Loading states no visibles**:
   - Botones tienen prop `loading` pero no hay skeleton loaders para listas
   - **Fix**: Agregar skeleton loaders para transacciones, goals, etc.

### Mejoras de UX

1. **Mensajes de toast inconsistentes**:
   - `transactions.page.ts`: Usa `.success()`
   - `goals.page.ts`: Usa `.show('success', ...)`
   - **Fix**: Estandarizar API del ToastService

2. **Tutorial modal sin imágenes**:
   - `app.component.ts:30-37`: Todos los steps tienen `img: ''`
   - **Fix**: Agregar screenshots o ilustraciones

3. **Feedback visual al editar**:
   - `transaction-form.component.ts`: No se distingue visualmente modo edición
   - **Fix**: Mostrar "Editing: [descripción]" o cambiar estilo

4. **Statistics usa promedio fijo**:
   - `statistics.page.ts:35`: Siempre divide por 30 días
   - **Fix**: Calcular basado en rango real de fechas

5. **Currency formatter hardcodeado**:
   - `listar-gasto.component.ts:91`: Hardcodea 'EUR'
   - **Fix**: Usar servicio de configuración

### Consistencia de Componentes

1. **Button sizes**:
   - `button.component.css:94-109`: Define `size-sm`, `size-md`, `size-lg`
   - Pero muchos lugares usan solo `variant` sin `size`
   - **Fix**: Estandarizar uso de sizes o hacer `md` el default consistente

2. **Input padding hardcodeado**:
   - `input.component.css:27`: `padding: 10px 12px;` (hardcoded)
   - `input.component.css:35`: `padding: 12px 14px;` para lg (hardcoded)
   - **Fix**: Usar tokens `--space-*` para consistencia

3. **Badge padding hardcoded**:
   - `badge.component.css:11`: `padding: 4px 10px;` (hardcoded)
   - `badge.component.css:20`: `padding: 2px 8px;` para sm (hardcoded)
   - **Fix**: Usar tokens `--space-*`

### Accesibilidad

1. **Focus states inconsistentes**:
   - Algunos botones tienen outline, otros solo box-shadow
   - **Fix**: Unificar focus ring style

2. **ARIA labels faltantes**:
   - Varios botones de acción (edit, delete) no tienen `aria-label`
   - **Fix**: Agregar labels descriptivos

3. **Keyboard navigation**:
   - Modal puede no tener focus trap
   - **Fix**: Verificar y agregar focus trap si falta

### Responsive

1. **Breakpoints inconsistentes**:
   - `app.component.css:78`: Usa `1024px` hardcoded
   - `gastos.component.css`: Usa múltiples breakpoints diferentes
   - Design tokens definen breakpoints pero no se usan consistentemente
   - **Fix**: Usar `--breakpoint-*` tokens o media queries consistentes

---

## Resumen Ejecutivo

### 🔴 Crítico: 6 items
- 4 problemas funcionales (persistencia, integración, import, configuración)
- 2 inconsistencias graves de diseño (espaciado, tipografía)

### 🟡 Importante: 18 items
- 8 tamaños de iconos a unificar
- 8 features incompletas
- 2 gaps en sistema de diseño (empty states, sombras)

### 🟢 Nice-to-have: 15 items
- Micro-interactions, loading states, accesibilidad, responsive

---

## Recomendaciones Prioritarias

### Fase 1 (Semana 1) - Crítico
1. Arreglar persistencia de PresupuestoService
2. Integrar sistemas legacy y nuevo
3. Unificar sistema de espaciado (eliminar `--spacing-*`)
4. Arreglar tipografía legacy (usar tokens de font-weight)

### Fase 2 (Semana 2) - Importante
1. Unificar tamaños de iconos según sistema propuesto
2. Implementar importación funcional
3. Completar validaciones de formularios
4. Crear componente `ui-empty-state` reutilizable

### Fase 3 (Ongoing) - Pulido
1. Micro-interactions consistentes
2. Loading states
3. Accesibilidad
4. Documentar sistema de diseño

---

## Sistema de Iconos Propuesto (Documentar)

```typescript
export const IconSizes = {
  navigation: 18,    // Sidebar, bottom nav
  card: 18,          // Cards principales
  list: 20,          // Listas de items
  action: 16,        // Botones, inputs
  metadata: 14,      // Badges, textos pequeños
  tag: 12,           // Tags, elementos muy pequeños
  empty: 48          // Empty states
} as const;
```

## Sistema de Espaciado (Ya existe, usar consistentemente)

✅ **USAR**: `--space-1` hasta `--space-16`  
❌ **NO USAR**: `--spacing-*` (eliminar del proyecto)
