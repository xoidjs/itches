import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import pathsConfig from './tsconfig.paths.json'

const { paths } = pathsConfig.compilerOptions

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: Object.entries(paths).map(([find, replacement]) => ({ 
      find, 
      replacement: path.resolve(__dirname, replacement[0]) 
    }))
  }
})
