import { TuonoConfig } from '../config'

export const loadConfig = async (): Promise<TuonoConfig> => {
  try {
    const configFile = await import(`${process.cwd()}/.tuono/config/config.js`)
    return configFile.default
  } catch {
    return {}
  }
}

export const blockingAsync = (callback: () => Promise<void>) => {
  ;(async () => {
    await callback()
  })()
}
