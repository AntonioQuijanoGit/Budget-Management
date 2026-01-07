# 📊 AUDITORÍA FUNCIONAL - Budget Management App

**Fecha:** 2024  
**Rol:** Product Manager Senior  
**Objetivo:** Análisis completo de coherencia funcional, flujos de usuario y gaps de producto

---

## 📋 ÍNDICE

1. [Mapa de Funcionalidades Actuales](#1-mapa-de-funcionalidades-actuales)
2. [Análisis de Flujos Principales](#2-análisis-de-flujos-principales)
3. [Problemas Identificados](#3-problemas-identificados)
4. [Gaps Funcionales](#4-gaps-funcionales)
5. [Plan de Acción Priorizado](#5-plan-de-acción-priorizado)

---

## 1. MAPA DE FUNCIONALIDADES ACTUALES

### 1.1 Features Implementadas

#### ✅ **Core Features (Funcionales)**
- **Dashboard**: Vista general con estadísticas, gráficos y resumen financiero
- **Transactions**: CRUD completo de ingresos y gastos
  - Crear, editar, eliminar transacciones
  - Búsqueda por texto
  - Filtros (tipo, categoría, rango de fechas, monto)
- **Categories**: Gestión de categorías personalizadas
  - Crear, editar, eliminar categorías
  - Iconos y colores personalizados
  - Presupuesto mensual por categoría
- **Budgets**: Visualización de presupuestos por categoría
  - Alertas visuales (warning/danger) cuando se acerca/excede
  - Progreso visual con barras
- **Statistics**: Análisis de gastos
  - Top 5 categorías
  - Promedio diario
  - Totales de ingresos/gastos
- **Goals**: Objetivos financieros
  - 4 tipos: savings, debt, expense_limit, income_target
  - Auto-cálculo desde transacciones
- **Recurring Transactions**: Transacciones recurrentes
  - Frecuencias: daily, weekly, monthly, yearly
  - Auto-generación de transacciones cuando vencen
- **Reminders**: Recordatorios
  - Con fecha y hora opcional
  - Notificaciones del navegador
- **History/Calendar**: Vista de calendario con transacciones
- **Settings**: Configuración básica

#### ⚠️ **Features Parcialmente Implementadas**
- **Budget Alerts**: Se muestran visualmente pero NO hay notificaciones automáticas
- **Recurring Auto-generation**: Funciona pero no hay forma clara de identificar transacciones generadas
- **Legacy Routes**: Rutas antiguas (`/ingresarPresupuesto`, `/gastos`) existen pero no están integradas

#### ❌ **Features No Implementadas**
- **Budget Global**: No hay presupuesto total mensual, solo por categoría
- **Export/Import**: No hay exportación de datos
- **Multi-account**: No hay gestión de múltiples cuentas
- **Reports**: No hay reportes detallados (PDF, etc.)

---

## 2. ANÁLISIS DE FLUJOS PRINCIPALES

### 2.1 Flujo: Agregar Gasto → Ver en Dashboard/Estadísticas

**Estado:** ✅ **FUNCIONAL** (con advertencias)

**Flujo actual:**
1. Usuario va a `/transactions`
2. Completa formulario (descripción, monto, categoría, fecha)
3. Guarda → `TransactionsService.add()` → localStorage
4. Dashboard y Statistics se actualizan automáticamente vía suscripciones RxJS

**Problemas detectados:**
- ⚠️ **No hay validación de presupuesto al agregar**: El usuario puede agregar gastos que excedan el presupuesto sin advertencia previa
- ⚠️ **No hay feedback inmediato de impacto**: No se muestra "Este gasto te llevará al X% del presupuesto de esta categoría"

**Coherencia de datos:** ✅ Los datos se reflejan correctamente en todas las vistas

---

### 2.2 Flujo: Editar/Eliminar Gasto → Actualización en Tiempo Real

**Estado:** ✅ **FUNCIONAL**

**Flujo actual:**
1. Usuario edita/elimina transacción
2. `TransactionsService.update()` o `remove()`
3. Todas las vistas se actualizan vía suscripciones RxJS

**Problemas detectados:**
- ✅ Funciona correctamente
- ⚠️ **No hay confirmación para eliminación**: Solo un `confirm()` básico, podría mejorarse

**Coherencia de datos:** ✅ Correcta

---

### 2.3 Flujo: Filtrar Gastos por Período → Estadísticas Actualizadas

**Estado:** ⚠️ **PARCIALMENTE FUNCIONAL**

**Flujo actual:**
1. Usuario aplica filtros (fecha, categoría, tipo, monto)
2. `TransactionFiltersService` filtra la lista
3. **PROBLEMA**: Las estadísticas en `/statistics` NO respetan los filtros
4. **PROBLEMA**: El dashboard NO respeta los filtros

**Problemas detectados:**
- ❌ **CRÍTICO**: Los filtros solo afectan la lista de transacciones, NO las estadísticas
- ❌ **CRÍTICO**: Los filtros no se persisten entre sesiones
- ⚠️ No hay forma de "aplicar filtros a todas las vistas"

**Coherencia de datos:** ❌ **ROTA** - Los filtros no se aplican consistentemente

---

### 2.4 Flujo: Ver Breakdown por Categorías → Coherencia con Gastos

**Estado:** ✅ **FUNCIONAL**

**Flujo actual:**
1. Usuario ve gráficos en Dashboard y Statistics
2. `groupExpensesByCategory()` agrupa correctamente
3. Los datos coinciden con las transacciones ingresadas

**Problemas detectados:**
- ✅ Funciona correctamente
- ⚠️ **No hay drill-down**: No se puede hacer clic en una categoría para ver sus transacciones

**Coherencia de datos:** ✅ Correcta

---

### 2.5 Flujo: Establecer Presupuesto → Alertas cuando se Exceda

**Estado:** ⚠️ **PARCIALMENTE FUNCIONAL**

**Flujo actual:**
1. Usuario establece `budgetMonthly` en una categoría (en Categories page)
2. `BudgetsService.computeAlerts()` calcula alertas
3. Se muestran visualmente en `/budgets` con colores (warning/danger)
4. **PROBLEMA**: NO hay notificaciones automáticas del navegador
5. **PROBLEMA**: NO hay alertas en tiempo real al agregar un gasto

**Problemas detectados:**
- ❌ **CRÍTICO**: No hay notificaciones automáticas cuando se excede presupuesto
- ❌ **CRÍTICO**: No hay alerta preventiva al agregar un gasto que excedería el presupuesto
- ⚠️ No hay presupuesto global mensual, solo por categoría
- ⚠️ No hay forma de establecer presupuesto desde la página de Budgets directamente

**Coherencia de datos:** ✅ Los cálculos son correctos, pero falta la acción/notificación

---

### 2.6 Flujo: Recurring Transactions → Auto-generación

**Estado:** ⚠️ **FUNCIONAL PERO CONFUSO**

**Flujo actual:**
1. Usuario crea recurring transaction
2. `AutoRecurringService` verifica diariamente
3. Cuando `nextDueDate <= today`, genera transacción automáticamente
4. Actualiza `nextDueDate` según frecuencia
5. Muestra notificación del navegador

**Problemas detectados:**
- ✅ La generación automática funciona
- ❌ **CRÍTICO**: No hay forma clara de identificar qué transacciones fueron generadas automáticamente vs. manuales
- ⚠️ Las transacciones generadas tienen `isRecurring: true` pero no hay UI que lo muestre claramente
- ⚠️ No hay historial de "próximas generaciones" - el usuario no sabe cuándo se generará la próxima

**Coherencia de datos:** ✅ Funciona, pero falta claridad para el usuario

---

### 2.7 Flujo: Goals → Auto-cálculo desde Transacciones

**Estado:** ⚠️ **FUNCIONAL PERO CONFUSO**

**Flujo actual:**
1. Usuario crea goal (ej: "Ahorrar 1000€")
2. `GoalsService` auto-calcula `currentAmount` desde transacciones según tipo:
   - `savings`: income - expenses
   - `expense_limit`: suma de gastos en categoría
   - `income_target`: suma de ingresos
   - `debt`: suma de gastos
3. Se muestra progreso en Dashboard

**Problemas detectados:**
- ✅ El auto-cálculo funciona
- ❌ **CRÍTICO**: No está claro para el usuario que el `currentAmount` se auto-calcula
- ⚠️ No hay forma de establecer un `currentAmount` manual si el usuario quiere trackear algo diferente
- ⚠️ El cálculo de `savings` puede ser confuso (¿es el balance total o solo lo ahorrado este mes?)

**Coherencia de datos:** ✅ Correcta, pero falta claridad conceptual

---

### 2.8 Flujo: Reminders → Notificaciones

**Estado:** ✅ **FUNCIONAL**

**Flujo actual:**
1. Usuario crea reminder con fecha/hora
2. `ReminderCheckerService` verifica cada minuto
3. Muestra notificación del navegador cuando es hora
4. También muestra pre-alerta 1 hora antes

**Problemas detectados:**
- ✅ Funciona correctamente
- ⚠️ No hay forma de marcar reminder como completado desde la notificación

**Coherencia de datos:** ✅ Correcta

---

## 3. PROBLEMAS IDENTIFICADOS

### 3.1 CRÍTICOS (Bloquean funcionalidad o causan confusión grave)

#### 🔴 **P1: AppStore No Se Usa - Duplicación de Estado**
**Severidad:** CRÍTICA  
**Descripción:** 
- Existe un `AppStore` completo con Signals que NO se usa en ninguna parte
- Todos los componentes usan servicios individuales con BehaviorSubject/RxJS
- Esto causa:
  - Duplicación de código
  - Posible desincronización si en el futuro se usa AppStore
  - Confusión sobre cuál es la fuente de verdad

**Impacto:** Arquitectura inconsistente, mantenimiento difícil

---

#### 🔴 **P2: Sistema Legacy Desconectado**
**Severidad:** CRÍTICA  
**Descripción:**
- Existen rutas legacy (`/ingresarPresupuesto`, `/gastos`) que usan `PresupuestoService`
- Este servicio NO está integrado con el nuevo sistema de budgets
- Los gastos legacy se migran a transacciones pero el presupuesto global no se usa
- El usuario puede tener dos sistemas funcionando en paralelo sin saberlo

**Impacto:** Confusión del usuario, datos inconsistentes

---

#### 🔴 **P3: Filtros No Afectan Estadísticas**
**Severidad:** CRÍTICA  
**Descripción:**
- Los filtros en `/transactions` solo afectan la lista de transacciones
- Las estadísticas en `/statistics` y el dashboard muestran TODAS las transacciones siempre
- No hay forma de ver "estadísticas del último mes" o "estadísticas filtradas"

**Impacto:** Funcionalidad rota, expectativa del usuario no cumplida

---

#### 🔴 **P4: No Hay Alertas Automáticas de Presupuesto**
**Severidad:** CRÍTICA  
**Descripción:**
- Las alertas de presupuesto solo se muestran visualmente en `/budgets`
- NO hay notificaciones del navegador cuando se excede
- NO hay advertencia al agregar un gasto que excedería el presupuesto
- El usuario solo se entera cuando va manualmente a la página de budgets

**Impacto:** Feature incompleta, valor limitado para el usuario

---

#### 🔴 **P5: Recurring Transactions No Se Identifican Claramente**
**Severidad:** CRÍTICA  
**Descripción:**
- Las transacciones generadas automáticamente tienen `isRecurring: true` pero:
  - No hay badge/indicador visual en la lista
  - No hay forma de filtrar "solo transacciones generadas"
  - No hay forma de ver el "recurring transaction" original desde la transacción generada

**Impacto:** Confusión del usuario, difícil auditar transacciones automáticas

---

### 3.2 MEDIOS (Afectan UX pero no bloquean)

#### 🟡 **P6: Goals Auto-cálculo No Es Claro**
**Severidad:** MEDIA  
**Descripción:**
- Los goals auto-calculan `currentAmount` pero no está claro para el usuario
- No hay explicación de cómo se calcula cada tipo de goal
- No hay forma de establecer un valor manual si el usuario quiere trackear algo diferente

**Impacto:** Confusión, falta de control del usuario

---

#### 🟡 **P7: Filtros No Se Persisten**
**Severidad:** MEDIA  
**Descripción:**
- Los filtros se pierden al recargar la página
- El usuario tiene que re-aplicar filtros cada vez

**Impacto:** Fricción en el uso diario

---

#### 🟡 **P8: No Hay Presupuesto Global Mensual**
**Severidad:** MEDIA  
**Descripción:**
- Solo hay presupuestos por categoría
- No hay forma de establecer "presupuesto total del mes: 2000€"
- No hay alerta si el total de gastos excede un presupuesto global

**Impacto:** Feature limitada, muchos usuarios esperan presupuesto global

---

#### 🟡 **P9: No Hay Drill-down en Categorías**
**Severidad:** MEDIA  
**Descripción:**
- En los gráficos de categorías, no se puede hacer clic para ver transacciones de esa categoría
- El usuario tiene que ir manualmente a `/transactions` y filtrar

**Impacto:** Navegación menos fluida

---

#### 🟡 **P10: Budgets No Se Pueden Crear/Editar desde Budgets Page**
**Severidad:** MEDIA  
**Descripción:**
- Para establecer un presupuesto, el usuario debe ir a `/categories` y editar la categoría
- No hay forma de gestionar presupuestos desde `/budgets` directamente

**Impacto:** Flujo de usuario no intuitivo

---

### 3.3 BAJOS (Nice-to-have)

#### 🟢 **P11: No Hay Export/Import de Datos**
**Severidad:** BAJA  
**Descripción:** No hay forma de exportar o importar datos (JSON, CSV, etc.)

---

#### 🟢 **P12: No Hay Confirmación Mejorada para Eliminación**
**Severidad:** BAJA  
**Descripción:** Solo hay `confirm()` básico, podría ser un modal más elegante

---

#### 🟢 **P13: No Hay Vista de "Próximas Recurring Transactions"**
**Severidad:** BAJA  
**Descripción:** No hay calendario o lista de cuándo se generarán las próximas transacciones recurrentes

---

## 4. GAPS FUNCIONALES

### 4.1 Gaps Críticos para MVP

#### ❌ **G1: Sistema de Notificaciones de Presupuesto Incompleto**
**Qué falta:**
- Notificaciones automáticas cuando se excede presupuesto
- Advertencia al agregar gasto que excedería presupuesto
- Alertas preventivas (ej: "Te quedan 50€ en esta categoría")

**Por qué es crítico:** Sin esto, la feature de budgets es solo visual, no proactiva

---

#### ❌ **G2: Filtros Globales/Contextuales**
**Qué falta:**
- Aplicar filtros a todas las vistas (dashboard, statistics, transactions)
- Persistencia de filtros entre sesiones
- Filtros contextuales (ej: "Este mes", "Últimos 30 días")

**Por qué es crítico:** Los usuarios esperan poder analizar períodos específicos

---

#### ❌ **G3: Integración Legacy → Moderno**
**Qué falta:**
- Migración completa del sistema legacy
- Eliminación o integración de rutas legacy
- Unificación del concepto de "presupuesto"

**Por qué es crítico:** Evita confusión y datos duplicados

---

### 4.2 Gaps Importantes para Producto Completo

#### ⚠️ **G4: Presupuesto Global Mensual**
**Qué falta:**
- Establecer presupuesto total del mes
- Alertas cuando se acerca/excede presupuesto global
- Comparativa presupuesto global vs. por categoría

---

#### ⚠️ **G5: Identificación de Transacciones Recurrentes**
**Qué falta:**
- Badge visual en transacciones generadas
- Link desde transacción → recurring transaction original
- Filtro "Solo transacciones generadas automáticamente"

---

#### ⚠️ **G6: Claridad en Goals**
**Qué falta:**
- Explicación de cómo se calcula cada tipo de goal
- Opción de establecer `currentAmount` manual
- Mejor visualización del progreso

---

#### ⚠️ **G7: Navegación Mejorada**
**Qué falta:**
- Drill-down en gráficos (clic en categoría → ver transacciones)
- Breadcrumbs
- Navegación rápida entre vistas relacionadas

---

### 4.3 Gaps Nice-to-Have

- Export/Import de datos
- Reportes PDF
- Multi-account
- Etiquetas avanzadas
- Adjuntos (recibos, facturas)

---

## 5. PLAN DE ACCIÓN PRIORIZADO

### 🚨 FASE 1: CRÍTICO (Hacer PRIMERO)

#### **T1: Unificar Sistema de Estado**
**Prioridad:** 🔴 CRÍTICA  
**Acción:**
- Decidir: ¿AppStore o Servicios individuales?
- Si AppStore: Migrar todos los servicios a usar AppStore
- Si Servicios: Eliminar AppStore completamente
- **Recomendación:** Usar AppStore (más moderno, Signals, mejor para futuro)

**Tiempo estimado:** 2-3 días  
**Impacto:** Arquitectura limpia, base sólida

---

#### **T2: Integrar/Eliminar Sistema Legacy**
**Prioridad:** 🔴 CRÍTICA  
**Acción:**
- Opción A: Migrar completamente a nuevo sistema, eliminar rutas legacy
- Opción B: Integrar `PresupuestoService` con nuevo sistema de budgets
- **Recomendación:** Opción A - Migrar y eliminar legacy

**Tiempo estimado:** 1-2 días  
**Impacto:** Elimina confusión, unifica experiencia

---

#### **T3: Filtros Globales y Persistencia**
**Prioridad:** 🔴 CRÍTICA  
**Acción:**
- Hacer que filtros afecten dashboard y statistics
- Persistir filtros en localStorage
- Agregar filtros contextuales rápidos ("Este mes", "Últimos 30 días")

**Tiempo estimado:** 2 días  
**Impacto:** Feature rota → Feature funcional

---

#### **T4: Sistema de Alertas de Presupuesto**
**Prioridad:** 🔴 CRÍTICA  
**Acción:**
- Notificaciones automáticas cuando se excede presupuesto (al agregar gasto)
- Advertencia preventiva al agregar gasto que excedería presupuesto
- Alertas en tiempo real en UI (toast/banner)

**Tiempo estimado:** 2-3 días  
**Impacto:** Feature incompleta → Feature completa y útil

---

### ⚠️ FASE 2: IMPORTANTE (Hacer DESPUÉS de Fase 1)

#### **T5: Identificar Transacciones Recurrentes**
**Prioridad:** 🟡 MEDIA  
**Acción:**
- Badge visual "Auto-generated" en transacciones
- Link desde transacción → recurring transaction
- Filtro para ver solo transacciones generadas

**Tiempo estimado:** 1 día  
**Impacto:** Claridad para el usuario

---

#### **T6: Clarificar Goals**
**Prioridad:** 🟡 MEDIA  
**Acción:**
- Agregar tooltip/explicación de cómo se calcula cada tipo
- Opción de establecer `currentAmount` manual
- Mejorar UI de progreso

**Tiempo estimado:** 1-2 días  
**Impacto:** Reduce confusión

---

#### **T7: Presupuesto Global Mensual**
**Prioridad:** 🟡 MEDIA  
**Acción:**
- Agregar campo "Presupuesto mensual total" en Settings o Dashboard
- Calcular y mostrar progreso
- Alertas cuando se acerca/excede

**Tiempo estimado:** 2 días  
**Impacto:** Feature más completa

---

#### **T8: Navegación Mejorada**
**Prioridad:** 🟡 MEDIA  
**Acción:**
- Drill-down en gráficos (clic → filtrar por categoría)
- Breadcrumbs en vistas
- Navegación rápida

**Tiempo estimado:** 1-2 días  
**Impacto:** Mejor UX

---

### ✅ FASE 3: NICE-TO-HAVE (Opcional)

- Export/Import de datos
- Reportes PDF
- Confirmaciones mejoradas (modales en lugar de confirm())
- Vista de "Próximas recurring transactions"

---

## 📊 RESUMEN EJECUTIVO

### Estado Actual
- ✅ **Core funcional:** La app tiene las funcionalidades básicas implementadas
- ⚠️ **Integración:** Hay problemas de integración entre features
- ❌ **Completitud:** Varias features están a medias

### Problemas Principales
1. **Arquitectura duplicada:** AppStore vs Servicios
2. **Sistema legacy desconectado**
3. **Filtros no funcionan globalmente**
4. **Alertas de presupuesto incompletas**
5. **Transacciones recurrentes poco claras**

### Recomendación
**Priorizar Fase 1 (Crítico)** antes de agregar nuevas features. La app tiene buena base pero necesita consolidación y completar las features existentes antes de expandir.

### Métricas de Éxito
- ✅ Todos los flujos principales funcionan end-to-end
- ✅ Filtros funcionan en todas las vistas
- ✅ Alertas de presupuesto son proactivas
- ✅ No hay sistemas duplicados o desconectados
- ✅ Usuario puede entender y usar todas las features sin confusión

---

**Documento generado por:** Product Manager Senior  
**Próxima revisión:** Después de implementar Fase 1


