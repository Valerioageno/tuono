/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig, mergeConfig } from 'vitest/config'
import { tanstackBuildConfig } from '@tanstack/config/build'
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
  tanstackBuildConfig({
    entry: [
      './src/index.ts',
      './src/build/index.ts',
      './src/ssr/index.tsx',
      './src/hydration/index.tsx',
    ],
    srcDir: './src',
  }),
)
