/**
 * Return the string cleared by the config path
 */
const join = (base: string, folder: string): string => {
  return base.replace('.tuono/config', '').concat(folder.replace('./', ''))
}

export default {
  join,
}
