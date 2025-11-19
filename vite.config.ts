// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/arborix/root.ts'),
      name: 'Arborix',
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'cjs'}.js`,
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
        'framer-motion',
        'react-aria',
        'react-virtual',
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
          'react/jsx-runtime': 'jsxRuntime' 
        }
      }
    },
    sourcemap: true,
    minify: 'terser',
  },
});