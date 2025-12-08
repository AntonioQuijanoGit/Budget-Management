# Budget Management

Aplicación web minimalista para la gestión de presupuestos y seguimiento de gastos, construida con Angular 18. Interfaz limpia, accesible y completamente responsive.

## Características

- Configuración de presupuesto inicial
- Registro de gastos individuales con nombre y cantidad
- Cálculo automático del presupuesto restante
- Indicadores visuales de progreso y porcentaje de uso
- Visualización de gastos totales y disponibles
- Diseño responsive (desktop, tablet, móvil)
- Accesible (WCAG guidelines, navegación por teclado, ARIA)
- Animaciones sutiles y transiciones suaves

## Tecnologías

- **Angular 18** - Framework frontend
- **TypeScript** - Lenguaje de programación
- **RxJS** - Programación reactiva
- **CSS3** - Custom Properties, Animations, Grid/Flexbox

## Instalación

```bash
# Clonar repositorio
git clone https://github.com/AntonioQuijanoGit/Budget-Management.git
cd Budget-Management

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## Construcción

```bash
# Construir para producción
npm run build
```

Los archivos de producción se generan en el directorio `dist/`

## Uso

1. Establece tu presupuesto total disponible
2. Añade gastos individuales con nombre y cantidad
3. Visualiza el presupuesto restante, total gastado y porcentaje de uso
4. Monitorea tu progreso con indicadores visuales

## Estructura del Proyecto

- `src/app/components/ingresar-presupuesto/` - Componente de entrada de presupuesto
- `src/app/components/gastos/` - Componentes de gestión de gastos
- `src/app/services/presupuesto.service.ts` - Servicio de gestión de estado
- `src/styles.css` - Estilos globales y sistema de diseño

## Diseño

Diseño minimalista con paleta de colores en blanco, negro y gris. Tipografía Helvetica Neue e Inter. Espaciado consistente basado en grid de 8px. Animaciones sutiles que mejoran la experiencia sin distraer.

## Autor

**Antonio Quijano**

---

Desarrollado con Angular
