module.exports = {
  apps: [
    {
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
}
