import { defineWebApplication } from '@opencloud-eu/web-pkg'
import { computed } from 'vue'
import OpenClassView from './views/OpenClassView.vue'

export default defineWebApplication({
  setup() {
    return {
      appInfo: {
        id: 'openclass-app',
        name: 'OpenClass',
        icon: 'school',
      },
      routes: [
        {
          path: '/openclass',
          name: 'openclass-home',
          component: OpenClassView,
        },
      ],
      extensions: computed(() => [
        {
          id: 'openclass-nav',
          type: 'sidebarNav' as const,
          extensionPointIds: ['app.nav'],
          nav: {
            name: 'openclass',
            icon: 'school',
            label: () => 'OpenClass',
            route: { name: 'openclass-home' },
            isActive: () => false,
          },
        },
      ]),
    }
  },
})
