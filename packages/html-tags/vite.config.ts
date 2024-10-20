import { defineConfig, mergeConfig } from 'vitest/config'
import { tanstackBuildConfig } from '@tanstack/config/build'
import react from '@vitejs/plugin-react'

const config = defineConfig({
  plugins: [react()],
  test: {
    name: 'tuono-html-tags',
    watch: true,
    environment: 'jsdom',
    globals: true,
  },
})

export default mergeConfig(
  config,
  tanstackBuildConfig({
    entry: ['./src/index.ts', './src/server/index.ts'],
    srcDir: './src',
  }),
)
