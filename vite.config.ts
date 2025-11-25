import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      outDir: 'dist/types',
      rollupTypes: true,
      copyDtsFiles: true,
      staticImport: true,
      entryRoot: 'src/arborix-headless',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/arborix-headless/index.ts'),
      name: 'Arborix',
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'cjs'}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        '@dnd-kit/core',
        '@dnd-kit/sortable',
        '@dnd-kit/utilities',
        '@tanstack/react-virtual',
        'react-aria',
        'immer',
        'lodash-es',
        'nanoid',
        'zod',
        'ramda',
        'eventemitter3'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        preserveModules: false, // Mantenha como false para bundle único
      }
    },
    sourcemap: true,
    minify: 'terser',
  },
});