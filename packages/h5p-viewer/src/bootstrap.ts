import { defineWebApplication } from '@opencloud-eu/web-pkg'
import { computed } from 'vue'
import H5PPlayerView from './views/H5PPlayerView.vue'

export default defineWebApplication({
  setup() {
    return {
      appInfo: {
        id: 'h5p-viewer',
        name: 'H5P Viewer',
        icon: 'slideshow',
      },
      routes: [
        {
          path: '/h5p-viewer/:contentId',
          name: 'h5p-viewer-play',
          component: H5PPlayerView,
        },
      ],
      extensions: computed(() => [
        {
          id: 'h5p-viewer-file-action',
          type: 'action' as const,
          extensionPointIds: ['global.files.default-actions'],
          action: {
            name: 'open-h5p',
            icon: 'slideshow',
            label: () => 'Open H5P',
            isVisible: ({ resources }: { resources: Array<{ extension?: string }> }) =>
              resources.length === 1 && resources[0]?.extension === 'h5p',
            handler: ({ resources, router }: { resources: Array<{ id?: string }>, router: { push: (route: { name: string, params: Record<string, string> }) => void } }) => {
              const id = resources[0]?.id
              if (id) router.push({ name: 'h5p-viewer-play', params: { contentId: id } })
            },
          },
        },
      ]),
    }
  },
})
