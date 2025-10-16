# Dynamic Schedule

Una biblioteca de componentes React para crear horarios dinámicos con funcionalidad drag & drop.

## Características

- Soporte para tipos genéricos para modelos de datos flexibles
- Funcionalidad drag & drop con @dnd-kit
- Estilos personalizables con Tailwind CSS
- Indicadores de scroll con soporte de auto-scroll
- Soporte de multi-selección
- Atajos de teclado (Ctrl para multi-selección, Escape para limpiar)
- Soporte completo de TypeScript con definiciones de tipos

## Instalación

```bash
npm install dynamic-schedule
# o
pnpm add dynamic-schedule
# o
yarn add dynamic-schedule
```

### Dependencias Peer

Este paquete requiere que instales las siguientes dependencias en tu proyecto:

```bash
npm install react react-dom @dnd-kit/core @dnd-kit/modifiers zustand clsx lucide-react tailwindcss
```

O con pnpm:

```bash
pnpm add react react-dom @dnd-kit/core @dnd-kit/modifiers zustand clsx lucide-react tailwindcss
```

#### Versiones Compatibles

- `react`: ^18.0.0 || ^19.0.0
- `react-dom`: ^18.0.0 || ^19.0.0
- `@dnd-kit/core`: ^6.0.0
- `@dnd-kit/modifiers`: ^7.0.0 || ^8.0.0 || ^9.0.0
- `zustand`: ^4.0.0 || ^5.0.0
- `clsx`: ^2.0.0
- `lucide-react`: ^0.400.0
- `tailwindcss`: ^4.0.0

## Configuración de Tailwind CSS

### ¿Por qué necesito configurar Tailwind en mi proyecto?

Este paquete utiliza clases de Tailwind CSS para sus estilos. Sin embargo, **el paquete NO incluye Tailwind CSS compilado** por las siguientes razones:

1. **Tailwind es una peerDependency**: El paquete declara Tailwind como dependencia peer, lo que significa que tu proyecto es responsable de proporcionar Tailwind CSS.

2. **Las clases de Tailwind están en el código distribuido**: El paquete contiene clases de Tailwind en su código JavaScript (como `className="flex items-center justify-center"`), pero estas clases solo son nombres de clases en texto - no tienen estilos asociados hasta que Tailwind las procesa.

3. **Tailwind funciona con purging/tree-shaking**: Tailwind CSS v4 analiza tu código y genera solo los estilos CSS para las clases que realmente usas. Por eso necesitas decirle a Tailwind dónde buscar estas clases.

### Configuración Paso a Paso

#### 1. Instalar Tailwind CSS en tu proyecto

```bash
npm install -D tailwindcss @tailwindcss/vite
```

#### 2. Configurar tu `tailwind.config.ts` (o `.js`)

**IMPORTANTE**: Debes agregar la ruta del paquete `dynamic-schedule` en el array `content`:

```typescript
import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // CRUCIAL: Incluir el paquete dynamic-schedule para que Tailwind detecte sus clases
    "./node_modules/dynamic-schedule/dist/**/*.{js,ts,jsx,tsx}",
  ],
} satisfies Config;
```

**¿Por qué esta línea es necesaria?**

La línea `"./node_modules/dynamic-schedule/dist/**/*.{js,ts,jsx,tsx}"` le dice a Tailwind:

> "Escanea el código del paquete dynamic-schedule y genera los estilos CSS para todas las clases de Tailwind que encuentres ahí"

Sin esta configuración, Tailwind ignorará el paquete y las clases usadas por los componentes no tendrán estilos, resultando en componentes que se ven rotos o sin estilos.

#### 3. Agregar el plugin de Tailwind a Vite

En tu `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Plugin de Tailwind CSS v4
  ],
})
```

#### 4. NO necesitas importar CSS de Tailwind

Con Tailwind CSS v4 y el plugin de Vite, **NO necesitas** agregar imports como:

```css
/* NO necesario con Tailwind v4 + @tailwindcss/vite */
@import "tailwindcss";
```

El plugin maneja automáticamente la inyección de estilos.

### ¿Por qué no hay un import de estilos en el paquete?

A diferencia de muchas bibliotecas tradicionales que requieren `import 'library/styles.css'`, este paquete funciona de manera diferente:

- **Las clases están en el código JavaScript**: Cuando se construye el paquete, el código resultante contiene las clases de Tailwind como strings de texto en los atributos `className`.
- **Tailwind en tu proyecto genera los estilos**: Tu configuración de Tailwind escanea estos strings y genera automáticamente el CSS necesario.
- **Sin duplicación**: Esto evita que tengas CSS duplicado si tu proyecto también usa Tailwind.
- **Personalización unificada**: Puedes personalizar el theme de Tailwind y los componentes de este paquete heredarán esos cambios.

## Uso Básico

```tsx
import { DynamicSchedule } from 'dynamic-schedule'
import type { Column, Row, Item } from 'dynamic-schedule'

interface MyData {
  id: string
  title: string
  description: string
}

function App() {
  const columns: Column[] = [
    { id: 'col-1', label: 'Lunes' },
    { id: 'col-2', label: 'Martes' },
    { id: 'col-3', label: 'Miércoles' },
  ]

  const rows: Row[] = [
    { id: 'row-1', label: '9:00 AM' },
    { id: 'row-2', label: '10:00 AM' },
    { id: 'row-3', label: '11:00 AM' },
  ]

  const items: Item<MyData>[] = [
    {
      id: 'item-1',
      columnId: 'col-1',
      rowId: 'row-1',
      start: 0,
      duration: 2,
      data: {
        id: '1',
        title: 'Reunión',
        description: 'Standup del equipo'
      }
    },
    // ... más items
  ]

  return (
    <DynamicSchedule
      columns={columns}
      rows={rows}
      items={items}
      onChange={(data) => {
        console.log('Items actualizados:', data.items)
      }}
      ScheduleItemComponent={({ item }) => (
        <div>
          <h3>{item.data.title}</h3>
          <p>{item.data.description}</p>
        </div>
      )}
    />
  )
}
```

## Props del Componente

### DynamicScheduleProps<T>

#### Props Requeridas

| Prop | Tipo | Descripción |
|------|------|-------------|
| `columns` | `Column[]` | Array de columnas del schedule |
| `rows` | `Row[]` | Array de filas del schedule |
| `items` | `Item<T>[]` | Array de items a mostrar |
| `ScheduleItemComponent` | `Component` | Componente para renderizar cada item |

#### Props Opcionales

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `onChange` | `(data) => void` | - | Callback cuando los items cambian (drag & drop). Si no se proporciona, el componente funcionará en modo solo lectura |
| `ScheduleVoidItemComponent` | `Component` | - | Componente para celdas vacías (clickeables) |
| `scrollIndicator` | `ScrollIndicator` | - | Configuración del indicador de scroll |
| `headerHeight` | `number` | `48` | Altura del header en pixels |
| `rowHeight` | `number` | `80` | Altura de cada fila en pixels |
| `fixedColumnWidth` | `number` | - | Ancho de la columna fija (primera columna) |
| `minColumnWidth` | `number` | - | Ancho mínimo de columnas dinámicas |
| `getItemCanDragOnX` | `(item) => boolean` | - | Función para determinar si un item puede moverse horizontalmente |
| `headerClassName` | `string` | - | Clase CSS personalizada para el header |
| `containerClassName` | `string` | - | Clase CSS personalizada para el contenedor |
| `fixedColumnClassName` | `string` | - | Clase CSS personalizada para la columna fija |
| `currentLineClassName` | `string` | - | Clase CSS personalizada para la línea de tiempo actual |

## Tipos

### Column

```typescript
interface Column {
  id: string
  label: string
}
```

### Row

```typescript
interface Row {
  id: string
  label: string
}
```

### Item<T>

```typescript
interface Item<T> {
  id: string
  columnId: string  // ID de la columna
  rowId: string     // ID de la fila
  start: number     // Posición inicial (índice de fila)
  duration: number  // Duración (cantidad de filas que ocupa)
  data: T           // Tus datos personalizados
}
```

### ScrollIndicator

```typescript
interface ScrollIndicator {
  quantity: number    // Cantidad de pixels a scrollear
  autoScroll: boolean // Si debe hacer auto-scroll al arrastrar
}
```

### ScheduleItemComponentProps<T>

```typescript
interface ScheduleItemComponentProps<T> {
  item: Item<T>
  // ... props adicionales proporcionados por el sistema de drag & drop
}
```

### ScheduleVoidItemComponentProps

```typescript
interface ScheduleVoidItemComponentProps {
  columnId: string
  rowId: string
  // ... props adicionales
}
```

## Características Avanzadas

### Multi-selección

Mantén presionado `Ctrl` (o `Cmd` en Mac) mientras haces clic en los items para seleccionar múltiples items. Los items seleccionados se pueden arrastrar juntos.

Presiona `Escape` para limpiar la selección.

### Indicadores de Scroll

Configura indicadores de scroll para desplazarse automáticamente cuando arrastres items cerca de los bordes:

```tsx
<DynamicSchedule
  // ... otras props
  scrollIndicator={{
    quantity: 50,      // pixels a desplazar
    autoScroll: true,  // activar auto-scroll
  }}
/>
```

### Celdas Vacías Personalizadas

Proporciona un componente personalizado para las celdas vacías (útil para permitir crear nuevos items):

```tsx
const VoidCell = ({ columnId, rowId }) => (
  <div onClick={() => createNewItem(columnId, rowId)}>
    <p>Click para crear un evento</p>
  </div>
)

<DynamicSchedule
  // ... otras props
  ScheduleVoidItemComponent={VoidCell}
/>
```

### Controlar Movimiento Horizontal

Puedes controlar si un item puede moverse horizontalmente (entre columnas):

```tsx
<DynamicSchedule
  // ... otras props
  getItemCanDragOnX={(item) => {
    // Por ejemplo, solo permitir mover items de cierto tipo
    return item.data.type === 'movable'
  }}
/>
```

### Hooks Exportados

El paquete exporta hooks útiles para casos de uso avanzados:

```typescript
import {
  useItemsByColumn,
  useCoincidencesByColumn,
  useDynamicScheduleStore,
  useDynamicScheduleScrollIndicatorStore,
  useDynamicScheduleSelectedItemsStore,
  useDynamicScheduleMovementStore,
} from 'dynamic-schedule'
```

### Utilidades Exportadas

```typescript
import {
  getCoincidences,
  // funciones de cálculo
  // constantes
} from 'dynamic-schedule'
```

## FAQ Técnico

### ¿Por qué Tailwind no se importa directamente en el paquete?

El paquete **no incluye** los estilos compilados de Tailwind por diseño:

1. **Evita duplicación**: Si el paquete incluyera todo Tailwind CSS, y tu proyecto también usa Tailwind, terminarías con estilos duplicados y un bundle más grande.

2. **Permite personalización**: Al usar Tailwind de tu proyecto, puedes personalizar el theme y los componentes heredarán esa configuración.

3. **Es una práctica estándar**: Las bibliotecas de componentes con Tailwind generalmente funcionan así (shadcn/ui, Headless UI, Radix UI + Tailwind, etc.).

### ¿Cómo funciona internamente?

Cuando se construye el paquete con Vite:

1. **El código se transpila**: Los componentes React se convierten a JavaScript estándar.
2. **Las clases quedan como strings**: Las clases de Tailwind permanecen como texto en los atributos `className`:
   ```javascript
   // En dynamic-schedule/dist/dynamic-schedule.js
   createElement("div", { className: "flex items-center gap-2" })
   ```
3. **Tailwind CSS en tu proyecto escanea estos strings**: Gracias a la configuración en `tailwind.config.ts`, Tailwind:
   - Escanea `node_modules/dynamic-schedule/dist/**/*`
   - Encuentra todas las clases usadas (`flex`, `items-center`, `gap-2`, etc.)
   - Genera el CSS necesario para esas clases específicas
   - Incluye ese CSS en tu bundle final

### ¿Qué pasa si olvido configurar el tailwind.config?

Si olvidas agregar la ruta del paquete en `content`, Tailwind no escaneará el código del paquete, no generará los estilos para esas clases, y los componentes se verán sin estilos o rotos.

**Síntomas**:
- Los componentes aparecen pero no tienen estilos
- El layout está desorganizado
- Los colores, espaciados y fuentes no se aplican

**Solución**: Verifica que tu `tailwind.config.ts` incluya:
```typescript
content: [
  "./src/**/*.{js,ts,jsx,tsx}",
  "./node_modules/dynamic-schedule/dist/**/*.{js,ts,jsx,tsx}", // ← Esta línea es crucial
]
```

## Solución de Problemas

### Los componentes no tienen estilos

**Causa**: Tailwind no está escaneando el paquete.

**Solución**: Verifica que tu `tailwind.config.ts` incluya la ruta del paquete en el array `content`.

### Error: Cannot find module 'tailwindcss'

**Causa**: Tailwind no está instalado en tu proyecto.

**Solución**: Instala Tailwind CSS:
```bash
npm install -D tailwindcss @tailwindcss/vite
```

### Las clases personalizadas de Tailwind no funcionan

**Causa**: Estás usando Tailwind v3 en lugar de v4.

**Solución**: Este paquete requiere Tailwind CSS v4. Actualiza:
```bash
npm install -D tailwindcss@^4.0.0 @tailwindcss/vite
```

### Error: Cannot find module '@dnd-kit/core'

**Causa**: Faltan peer dependencies.

**Solución**: Instala todas las peer dependencies:
```bash
npm install @dnd-kit/core @dnd-kit/modifiers zustand clsx lucide-react
```

## TypeScript

Esta biblioteca está escrita en TypeScript y proporciona definiciones de tipos completas. El componente principal es genérico y puede trabajar con cualquier tipo de datos:

```typescript
interface MisDatosPersonalizados {
  titulo: string
  descripcion: string
  color: string
  // ... tus propiedades
}

const items: Item<MisDatosPersonalizados>[] = [...]

<DynamicSchedule<MisDatosPersonalizados>
  items={items}
  ScheduleItemComponent={({ item }) => (
    <div style={{ backgroundColor: item.data.color }}>
      <h3>{item.data.titulo}</h3>
      <p>{item.data.descripcion}</p>
    </div>
  )}
  // ... otras props
/>
```

## Licencia

MIT

## Autor

Santiago Reynoso (@ssreynoso)
https://github.com/ssreynoso

## Contribuir

Las contribuciones son bienvenidas! Por favor, siéntete libre de enviar un Pull Request.
