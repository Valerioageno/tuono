import type { TuonoConfig } from 'tuono/config'
import { path } from 'tuono/config'

const config: TuonoConfig = {
	vite: {
		alias: {
			'@': path.join(__dirname, './src'),
		},
	},
}

export default config
