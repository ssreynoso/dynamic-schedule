# Conversión a Paquete NPM - Dynamic Schedule

Este documento detalla todos los cambios realizados para convertir el componente Dynamic Schedule en un paquete npm consumible.

## Fecha de conversión
15 de octubre de 2025

---

## 1. Punto de Entrada del Paquete

### Archivo creado: `src/modules/dynamic-schedule/index.ts`

Este archivo actúa como el punto de entrada principal del paquete, exportando todos los elementos públicos que los consumidores necesitan.

**Exportaciones incluidas:**
- Componente principal `DynamicSchedule`
- Tipos TypeScript: `Column`, `Row`, `Item`, `DynamicScheduleProps`, etc.
- Hooks personalizados: `useItemsByColumn`, `useCoincidencesByColumn`
- Stores de Zustand para acceso avanzado
- Funciones utilitarias: `getCoincidences`, funciones de cálculo, constantes

**Por qué es necesario:**
Los paquetes npm necesitan un único archivo de entrada que defina la API pública. Esto permite importaciones limpias como `import { DynamicSchedule } from 'dynamic-schedule'`.

---

## 2. Configuración de Vite para Modo Librería

### Archivo modificado: `vite.config.ts`

**Cambios realizados:**
```typescript
// Agregado import de path y plugin dts
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// Nueva configuración de plugins
plugins: [
  react(),
  tailwindcss(),
  dts({
    include: ['src/modules/dynamic-schedule/**/*'],
    exclude: ['**/*.test.ts', '**/*.test.tsx'],
    tsconfigPath: './tsconfig.lib.json',
  }),
]

// Nueva configuración de build
build: {
  lib: {
    entry: resolve(__dirname, 'src/modules/dynamic-schedule/index.ts'),
    name: 'DynamicSchedule',
    formats: ['es', 'cjs'],
    fileName: (format) => `dynamic-schedule.${format === 'es' ? 'js' : 'cjs'}`,
  },
  rollupOptions: {
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@dnd-kit/core',
      '@dnd-kit/modifiers',
      '@radix-ui/react-separator',
      'zustand',
      'clsx',
      'lucide-react',
      'tailwindcss',
    ],
    output: {
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react/jsx-runtime': 'jsxRuntime',
      },
    },
  },
}
```

**Por qué es necesario:**
- **Modo librería**: Genera archivos optimizados para distribución (no para ejecutar una app)
- **Múltiples formatos**: ESM (moderno) y CommonJS (compatibilidad)
- **Dependencias externas**: No incluye React, etc. en el bundle (se esperan como peerDependencies)
- **Plugin dts**: Genera automáticamente archivos de declaración TypeScript

### Paquete instalado:
```bash
pnpm add -D vite-plugin-dts
```

---

## 3. Configuración de TypeScript para Librería

### Archivo creado: `tsconfig.lib.json`

```json
{
  "extends": "./tsconfig.app.json",
  "compilerOptions": {
    "noEmit": false,
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": true,
    "outDir": "./dist/types"
  },
  "include": ["src/modules/dynamic-schedule/**/*"],
  "exclude": ["**/*.test.ts", "**/*.test.tsx", "src/test/**/*"]
}
```

**Por qué es necesario:**
- Genera archivos `.d.ts` (declaraciones de tipos) para soporte TypeScript
- Excluye archivos de test del paquete final
- Los consumidores obtienen autocompletado e IntelliSense

---

## 4. Configuración de package.json

### Cambios en metadatos:

```json
{
  "name": "dynamic-schedule",
  "version": "0.1.0",
  "type": "module",
  "description": "A dynamic schedule component library for React with drag & drop functionality",
  "author": "Your Name",
  "license": "MIT",
  "keywords": [
    "react",
    "schedule",
    "calendar",
    "drag-and-drop",
    "component",
    "typescript"
  ]
}
```

### Puntos de entrada del paquete:

```json
{
  "main": "./dist/dynamic-schedule.cjs",
  "module": "./dist/dynamic-schedule.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/dynamic-schedule.js"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/dynamic-schedule.cjs"
      }
    }
  },
  "files": [
    "dist"
  ]
}
```

**Explicación:**
- `main`: Archivo CommonJS (Node.js antiguo, herramientas de build)
- `module`: Archivo ESM (bundlers modernos como Webpack/Vite)
- `types`: Archivo de declaraciones TypeScript
- `exports`: Define cómo se resuelven las importaciones (soporte moderno)
- `files`: Solo incluye la carpeta `dist` en el paquete publicado

### PeerDependencies:

```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "@dnd-kit/core": "^6.0.0",
    "@dnd-kit/modifiers": "^7.0.0 || ^8.0.0 || ^9.0.0",
    "zustand": "^4.0.0 || ^5.0.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.400.0"
  }
}
```

**Por qué peerDependencies:**
- Evita duplicar React en proyectos de los consumidores
- Reduce el tamaño del paquete dramáticamente
- Previene problemas de "múltiples instancias de React"
- Los usuarios instalan estas dependencias según sus necesidades

### Dependencies actualizadas:

```json
{
  "dependencies": {
    "@radix-ui/react-separator": "^1.1.2"
  }
}
```

Solo se mantiene `@radix-ui/react-separator` como dependencia directa ya que es específica del componente.

### DevDependencies movidas:

Todas las anteriores dependencies se movieron a devDependencies para desarrollo local:
- react, react-dom
- @dnd-kit/core, @dnd-kit/modifiers
- zustand, clsx, lucide-react
- tailwindcss, @tailwindcss/vite

### Scripts actualizados:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:types": "tsc -p tsconfig.lib.json",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "prepublishOnly": "pnpm build"
  }
}
```

**Cambios:**
- `build`: Simplificado (vite-plugin-dts maneja los tipos)
- `build:types`: Script manual si es necesario
- `prepublishOnly`: Hook que ejecuta build automáticamente antes de `npm publish`

---

## 5. Archivo .npmignore

### Archivo creado: `.npmignore`

Excluye del paquete publicado:
- Código fuente (`src/`)
- Archivos de desarrollo (configs, tests)
- Documentación interna (`CLAUDE.md`)
- Archivos de demo (`index.html`, `public/`)
- Archivos específicos de la app (`App.tsx`, `main.tsx`)

**Por qué es importante:**
- Reduce el tamaño del paquete
- Solo distribuye archivos compilados necesarios
- Protege código de ejemplo y configuraciones locales

---

## 6. README.md Completo

### Archivo modificado: `README.md`

Se creó documentación completa incluyendo:
- Descripción de características
- Instrucciones de instalación
- Lista de peer dependencies
- Ejemplo de uso básico
- Documentación de todas las props
- Definiciones de tipos
- Características avanzadas (multi-selección, scroll indicators)
- Instrucciones de styling
- Soporte TypeScript

**Por qué es crítico:**
- Primera impresión en npm
- Guía para usuarios nuevos
- Reduce preguntas de soporte

---

## 7. Estructura del Paquete Generado

Después de ejecutar `pnpm build`, se genera:

```
dist/
├── dynamic-schedule.js          # 91.8 KB - Formato ESM
├── dynamic-schedule.cjs         # 37.9 KB - Formato CommonJS
├── index.d.ts                   # Tipos principales
├── index.d.ts.map              # Source map para tipos
├── components/                  # Declaraciones de tipos de componentes
│   ├── *.d.ts
│   └── *.d.ts.map
├── hooks/                       # Declaraciones de tipos de hooks
│   ├── *.d.ts
│   └── *.d.ts.map
├── stores/                      # Declaraciones de tipos de stores
│   ├── *.d.ts
│   └── *.d.ts.map
├── types/                       # Declaraciones de tipos base
│   ├── *.d.ts
│   └── *.d.ts.map
└── lib/                         # Declaraciones de utilidades
    ├── *.d.ts
    └── *.d.ts.map
```

**Tamaño del paquete:**
- Package size: 41.8 KB (comprimido)
- Unpacked size: 171.4 KB
- Total files: 65

---

## 8. Cómo Publicar el Paquete

### Paso 1: Actualizar información del autor

En `package.json`:
```json
"author": "Tu Nombre <tu@email.com>"
```

### Paso 2: Agregar repositorio (opcional pero recomendado)

```json
"repository": {
  "type": "git",
  "url": "https://github.com/tu-usuario/dynamic-schedule.git"
}
```

### Paso 3: Verificar el build

```bash
pnpm build
```

### Paso 4: Revisar qué se va a publicar

```bash
npm pack --dry-run
```

### Paso 5: Publicar a npm

```bash
# Login en npm (solo la primera vez)
npm login

# Publicar el paquete
npm publish

# O si necesitas marcar como público explícitamente:
npm publish --access public
```

---

## 9. Cómo Consumir el Paquete

### Instalación:

```bash
npm install dynamic-schedule
# o
pnpm add dynamic-schedule
# o
yarn add dynamic-schedule
```

### Instalar peer dependencies:

```bash
npm install react react-dom @dnd-kit/core @dnd-kit/modifiers zustand clsx lucide-react
```

### Uso en código:

```tsx
import { DynamicSchedule } from 'dynamic-schedule'
import type { Column, Row, Item } from 'dynamic-schedule'

// Tu código...
```

---

## 10. Ventajas de esta Configuración

### Para los Consumidores:
- ✅ Soporte completo de TypeScript con autocompletado
- ✅ Tree-shaking automático (solo importan lo que usan)
- ✅ Compatibilidad con ESM y CommonJS
- ✅ No duplica dependencias comunes (React, etc.)
- ✅ Tamaño de bundle optimizado

### Para el Desarrollo:
- ✅ Mantiene el entorno de desarrollo intacto
- ✅ Tests siguen funcionando normalmente
- ✅ Build automático antes de publicar
- ✅ Fácil de mantener y actualizar

---

## 11. Comandos Útiles

```bash
# Desarrollo local
pnpm dev

# Ejecutar tests
pnpm test

# Build del paquete
pnpm build

# Ver qué archivos se incluirán en el paquete
npm pack --dry-run

# Crear tarball local para testing
npm pack

# Publicar nueva versión
npm version patch  # o minor, o major
npm publish

# Ver información del paquete publicado
npm info dynamic-schedule
```

---

## 12. Versionado Semántico

Cuando publiques actualizaciones, usa versionado semántico (semver):

- **PATCH** (0.1.0 → 0.1.1): Bug fixes, sin cambios en la API
  ```bash
  npm version patch
  ```

- **MINOR** (0.1.0 → 0.2.0): Nuevas características, retrocompatible
  ```bash
  npm version minor
  ```

- **MAJOR** (0.1.0 → 1.0.0): Breaking changes
  ```bash
  npm version major
  ```

---

## 13. Checklist Pre-Publicación

Antes de cada publicación, verifica:

- [ ] `pnpm build` ejecuta sin errores
- [ ] `pnpm test` pasa todos los tests
- [ ] `pnpm lint` no tiene errores
- [ ] `npm pack --dry-run` muestra los archivos correctos
- [ ] README.md está actualizado
- [ ] CHANGELOG.md tiene la nueva versión documentada
- [ ] Version en package.json fue incrementada
- [ ] Cambios están commiteados en git
- [ ] Tag de versión creado en git

---

## 14. Troubleshooting

### Problema: "Module not found" al importar
**Solución:** Verifica que `exports` en package.json apunta a los archivos correctos

### Problema: "No types found"
**Solución:** Asegúrate que `types` en package.json apunta a `./dist/index.d.ts`

### Problema: Bundle demasiado grande
**Solución:** Verifica que todas las dependencias grandes estén en `external` en vite.config.ts

### Problema: Conflicto con estilos de Tailwind
**Solución:** Los consumidores deben configurar Tailwind para incluir el path del paquete:
```js
// tailwind.config.js del consumidor
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/dynamic-schedule/dist/**/*.js',
  ],
}
```

---

## Conclusión

El componente Dynamic Schedule ahora es un paquete npm completamente funcional, listo para ser publicado y consumido por otros proyectos. Todos los archivos de configuración, tipos, y documentación están en su lugar para proporcionar una excelente experiencia de desarrollo.
