# Testing Setup - Resumen Completo

**Fecha**: 14 de Octubre, 2025
**Tarea**: Configuración completa del sistema de testing para Dynamic Schedule

---

## 🎯 Objetivo

Configurar un sistema de testing robusto para garantizar la calidad del código y prevenir regresiones en el componente Dynamic Schedule antes de publicarlo como paquete npm.

---

## 📦 Dependencias Instaladas

### Testing Core
```bash
pnpm add -D vitest @vitest/ui @vitest/coverage-v8
```
- **vitest**: Framework de testing moderno, rápido y compatible con Vite
- **@vitest/ui**: Interfaz web interactiva para ver tests
- **@vitest/coverage-v8**: Proveedor de cobertura de código usando V8

### React Testing
```bash
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```
- **@testing-library/react**: Utilidades para testear componentes React
- **@testing-library/jest-dom**: Matchers personalizados como `.toBeInTheDocument()`
- **@testing-library/user-event**: Simulación realista de interacciones de usuario
- **jsdom**: Implementación de DOM para Node.js (necesario para tests de componentes)

---

## ⚙️ Archivos de Configuración Creados

### 1. `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,              // Permite usar describe, it, expect sin imports
    environment: 'jsdom',       // Usa jsdom para simular el DOM
    setupFiles: ['./src/test/setup.ts'],  // Setup global
    coverage: {
      provider: 'v8',           // Motor de coverage
      reporter: ['text', 'json', 'html'],  // Formatos de reporte
      exclude: [                // Archivos a excluir del coverage
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'dist/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // Alias para imports
    },
  },
});
```

**Explicación**:
- `globals: true`: No necesitas importar `describe`, `it`, `expect` en cada test
- `environment: 'jsdom'`: Simula un navegador para tests de componentes React
- `setupFiles`: Ejecuta código antes de cada test (setup de jest-dom)
- `coverage`: Configura reportes de cobertura en 3 formatos diferentes

### 2. `src/test/setup.ts`
```typescript
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

**Explicación**:
- Extiende `expect` con matchers de jest-dom (`.toBeInTheDocument()`, `.toHaveClass()`, etc.)
- `cleanup()`: Limpia el DOM después de cada test para evitar contaminación entre tests

### 3. Scripts en `package.json`
```json
{
  "scripts": {
    "test": "vitest",                    // Watch mode - ideal para desarrollo
    "test:ui": "vitest --ui",           // Interfaz visual
    "test:run": "vitest run",           // Ejecutar una vez - ideal para CI
    "test:coverage": "vitest run --coverage"  // Con reporte de cobertura
  }
}
```

### 4. `.gitignore` actualizado
```gitignore
# Test coverage
coverage
```
Para no versionar los reportes de cobertura (son generados automáticamente).

---

## ✅ Tests Implementados

### Estructura de Archivos
Los tests están ubicados junto al código que testean (colocation):
```
src/modules/dynamic-schedule/
├── lib/
│   ├── calculations.ts
│   ├── calculations.test.ts  ← Test
│   ├── utils.ts
│   └── utils.test.ts          ← Test
└── hooks/
    ├── use-ctrl-listener.ts
    ├── use-ctrl-listener.test.ts      ← Test
    ├── use-escape-listener.ts
    ├── use-escape-listener.test.ts    ← Test
    ├── use-items-by-column.ts
    └── use-items-by-column.test.ts    ← Test
```

---

## 📝 Tests Detallados

### 1. `lib/calculations.test.ts` (38 tests - 100% coverage)

**Archivo testeado**: Funciones matemáticas para cálculos de posición en el schedule.

#### `calculatePixelPosition` (4 tests)
Convierte índices de grilla (columna, fila) a posición en píxeles.

```typescript
// Ejemplo de test
it('should calculate pixel position for positive indices', () => {
  const result = calculatePixelPosition({
    columnIndex: 3,
    rowIndex: 5,
    columnWidth: 100,
    rowHeight: 50,
  });

  expect(result).toEqual({ x: 300, y: 250 });
  // 3 columnas * 100px = 300px
  // 5 filas * 50px = 250px
});
```

**Tests**:
- Posición en origen (0,0)
- Posiciones positivas
- Diferentes dimensiones de celda
- Manejo de dimensiones cero

#### `calculateGridPosition` (5 tests)
Convierte posición en píxeles a índices de grilla.

```typescript
it('should floor decimal values', () => {
  const result = calculateGridPosition({
    pixelX: 149,   // Cae en columna 1
    pixelY: 99,    // Cae en fila 1
    columnWidth: 100,
    rowHeight: 50,
  });

  expect(result).toEqual({ columnIndex: 1, rowIndex: 1 });
});
```

**Tests**:
- Posición en origen
- Píxeles positivos
- Redondeo hacia abajo (floor)
- Valores negativos
- Píxeles exactos en líneas de grilla

#### `calculateMovementDelta` (6 tests)
Calcula la diferencia entre dos posiciones.

```typescript
it('should calculate mixed delta', () => {
  const result = calculateMovementDelta({
    fromColumnIndex: 3,
    fromRowIndex: 1,
    toColumnIndex: 1,
    toRowIndex: 4,
  });

  expect(result).toEqual({ deltaColumn: -2, deltaRow: 3 });
  // Se movió 2 columnas hacia atrás, 3 filas hacia adelante
});
```

**Tests**:
- Sin movimiento (delta 0)
- Movimiento hacia adelante
- Movimiento hacia atrás
- Movimiento mixto (diagonal)
- Movimiento solo horizontal
- Movimiento solo vertical

#### `validatePositionBounds` (10 tests)
Verifica si una posición está dentro de los límites.

```typescript
it('should return false for negative column index', () => {
  const result = validatePositionBounds({
    columnIndex: -1,
    rowIndex: 0,
    columns: mockColumns,  // 3 columnas
    rows: mockRows,        // 4 filas
  });

  expect(result).toBe(false);
});
```

**Tests**:
- Posición válida en origen
- Posición válida dentro de límites
- Posición en límites máximos
- Índice de columna negativo
- Índice de fila negativo
- Columna fuera de límites
- Fila fuera de límites
- Ambos índices fuera de límites
- Arrays vacíos

#### `calculateRelativePosition` (5 tests)
Calcula posición relativa entre dos rectángulos DOM.

```typescript
it('should calculate positive relative position', () => {
  const targetRect = new DOMRect(150, 100, 200, 150);
  const baseRect = new DOMRect(50, 30, 200, 150);

  const result = calculateRelativePosition({
    targetRect,
    baseRect,
  });

  expect(result).toEqual({ top: 70, left: 100 });
  // 100 - 30 = 70 (top)
  // 150 - 50 = 100 (left)
});
```

**Tests**:
- Rectángulos idénticos
- Posición relativa positiva
- Posición relativa negativa
- Rectángulos en origen
- Solo usa top/left (ignora width/height)

#### `hasMovement` (8 tests)
Verifica si hubo movimiento (delta no cero).

```typescript
it('should return false for no movement', () => {
  const result = hasMovement({ deltaColumn: 0, deltaRow: 0 });
  expect(result).toBe(false);
});

it('should return true for horizontal movement only', () => {
  const result = hasMovement({ deltaColumn: 3, deltaRow: 0 });
  expect(result).toBe(true);
});
```

**Tests**:
- Sin movimiento
- Solo horizontal
- Solo vertical
- Diagonal
- Movimiento negativo horizontal
- Movimiento negativo vertical
- Diagonal negativa
- Signos mixtos

---

### 2. `lib/utils.test.ts` (20 tests - 100% coverage)

#### `cn` (8 tests)
Utilidad para combinar clases de Tailwind (usa clsx + tailwind-merge).

```typescript
it('should merge conflicting Tailwind classes', () => {
  const result = cn('px-2', 'px-4');
  expect(result).toBe('px-4');
  // px-4 reemplaza px-2 (tailwind-merge inteligente)
});

it('should handle conditional classes', () => {
  const isActive = true;
  const isDisabled = false;

  const result = cn(
    'base-class',
    isActive && 'active',
    isDisabled && 'disabled'
  );

  expect(result).toBe('base-class active');
});
```

**Tests**:
- Merge simple
- Clases condicionales
- Conflictos de Tailwind (px-2 vs px-4)
- Arrays de clases
- Objetos con booleanos
- Input vacío
- null y undefined
- Merge complejo

#### `generateUUID` (4 tests)
Genera UUIDs únicos usando crypto.randomUUID().

```typescript
it('should generate a valid UUID', () => {
  const uuid = generateUUID();
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  expect(uuid).toMatch(uuidRegex);
});

it('should generate unique UUIDs', () => {
  const uuid1 = generateUUID();
  const uuid2 = generateUUID();

  expect(uuid1).not.toBe(uuid2);
});
```

**Tests**:
- Formato válido de UUID v4
- Unicidad
- Tipo string
- Longitud correcta (36 caracteres)

#### `mapToArray` (8 tests)
Convierte Map a Array de valores.

```typescript
it('should convert Map with object values to array', () => {
  const map = new Map<string, TestObject>([
    ['1', { id: '1', name: 'First' }],
    ['2', { id: '2', name: 'Second' }],
  ]);

  const result = mapToArray(map);

  expect(result).toEqual([
    { id: '1', name: 'First' },
    { id: '2', name: 'Second' },
  ]);
});
```

**Tests**:
- Map vacío
- Valores primitivos
- Valores string
- Valores objeto
- Preserva orden de inserción
- Map con una entrada
- Objetos complejos anidados
- Tipos genéricos

---

### 3. `hooks/use-ctrl-listener.test.ts` (6 tests)

Hook que escucha la tecla Control para multi-selección.

```typescript
it('should call onCtrl(true) when Control key is pressed', () => {
  const onCtrl = vi.fn();  // Mock function
  renderHook(() => useCtrlListener({ onCtrl }));

  const event = new KeyboardEvent('keydown', { key: 'Control' });
  window.dispatchEvent(event);

  expect(onCtrl).toHaveBeenCalledWith(true);
  expect(onCtrl).toHaveBeenCalledTimes(1);
});
```

**Tests**:
- Keydown dispara onCtrl(true)
- Keyup dispara onCtrl(false)
- Ciclo completo press/release
- No reacciona a otras teclas
- Limpia event listeners al desmontar
- Múltiples presses

**Conceptos de Testing**:
- `vi.fn()`: Crea una función mock que registra llamadas
- `renderHook()`: Renderiza un hook en un componente de prueba
- `window.dispatchEvent()`: Simula eventos del navegador
- `.toHaveBeenCalledWith()`: Verifica argumentos de llamadas

---

### 4. `hooks/use-escape-listener.test.ts` (6 tests)

Similar a useCtrlListener pero para la tecla Escape (deseleccionar).

```typescript
it('should handle Escape key press and release cycle', () => {
  const onEscape = vi.fn();
  renderHook(() => useEscapeListener({ onEscape }));

  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));

  expect(onEscape).toHaveBeenCalledTimes(2);
  expect(onEscape).toHaveBeenNthCalledWith(1, true);
  expect(onEscape).toHaveBeenNthCalledWith(2, false);
});
```

**Tests**: Misma estructura que useCtrlListener.

---

### 5. `hooks/use-items-by-column.test.ts` (8 tests)

Hook que agrupa items por columnId (usando useMemo y reduce).

```typescript
it('should group items by columnId', () => {
  const items: Item<TestData>[] = [
    { id: 'item-1', columnId: 'col-1', rowIndex: 0, rowSpan: 1, data: {...} },
    { id: 'item-2', columnId: 'col-1', rowIndex: 1, rowSpan: 1, data: {...} },
    { id: 'item-3', columnId: 'col-2', rowIndex: 0, rowSpan: 1, data: {...} },
  ];

  const { result } = renderHook(() => useItemsByColumn(items));

  expect(result.current.itemsByColumn).toEqual({
    'col-1': [items[0], items[1]],
    'col-2': [items[2]],
  });
});
```

**Tests**:
- Array vacío
- Agrupación correcta
- Un item por columna
- Todos en misma columna
- Preserva orden
- Diferentes rowSpan
- Actualización cuando cambian items
- Tipos genéricos

**Conceptos**:
- `result.current`: Accede al valor actual del hook
- `rerender()`: Re-renderiza el hook con nuevas props
- Testing de memoization: Verifica que se actualice cuando deba

---

## 📊 Coverage Report

### Cómo generarlo
```bash
pnpm test:coverage
```

### Formatos de salida
1. **Terminal (text)**: Resumen en consola
2. **JSON**: Para CI/CD y análisis programático
3. **HTML**: Informe visual navegable en `coverage/index.html`

### Coverage actual
```
File               | % Stmts | % Branch | % Funcs | % Lines
-------------------|---------|----------|---------|----------
lib/calculations.ts|   100   |   100    |   100   |   100
lib/utils.ts       |   100   |   100    |   100   |   100
hooks (3 tested)   |   100   |   100    |   100   |   100
```

**Objetivo**: 80%+ coverage total antes de publicar.

---

## 🧠 Conceptos Clave de Testing

### 1. Arrange-Act-Assert (AAA Pattern)
```typescript
it('should do something', () => {
  // Arrange: Preparar datos
  const input = { value: 10 };

  // Act: Ejecutar función
  const result = myFunction(input);

  // Assert: Verificar resultado
  expect(result).toBe(20);
});
```

### 2. Mocking
```typescript
// Mock de función
const mockFn = vi.fn();
mockFn(1, 2);
expect(mockFn).toHaveBeenCalledWith(1, 2);

// Mock de retorno
mockFn.mockReturnValue(42);
```

### 3. Testing de Hooks
```typescript
const { result, rerender, unmount } = renderHook(
  ({ value }) => useMyHook(value),
  { initialProps: { value: 1 } }
);

// Acceder al valor
console.log(result.current);

// Re-renderizar con nuevas props
rerender({ value: 2 });

// Limpiar
unmount();
```

### 4. Testing de Componentes
```typescript
import { render, screen, fireEvent } from '@testing-library/react';

it('should handle click', () => {
  render(<Button onClick={mockFn}>Click me</Button>);

  const button = screen.getByText('Click me');
  fireEvent.click(button);

  expect(mockFn).toHaveBeenCalled();
});
```

### 5. Matchers Comunes

**Jest-DOM** (para componentes):
- `.toBeInTheDocument()`
- `.toHaveClass('className')`
- `.toHaveAttribute('attr', 'value')`
- `.toBeVisible()`
- `.toBeDisabled()`

**Vitest** (para lógica):
- `.toBe()` - Igualdad estricta (===)
- `.toEqual()` - Igualdad profunda (objetos/arrays)
- `.toBeTruthy()` / `.toBeFalsy()`
- `.toHaveLength(n)`
- `.toContain(item)`
- `.toThrow()`

---

## 🎯 Próximos Pasos

### Tests Pendientes (según roadmap)

#### 1. Tests de Stores (Zustand)
```typescript
// Ejemplo de test de store
import { renderHook, act } from '@testing-library/react';
import { useDynamicScheduleStore } from './store';

it('should update columnWidth', () => {
  const { result } = renderHook(() => useDynamicScheduleStore());

  act(() => {
    result.current.setColumnWidth(150);
  });

  expect(result.current.columnWidth).toBe(150);
});
```

Stores a testear:
- `dynamic-schedule-store.ts`
- `dynamic-schedule-selected-items-store.ts`
- `dynamic-schedule-movement-store.ts`
- `dynamic-schedule-scroll-indicator-store.ts`

#### 2. Tests de Componentes Complejos

**DynamicScheduleItem** (item.tsx):
- Renderizado con ScheduleItemComponent
- Multi-selección (ctrl + click)
- Indicador visual de selección
- Drag handles

**Container** (container.tsx):
- DndContext setup
- onDragStart/onDragEnd handlers
- Multi-drag logic
- Boundaries validation

**Content** (content.tsx):
- Renderizado de columnas y filas
- Scroll indicators
- Current line
- Item positioning

#### 3. Integration Tests

Tests que verifican flujos completos:
```typescript
it('should allow multi-selecting items and dragging them together', () => {
  // 1. Render component
  // 2. Press Ctrl
  // 3. Click multiple items
  // 4. Drag one of them
  // 5. Verify all selected items moved
});
```

#### 4. E2E Tests (Playwright)

```typescript
test('user can drag and drop schedule item', async ({ page }) => {
  await page.goto('http://localhost:5173');

  const item = page.locator('[data-testid="schedule-item-1"]');
  await item.dragTo(page.locator('[data-testid="drop-zone-2"]'));

  // Verify item moved
  await expect(item).toHaveAttribute('data-column', '2');
});
```

---

## 📚 Recursos de Aprendizaje

### Documentación Oficial
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library - Queries](https://testing-library.com/docs/queries/about)

### Buenas Prácticas
- [Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details)

### Videos
- [React Testing Library Tutorial](https://www.youtube.com/watch?v=JKOwJUM4_RM)
- [Vitest Crash Course](https://www.youtube.com/watch?v=7f-71kYhK00)

---

## 🔧 Troubleshooting

### Tests lentos
```typescript
// Usar vi.useFakeTimers() para tests con delays
it('should debounce', () => {
  vi.useFakeTimers();
  // ...
  vi.advanceTimersByTime(1000);
  vi.useRealTimers();
});
```

### Memory leaks
```typescript
// Siempre limpiar después de tests
afterEach(() => {
  cleanup(); // Ya está en setup.ts
  vi.clearAllMocks();
});
```

### Tests flakey (intermitentes)
```typescript
// Usar waitFor para elementos asíncronos
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

---

## 📝 Checklist de Testing

Al crear nuevos tests, verifica:

- [ ] El test tiene un nombre descriptivo
- [ ] Sigue el patrón AAA (Arrange-Act-Assert)
- [ ] Testea un solo comportamiento
- [ ] Es independiente (no depende de otros tests)
- [ ] Es determinístico (siempre da el mismo resultado)
- [ ] Es rápido (< 100ms idealmente)
- [ ] Limpia después de sí mismo
- [ ] Usa mocks cuando sea necesario
- [ ] Cubre casos edge (límites, vacíos, null, etc.)

---

## 🎉 Resumen Final

**Logros**:
- ✅ 78 tests implementados
- ✅ 100% coverage en funciones críticas
- ✅ Setup completo y documentado
- ✅ Scripts de npm configurados
- ✅ Coverage reporting funcionando

**Próximos hitos**:
1. Alcanzar 80%+ coverage total
2. Agregar integration tests
3. Considerar E2E tests con Playwright

**Comandos útiles**:
```bash
pnpm test              # Desarrollo (watch mode)
pnpm test:ui           # Interfaz visual
pnpm test:run          # CI/CD
pnpm test:coverage     # Ver cobertura
```
