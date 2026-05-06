import { defineConfig } from '@opencloud-eu/extension-sdk'

export default defineConfig({
  name: 'openclass-app',
  build: {
    outDir: 'dist',
    target: 'esnext',
  },
})
