import { defineConfig } from '@opencloud-eu/extension-sdk'

export default defineConfig({
  name: 'ai-sidebar',
  build: {
    outDir: 'dist',
    target: 'esnext',
  },
})
