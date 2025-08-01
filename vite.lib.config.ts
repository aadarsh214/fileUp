import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'FileUploadUI',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@radix-ui/react-slot'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@radix-ui/react-slot': 'RadixSlot'
        }
      }
    },
    outDir: 'dist',
    sourcemap: true
  }
}) 