# Dynamic Schedule

A dynamic schedule component library for React with drag & drop functionality.

## Features

- Generic type support for flexible data models
- Drag & drop functionality powered by @dnd-kit
- Customizable styling with Tailwind CSS
- Scroll indicators with auto-scroll support
- Multi-selection support
- Keyboard shortcuts (Ctrl for multi-select, Escape to clear)
- TypeScript support with full type definitions

## Installation

```bash
npm install dynamic-schedule
# or
pnpm add dynamic-schedule
# or
yarn add dynamic-schedule
```

### Peer Dependencies

This library requires the following peer dependencies to be installed in your project:

```bash
npm install react react-dom @dnd-kit/core @dnd-kit/modifiers zustand clsx lucide-react
```

## Basic Usage

```tsx
import { DynamicSchedule } from 'dynamic-schedule'
import type { Column, Row, Item } from 'dynamic-schedule'

// Import styles
import 'dynamic-schedule/styles'

// Define your data type
interface MyData {
  title: string
  description: string
}

// Define your columns and rows
const columns: Column[] = [
  { id: '1', label: 'Monday' },
  { id: '2', label: 'Tuesday' },
  { id: '3', label: 'Wednesday' },
]

const rows: Row[] = [
  { id: '1', label: '9:00 AM' },
  { id: '2', label: '10:00 AM' },
  { id: '3', label: '11:00 AM' },
]

// Define your items
const items: Item<MyData>[] = [
  {
    id: '1',
    columnId: '1',
    rowStart: 0,
    rowSpan: 2,
    original: {
      title: 'Meeting',
      description: 'Team standup',
    },
  },
]

// Create a custom item component
const ScheduleItemComponent = ({ original, draggableProps }) => (
  <div {...draggableProps?.attributes} {...draggableProps?.listeners}>
    <h3>{original.title}</h3>
    <p>{original.description}</p>
  </div>
)

// Use the component
function App() {
  const handleChange = async (input) => {
    console.log('Items changed:', input.items)
    // Handle the change (e.g., update your backend)
  }

  return (
    <DynamicSchedule
      columns={columns}
      rows={rows}
      items={items}
      ScheduleItemComponent={ScheduleItemComponent}
      onChange={handleChange}
      firstColumnWidth={100}
      headerHeight={50}
      rowHeight={60}
      minColumnWidth={150}
    />
  )
}
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `Column[]` | Array of column definitions |
| `rows` | `Row[]` | Array of row definitions |
| `items` | `Item<T>[]` | Array of schedule items |
| `ScheduleItemComponent` | `React.FC<ScheduleItemComponentProps<T>>` | Component to render each item |
| `onChange` | `DynamicScheduleOnChangeCallback<T>` | Callback when items are moved |
| `firstColumnWidth` | `number` | Width of the first column in pixels |
| `headerHeight` | `number` | Height of the header row in pixels |
| `rowHeight` | `number` | Height of each row in pixels |
| `minColumnWidth` | `number` | Minimum width of columns in pixels |

### Optional Props

| Prop | Type | Description |
|------|------|-------------|
| `firstColumnText` | `string` | Text for the first column header |
| `VoidItemComponent` | `React.FC<ScheduleVoidItemComponentProps>` | Component for empty cells |
| `scrollIndicator` | `ScrollIndicator` | Configuration for scroll indicators |
| `headerClassName` | `string` | Custom CSS class for header |
| `containerClassName` | `string` | Custom CSS class for container |
| `firstColumnClassName` | `string` | Custom CSS class for first column |
| `currentLineClassName` | `string` | Custom CSS class for current time line |
| `getItemCanDragOnX` | `(itemId: string) => boolean` | Function to determine if item can be dragged horizontally |

## Types

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
  columnId: Column['id']
  rowStart: number
  rowSpan: number
  original: T
}
```

### ScrollIndicator
```typescript
interface ScrollIndicator {
  quantity: number // px
  autoScroll: boolean
}
```

## Advanced Features

### Multi-Selection

Hold `Ctrl` (or `Cmd` on Mac) while clicking items to select multiple items. Selected items can be dragged together.

### Scroll Indicators

Configure scroll indicators to automatically scroll when dragging items near the edges:

```tsx
<DynamicSchedule
  // ... other props
  scrollIndicator={{
    quantity: 50, // pixels to scroll
    autoScroll: true,
  }}
/>
```

### Custom Void Cells

Provide a custom component for empty cells:

```tsx
const VoidCell = ({ row, column }) => (
  <div>
    <p>Empty slot at {row.label}</p>
  </div>
)

<DynamicSchedule
  // ... other props
  VoidItemComponent={VoidCell}
/>
```

## Styling

The component uses Tailwind CSS for styling. Import the styles in your application:

```tsx
import 'dynamic-schedule/styles'
```

You can customize the appearance by passing custom className props or by overriding the Tailwind classes.

## TypeScript

This library is written in TypeScript and provides full type definitions. The main component is generic and can work with any data type:

```typescript
interface MyCustomData {
  // your data structure
}

const items: Item<MyCustomData>[] = [...]
<DynamicSchedule<MyCustomData> ... />
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
