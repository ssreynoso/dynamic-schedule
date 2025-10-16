import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vite.dev/config/
export default defineConfig({
    server: {
        open: true
    },
    plugins: [
        react(),
        tailwindcss(),
        cssInjectedByJsPlugin(),
        dts({
            include: ['src/modules/dynamic-schedule/**/*'],
            exclude: ['**/*.test.ts', '**/*.test.tsx', '**/__tests__/**'],
            tsconfigPath: './tsconfig.lib.json',
        }),
    ],
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
    },
})
