import { defineConfig } from '@opencloud-eu/extension-sdk'

export default defineConfig({
  name: 'h5p-viewer',
  build: {
    outDir: 'dist',
    target: 'esnext',
  },
})
