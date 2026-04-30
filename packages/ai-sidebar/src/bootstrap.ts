import { defineWebApplication } from '@opencloud-eu/web-pkg'
import { computed } from 'vue'
import AiShell from './components/AiShell.vue'
import AiAppView from './views/AiAppView.vue'

export default defineWebApplication({
  setup() {
    const extension = {
      id: 'ai-sidebar-files-panel',
      type: 'sidebarPanel' as const,
      extensionPointIds: ['global.files.sidebar'],
      panel: {
        name: 'ai-sidebar',
        icon: 'robot',
        title: () => 'AI',
        component: AiShell,
        isVisible: () => true,
        isRoot: () => true,
      },
    }

    return {
      appInfo: {
        id: 'ai-sidebar',
        name: 'AI',
        icon: 'robot',
      },
      routes: [
        {
          path: '/ai',
          name: 'ai-sidebar-root',
          component: AiAppView,
        },
      ],
      extensions: computed(() => [extension]),
    }
  },
})
