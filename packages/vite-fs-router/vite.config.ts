import { defineConfig } from 'vite'
import { preserveDirectives } from 'rollup-plugin-preserve-directives'
import { externalizeDeps } from 'vite-plugin-externalize-deps'
import dts from 'vite-plugin-dts'

const config = ({ entryRoot, include, exclude }) =>
  defineConfig({
    plugins: [
      externalizeDeps(),
      preserveDirectives(),
      dts({
        outDir: 'dist/esm',
        entryRoot,
        include,
        exclude,
        compilerOptions: {
          // @ts-expect-error
          module: 'esnext',
          declarationMap: false,
        },
        beforeWriteFile: (filePath, content) => {
          content = content.replace(
            /^(im|ex)port\s[\w{}*\s,]+from\s['"]\.\/[^.'"]+(?=['"];?$)/gm,
            '$&.js',
          )

          return { filePath, content }
        },
      }),
      dts({
        outDir: 'dist/cjs',
        entryRoot,
        include,
        exclude,
        compilerOptions: {
          // @ts-expect-error
          module: 'commonjs',
          declarationMap: false,
        },
        beforeWriteFile: (filePath, content) => {
          content = content.replace(
            /^(im|ex)port\s[\w{}*\s,]+from\s['"]\.\/[^.'"]+(?=['"];?$)/gm,
            '$&.cjs',
          )

          filePath = filePath.replace('.d.ts', '.d.cts')

          return { filePath, content }
        },
      }),
    ],
    build: {
      outDir: 'dist',
      minify: false,
      sourcemap: true,
      lib: {
        entry: entryRoot,
        formats: ['es', 'cjs'],
        fileName: (format) => {
          if (format === 'cjs') return 'cjs/[name].cjs'
          return 'esm/[name].js'
        },
      },
      rollupOptions: {
        output: {
          preserveModules: true,
        },
      },
    },
  })

export default config({
  entryRoot: './src/index.ts',
  include: './src',
})
