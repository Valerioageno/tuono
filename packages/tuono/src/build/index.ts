import { build, createServer, InlineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import ViteFsRouter from 'tuono-fs-router-vite-plugin'
import { LazyLoadingPlugin } from 'tuono-lazy-fn-vite-plugin'
import mdx from '@mdx-js/rollup'

const BASE_CONFIG: InlineConfig = {
  root: '.tuono',
  logLevel: 'silent',
  publicDir: '../public',
  cacheDir: 'cache',
  envDir: '../',
  optimizeDeps: {
    exclude: ['@mdx-js/react'],
  },
  plugins: [
    { enforce: 'pre', ...mdx({ providerImportSource: '@mdx-js/react' }) },
    // @ts-ignore: TS configuration issue.
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    ViteFsRouter(),
    LazyLoadingPlugin(),
  ],
}

const VITE_PORT = 3001

export function developmentSSRBundle() {
  ;(async () => {
    await build({
      ...BASE_CONFIG,
      build: {
        ssr: true,
        minify: false,
        outDir: 'server',
        emptyOutDir: true,
        rollupOptions: {
          input: './.tuono/server-main.tsx',
          // Silent all logs
          onLog() {},
          output: {
            entryFileNames: 'dev-server.js',
            format: 'iife',
          },
        },
      },
      ssr: {
        target: 'webworker',
        noExternal: true,
      },
    })
  })()
}

export function developmentCSRWatch() {
  ;(async () => {
    const server = await createServer({
      ...BASE_CONFIG,
      // Entry point for the development vite proxy
      base: '/vite-server/',

      server: {
        port: VITE_PORT,
        strictPort: true,
      },
      build: {
        manifest: true,
        emptyOutDir: true,
        rollupOptions: {
          input: './.tuono/client-main.tsx',
        },
      },
    })
    await server.listen()
  })()
}

export function buildProd() {
  ;(async () => {
    await build({
      ...BASE_CONFIG,
      build: {
        manifest: true,
        emptyOutDir: true,
        outDir: '../out/client',
        rollupOptions: {
          input: './.tuono/client-main.tsx',
        },
      },
    })

    await build({
      ...BASE_CONFIG,
      build: {
        ssr: true,
        minify: true,
        outDir: '../out/server',
        emptyOutDir: true,
        rollupOptions: {
          input: './.tuono/server-main.tsx',
          output: {
            entryFileNames: 'prod-server.js',
            format: 'iife',
          },
        },
      },
      ssr: {
        target: 'webworker',
        noExternal: true,
      },
    })
  })()
}
