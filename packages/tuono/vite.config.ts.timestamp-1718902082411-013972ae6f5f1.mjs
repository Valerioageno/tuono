// vite.config.ts
import {
  defineConfig,
  mergeConfig,
} from 'file:///home/valerio/Documents/tuono/node_modules/.pnpm/vitest@1.6.0_@types+node@20.12.11_jsdom@24.1.0/node_modules/vitest/dist/config.js'
import { tanstackBuildConfig } from 'file:///home/valerio/Documents/tuono/node_modules/.pnpm/@tanstack+config@0.7.0_@types+node@20.12.11_esbuild@0.21.1_rollup@4.18.0_typescript@5.4.5_vite@5.2.11/node_modules/@tanstack/config/src/build/index.js'
import react from 'file:///home/valerio/Documents/tuono/node_modules/.pnpm/@vitejs+plugin-react@4.2.1_vite@5.2.11/node_modules/@vitejs/plugin-react/dist/index.mjs'
var config = defineConfig({
  plugins: [react()],
  test: {
    name: 'react-router',
    watch: true,
    environment: 'jsdom',
    globals: true,
  },
})
var vite_config_default = mergeConfig(
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
export { vite_config_default as default }
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS92YWxlcmlvL0RvY3VtZW50cy90dW9uby9wYWNrYWdlcy90dW9ub1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvdmFsZXJpby9Eb2N1bWVudHMvdHVvbm8vcGFja2FnZXMvdHVvbm8vdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvdmFsZXJpby9Eb2N1bWVudHMvdHVvbm8vcGFja2FnZXMvdHVvbm8vdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGUvY2xpZW50XCIgLz5cbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbWVyZ2VDb25maWcgfSBmcm9tICd2aXRlc3QvY29uZmlnJ1xuaW1wb3J0IHsgdGFuc3RhY2tCdWlsZENvbmZpZyB9IGZyb20gJ0B0YW5zdGFjay9jb25maWcvYnVpbGQnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5cbmNvbnN0IGNvbmZpZyA9IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgdGVzdDoge1xuICAgIG5hbWU6ICdyZWFjdC1yb3V0ZXInLFxuICAgIHdhdGNoOiB0cnVlLFxuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgIGdsb2JhbHM6IHRydWUsXG4gIH0sXG59KVxuXG5leHBvcnQgZGVmYXVsdCBtZXJnZUNvbmZpZyhcbiAgY29uZmlnLFxuICB0YW5zdGFja0J1aWxkQ29uZmlnKHtcbiAgICBlbnRyeTogW1xuICAgICAgJy4vc3JjL2luZGV4LnRzJyxcbiAgICAgICcuL3NyYy9idWlsZC9pbmRleC50cycsXG4gICAgICAnLi9zcmMvc3NyL2luZGV4LnRzeCcsXG4gICAgICAnLi9zcmMvaHlkcmF0aW9uL2luZGV4LnRzeCcsXG4gICAgXSxcbiAgICBzcmNEaXI6ICcuL3NyYycsXG4gIH0pLFxuKVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUVBLFNBQVMsY0FBYyxtQkFBbUI7QUFDMUMsU0FBUywyQkFBMkI7QUFDcEMsT0FBTyxXQUFXO0FBRWxCLElBQU0sU0FBUyxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLE1BQU07QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQLGFBQWE7QUFBQSxJQUNiLFNBQVM7QUFBQSxFQUNYO0FBQ0YsQ0FBQztBQUVELElBQU8sc0JBQVE7QUFBQSxFQUNiO0FBQUEsRUFDQSxvQkFBb0I7QUFBQSxJQUNsQixPQUFPO0FBQUEsTUFDTDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxFQUNWLENBQUM7QUFDSDsiLAogICJuYW1lcyI6IFtdCn0K
