<template>
  <iframe
    v-if="playerUrl"
    :src="playerUrl"
    style="width: 100%; height: 100%; border: none; display: block;"
    allowfullscreen
  />
  <div v-else style="padding: 2rem;">Loading H5P content…</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const playerUrl = computed(() => {
  const contentId = route.params['contentId'] as string | undefined
  if (!contentId) return null
  const apiBase = (import.meta.env['VITE_OPENCLASS_API_URL'] as string | undefined) ?? 'http://localhost:3001'
  return `${apiBase}/api/v1/h5p/page/play/${contentId}`
})
</script>
