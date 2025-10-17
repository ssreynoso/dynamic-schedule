# Dynamic Schedule

Una biblioteca de componentes React para crear horarios dinámicos con funcionalidad drag & drop.

## Características

- Soporte para tipos genéricos para modelos de datos flexibles
- Funcionalidad drag & drop con @dnd-kit
- Estilos incluidos automáticamente (sin configuración adicional)
- Compatible con Tailwind CSS y otros frameworks de estilos
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
npm install react react-dom @dnd-kit/core @dnd-kit/modifiers zustand lucide-react
```

O con pnpm:

```bash
pnpm add react react-dom @dnd-kit/core @dnd-kit/modifiers zustand lucide-react
```

#### Versiones Compatibles

- `react`: ^18.0.0 || ^19.0.0
- `react-dom`: ^18.0.0 || ^19.0.0
- `@dnd-kit/core`: ^6.0.0
- `@dnd-kit/modifiers`: ^7.0.0 || ^8.0.0 || ^9.0.0
- `zustand`: ^4.0.0 || ^5.0.0
- `lucide-react`: ^0.400.0

## Estilos

### Los estilos están incluidos automáticamente

Este paquete incluye sus propios estilos CSS que se inyectan automáticamente cuando importas los componentes. **No necesitas importar ningún archivo CSS adicional ni configurar nada especial.**

```tsx
// Solo importa y usa - los estilos ya están incluidos
import { DynamicSchedule } from 'dynamic-schedule'
```

### Compatible con Tailwind CSS

El paquete es totalmente compatible con proyectos que usan Tailwind CSS u otros frameworks de estilos. Los estilos internos del paquete están aislados con prefijos `ds-` (dynamic-schedule) para evitar conflictos.

Puedes usar Tailwind CSS en tu proyecto sin problemas, como en las props de personalización:

```tsx
<DynamicSchedule
  headerClassName="bg-gray-200"        // Usa tus clases de Tailwind
  containerClassName="border shadow-lg"
  // ... otras props
/>
```

## Uso Básico

```tsx
import { useState } from 'react'
import { DynamicSchedule } from 'dynamic-schedule'
import type { Column, Row, Item, DynamicScheduleOnChangeCallback } from 'dynamic-schedule'

interface MyData {
  name: string
  description: string
}

function App() {
  const columns: Column[] = [
    { id: '1', label: 'Lunes' },
    { id: '2', label: 'Martes' },
    { id: '3', label: 'Miércoles' },
  ]

  const rows: Row[] = [
    { id: '0', label: '08:00' },
    { id: '1', label: '09:00' },
    { id: '2', label: '10:00' },
    { id: '3', label: '11:00' },
  ]

  const [items, setItems] = useState<Item<MyData>[]>([
    {
      id: '1',
      columnId: '1',
      rowStart: 1,    // Índice de fila inicial
      rowSpan: 2,     // Cantidad de filas que ocupa
      original: {
        name: 'Reunión de equipo',
        description: 'Standup diario'
      }
    },
    // ... más items
  ])

  const handleChange: DynamicScheduleOnChangeCallback<MyData> = async ({ items }) => {
    // Actualiza los items después del drag & drop
    setItems((prevItems) => {
      const newItems = [...prevItems]
      items.forEach(({ newScheduleItem }) => {
        const index = newItems.findIndex((i) => i.id === newScheduleItem.id)
        if (index !== -1) {
          newItems[index] = newScheduleItem
        }
      })
      return newItems
    })
  }

  return (
    <DynamicSchedule
      columns={columns}
      rows={rows}
      items={items}
      firstColumnWidth={64}
      headerHeight={40}
      rowHeight={100}
      minColumnWidth={300}
      firstColumnText="Horarios"
      onChange={handleChange}
      ScheduleItemComponent={({ original }) => (
        <div>
          <h3>{original.name}</h3>
          <p>{original.description}</p>
        </div>
      )}
      headerClassName="bg-gray-200"
      firstColumnClassName="bg-gray-100"
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
| `ScheduleItemComponent` | `Component<ScheduleItemComponentProps<T>>` | Componente para renderizar cada item |
| `firstColumnWidth` | `number` | Ancho en pixels de la primera columna (columna fija) |
| `headerHeight` | `number` | Altura en pixels del header |
| `rowHeight` | `number` | Altura en pixels de cada fila |
| `minColumnWidth` | `number` | Ancho mínimo en pixels de las columnas dinámicas |

#### Props Opcionales

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `onChange` | `DynamicScheduleOnChangeCallback<T>` | `null` | Callback cuando los items cambian (drag & drop). Si no se proporciona, el componente funcionará en modo solo lectura |
| `VoidItemComponent` | `Component<ScheduleVoidItemComponentProps>` | - | Componente para celdas vacías (clickeables para crear nuevos items) |
| `scrollIndicator` | `ScrollIndicator` | `null` | Configuración del indicador de scroll automático |
| `firstColumnText` | `string` | - | Texto a mostrar en la celda del header de la primera columna |
| `getItemCanDragOnX` | `(itemId: string) => boolean` | - | Función para determinar si un item puede moverse horizontalmente (entre columnas) |
| `headerClassName` | `string` | - | Clase CSS personalizada para el header |
| `containerClassName` | `string` | - | Clase CSS personalizada para el contenedor principal |
| `containerStyle` | `React.CSSProperties` | - | Estilos inline para el contenedor principal |
| `firstColumnClassName` | `string` | - | Clase CSS personalizada para la primera columna (columna fija) |
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
  columnId: string  // ID de la columna donde está el item
  rowStart: number  // Índice de la fila inicial (0-based)
  rowSpan: number   // Cantidad de filas que ocupa el item
  original: T       // Tus datos personalizados
}
```

### ScrollIndicator

```typescript
interface ScrollIndicator {
  quantity: number    // Cantidad de pixels a scrollear
  autoScroll: boolean // Si debe hacer auto-scroll al arrastrar cerca de los bordes
}
```

### DynamicScheduleOnChangeCallback<T>

```typescript
type DynamicScheduleOnChangeCallback<T> = (
  input: DynamicScheduleOnChangeCallbackInput<T>
) => Promise<void>

interface DynamicScheduleOnChangeCallbackInput<T> {
  items: {
    newScheduleItem: Item<T>
    newColumnId: string
    newRowId: string
  }[]
}
```

### ScheduleItemComponentProps<T>

```typescript
interface ScheduleItemComponentProps<T> {
  original: T  // Tus datos personalizados del item
  draggableProps?: {
    attributes: DraggableAttributes
    listeners: SyntheticListenerMap | undefined
  }
}
```

### ScheduleVoidItemComponentProps

```typescript
interface ScheduleVoidItemComponentProps {
  row: Row      // Fila de la celda vacía
  column: Column // Columna de la celda vacía
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
const VoidCell = ({ row, column }: ScheduleVoidItemComponentProps) => (
  <div onClick={() => createNewItem(column.id, row.id)}>
    <p>Click para crear evento</p>
    <small>{row.label} - {column.label}</small>
  </div>
)

<DynamicSchedule
  // ... otras props
  VoidItemComponent={VoidCell}
/>
```

### Controlar Movimiento Horizontal

Puedes controlar si un item puede moverse horizontalmente (entre columnas):

```tsx
<DynamicSchedule
  // ... otras props
  getItemCanDragOnX={(itemId) => {
    // Por ejemplo, solo permitir mover ciertos items
    const item = items.find(i => i.id === itemId)
    return item?.original.movable === true
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

## Solución de Problemas

### Error: Cannot find module '@dnd-kit/core'

**Causa**: Faltan peer dependencies.

**Solución**: Instala todas las peer dependencies:
```bash
npm install @dnd-kit/core @dnd-kit/modifiers zustand lucide-react
```

### Los componentes no se ven correctamente

**Causa**: Es posible que falte alguna dependencia peer o haya un conflicto de estilos.

**Solución**:
1. Verifica que todas las peer dependencies estén instaladas
2. Si usas un bundler personalizado, asegúrate de que procese correctamente los módulos CSS
3. Revisa que no haya estilos globales que sobrescriban los estilos del paquete

## TypeScript

Esta biblioteca está escrita en TypeScript y proporciona definiciones de tipos completas. El componente principal es genérico y puede trabajar con cualquier tipo de datos:

```typescript
interface MisDatosPersonalizados {
  titulo: string
  descripcion: string
  color: string
  // ... tus propiedades
}

const items: Item<MisDatosPersonalizados>[] = [
  {
    id: '1',
    columnId: '1',
    rowStart: 0,
    rowSpan: 2,
    original: {
      titulo: 'Mi evento',
      descripcion: 'Descripción del evento',
      color: '#3b82f6'
    }
  }
]

<DynamicSchedule<MisDatosPersonalizados>
  columns={columns}
  rows={rows}
  items={items}
  firstColumnWidth={64}
  headerHeight={40}
  rowHeight={100}
  minColumnWidth={300}
  ScheduleItemComponent={({ original }) => (
    <div style={{ backgroundColor: original.color }}>
      <h3>{original.titulo}</h3>
      <p>{original.descripcion}</p>
    </div>
  )}
/>
```

## Licencia

MIT

## Autor

Santiago Reynoso (@ssreynoso)
https://github.com/ssreynoso

## Contribuir

Las contribuciones son bienvenidas! Por favor, siéntete libre de enviar un Pull Request.
