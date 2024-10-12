/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig, mergeConfig } from 'vitest/config'
import { tanstackViteConfig } from '@tanstack/config/vite'
import react from '@vitejs/plugin-react'

const config = defineConfig({
  plugins: [react()],
})

export default mergeConfig(
  config,
  tanstackViteConfig({
    entry: [
      './src/index.ts',
      './src/build/index.ts',
      './src/ssr/index.tsx',
      './src/hydration/index.tsx',
    ],
    srcDir: './src',
  }),
)
