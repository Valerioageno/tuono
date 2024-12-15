import type { TuonoConfig } from 'tuono/config'
import mdx from '@mdx-js/rollup'

const config: TuonoConfig = {
  vite: {
    alias: {
      '@': 'src',
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
    plugins: [
      { enforce: 'pre', ...mdx({ providerImportSource: '@mdx-js/react' }) },
    ],
  },
}

export default config
