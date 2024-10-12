/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig, mergeConfig } from 'vitest/config'
import { tanstackViteConfig } from '@tanstack/config/vite'
import react from '@vitejs/plugin-react'

const config = defineConfig({
  plugins: [react()],
  test: {
    name: 'react-router',
    watch: true,
    environment: 'jsdom',
    globals: true,
  },
})

export default mergeConfig(
  config,
  tanstackViteConfig({
    entry: './src/index.ts',
    srcDir: './src',
  }),
)
