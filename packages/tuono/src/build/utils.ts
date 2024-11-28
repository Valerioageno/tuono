import { TuonoConfig } from '../config'

export const loadConfig = async (): Promise<TuonoConfig> => {
  try {
    const configFile = await import(`${process.cwd()}/.tuono/config/config.js`)
    return configFile.default
  } catch {
    console.error('Failed to load tuono.config.ts')
    return {}
  }
}

export const blockingAsync = (callback: () => Promise<void>) => {
  ;(async () => {
    await callback()
  })()
}
