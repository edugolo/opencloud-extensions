import { defineConfig } from '@opencloud-eu/extension-sdk'

export default defineConfig({
  name: 'h5p-viewer',
  build: {
    outDir: 'dist',
    target: 'esnext',
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name].mjs',
        chunkFileNames: 'js/[name].mjs',
      },
    },
  },
})
