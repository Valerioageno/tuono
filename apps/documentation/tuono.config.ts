import type { TuonoConfig } from 'tuono/config'

const config: TuonoConfig = {
	vite: {
		alias: {
			'@': 'src',
			'@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
		},
	},
}

export default config
