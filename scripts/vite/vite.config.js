import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const pkgPath = path.resolve(__dirname, '../../packages')
const resolvePkgPath = (pkgName) => path.join(pkgPath, pkgName)

export default defineConfig({
  resolve: {
    alias: {
      'react': resolvePkgPath('react'),
      'react-dom': resolvePkgPath('react-dom'),
      'react-dom/client': path.join(resolvePkgPath('react-dom'), 'client'),
      'react/jsx-runtime': path.join(resolvePkgPath('react'), 'src/jsx.ts'),
      'shared': path.join(pkgPath, 'shared')
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    esbuildOptions: {
      jsx: 'automatic'
    }
  },
  build: {
    commonjsOptions: {
      include: [/react/, /react-dom/]
    }
  },
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: path.resolve(pkgPath, 'react')
    })
  ],
  define: {
    __DEV__: true,
    __TEST__: false
  }
})
