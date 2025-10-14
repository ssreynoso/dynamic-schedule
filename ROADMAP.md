# Dynamic Schedule - Roadmap

Este documento describe las mejoras y próximos pasos para convertir Dynamic Schedule en un paquete npm profesional.

## 1. Testing

### Unit Tests
- **Framework**: Vitest (ya integrado con Vite)
- **Testing Library**: React Testing Library para componentes
- **Cobertura objetivo**: 80%+

#### Tests prioritarios
- ✅ Drag & drop de items individuales
- ✅ Multi-selección y drag múltiple
- ✅ Validaciones de límites (boundaries)
- ✅ Cálculo de deltas y posiciones
- ✅ Auto-deselección después de drag
- ✅ Comportamiento con `getItemCanDragOnX`
- ✅ Manejo de errores en `onChange`

### Integration Tests
- Flujos completos de usuario
- Interacción entre múltiples componentes
- Estados complejos (multi-drag con restricciones)

### E2E Tests
- **Framework**: Playwright o Cypress
- Casos de uso reales
- Drag and drop visual
- Multi-browser testing

## 2. Storybook

### Setup
- Instalar Storybook 8
- Configurar con Vite
- Integrar con Tailwind CSS

### Stories a crear
- **Basic**: Ejemplo simple con datos mínimos
- **Multi-column**: Schedule con múltiples columnas
- **Restricted drag**: Items con drag restringido (solo X o solo Y)
- **Custom components**: Con componentes personalizados
- **Multi-selection**: Demostración de selección múltiple
- **Scroll indicators**: Con auto-scroll habilitado
- **Empty states**: Sin items, sin columnas, etc.
- **Edge cases**: Límites, overlaps, etc.

### Controles interactivos
- Todas las props configurables
- Toggle de features (scroll, multi-select)
- Ajuste de dimensiones (width, height)
- Datos dinámicos (agregar/quitar items)

### Documentación
- MDX docs para cada componente
- Guía de uso y mejores prácticas
- Ejemplos de código
- Props API documentation

## 3. Mejoras del componente

### Accesibilidad (A11y)
- [ ] Keyboard navigation (Tab, Arrow keys, Enter, Escape)
- [ ] ARIA labels y roles
- [ ] Focus management durante drag
- [ ] Screen reader support
- [ ] High contrast mode support

### Performance
- [ ] Memoization de componentes pesados
- [ ] Virtualization para schedules grandes (react-window/react-virtual)
- [ ] Optimizar re-renders con React.memo
- [ ] Debounce de eventos frecuentes
- [ ] Lazy loading de componentes

### Features adicionales
- [ ] **Drag preview personalizable**: Permitir customizar el overlay completamente
- [ ] **Callbacks extendidos**:
  - `onDragStart(item)`
  - `onDragMove(item, position)`
  - `onDragEnd(item, position)`
  - `onSelectionChange(selectedItems)`
  - `onItemClick(item)`
  - `onItemDoubleClick(item)`
- [ ] **Undo/Redo**: Historial de cambios
- [ ] **Multi-row drag**: Drag de items que ocupan múltiples filas
- [ ] **Resize items**: Permitir cambiar rowSpan con drag
- [ ] **Copy/Paste**: Duplicar items seleccionados
- [ ] **Delete**: Eliminar items seleccionados (Del key)
- [ ] **Snap to grid**: Forzar posiciones en la grilla
- [ ] **Collision detection**: Prevenir overlaps
- [ ] **Custom modifiers**: Para personalizar comportamiento de drag
- [ ] **Touch support**: Optimizar para dispositivos móviles
- [ ] **Animations**: Transiciones suaves en movimientos

### Customización
- [ ] Themes/variants (light/dark)
- [ ] CSS variables para colores y espaciado
- [ ] Slots para customizar partes del componente
- [ ] Headless mode (sin estilos, solo lógica)

## 4. Package Setup

### Configuración como Library
- [ ] Vite library mode configuration
- [ ] Multiple entry points (main, types, styles)
- [ ] Tree-shaking optimization
- [ ] Bundle size optimization
- [ ] Source maps generation

### Exports
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./dist/styles.css"
  }
}
```

### Documentación
- [ ] README completo con ejemplos
- [ ] CHANGELOG.md
- [ ] CONTRIBUTING.md
- [ ] LICENSE
- [ ] API documentation (TypeDoc)
- [ ] Playground/demo site

### Publishing
- [ ] Configurar `package.json` para npm
- [ ] Versionado semántico
- [ ] Git tags automáticos
- [ ] Changelog automático (conventional commits)
- [ ] npm provenance

### CI/CD
- [ ] GitHub Actions workflows:
  - Lint & TypeScript check
  - Run tests
  - Build
  - Publish to npm (manual/automatic)
  - Deploy Storybook to GitHub Pages
- [ ] Dependabot para dependencias
- [ ] PR checks automáticos
- [ ] Code coverage reporting

## 5. Refactoring Inmediato

### Organización del código
- [ ] Separar lógica de cálculo en `lib/calculations.ts`:
  - `calculateItemPosition()`
  - `calculateDelta()`
  - `validateBoundaries()`
  - `getRelativePosition()`
- [ ] Extraer constantes a `lib/constants.ts`
- [ ] Utils para manejo de Map/Set
- [ ] Tipos en archivos separados si crecen

### Limpieza
- [ ] Eliminar console.logs
- [ ] Remover código comentado
- [ ] Revisar y eliminar `unknown` types
- [ ] Validar que no haya `any` types
- [ ] Consistent naming conventions

### Documentación de código
- [ ] JSDoc en funciones complejas
- [ ] Comentarios para lógica no obvia
- [ ] Ejemplos de uso en componentes principales
- [ ] Type documentation

### Error handling
- [ ] Validaciones de props
- [ ] Error boundaries
- [ ] Mensajes de error descriptivos
- [ ] Warnings en dev mode para mal uso

## 6. Developer Experience

### Tooling
- [ ] ESLint configurado
- [ ] Prettier configurado
- [ ] Husky + lint-staged
- [ ] Commitlint (conventional commits)

### Debugging
- [ ] Debug mode con logs detallados
- [ ] DevTools integration (React DevTools)
- [ ] Performance profiling hooks

### Examples
- [ ] Carpeta `/examples` con casos de uso
- [ ] CodeSandbox templates
- [ ] StackBlitz templates

## Priorización sugerida

### Fase 1 - Foundations (Sprint 1-2)
1. Setup de testing básico
2. Refactoring inmediato
3. Configuración de package

### Fase 2 - Quality (Sprint 3-4)
1. Tests completos
2. Setup de Storybook
3. CI/CD básico

### Fase 3 - Enhancement (Sprint 5-6)
1. Accesibilidad
2. Performance optimizations
3. Features adicionales prioritarios

### Fase 4 - Polish (Sprint 7+)
1. Documentación completa
2. Examples y playground
3. First npm release!

---

## Notas

- Mantener compatibilidad con versiones anteriores (semantic versioning)
- Documentar breaking changes claramente
- Considerar feedback de usuarios early adopters
- Iterar rápido en primeras versiones (0.x.x)
