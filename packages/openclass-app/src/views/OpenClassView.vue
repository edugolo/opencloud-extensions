<template>
  <div style="padding: 1.5rem;">
    <h1 style="font-size: 1.5rem; margin-bottom: 1rem;">OpenClass — H5P-bibliotheek</h1>

    <div v-if="loading" style="color: gray;">Laden…</div>
    <div v-else-if="error" style="color: red;">{{ error }}</div>
    <ul v-else-if="contents.length > 0" style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem;">
      <li
        v-for="item in contents"
        :key="item.id"
        style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border: 1px solid #e0e0e0; border-radius: 0.5rem; cursor: pointer;"
        @click="openContent(item.id)"
      >
        <span style="font-size: 1.25rem;">📄</span>
        <span>{{ item.title }}</span>
        <span style="margin-left: auto; font-size: 0.75rem; color: gray;">{{ item.library }}</span>
      </li>
    </ul>
    <div v-else style="color: gray;">Geen H5P-content gevonden. Upload een .h5p-bestand in de bestandsbeheerder.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

type H5PContentItem = { id: string; title: string; library: string }

const router = useRouter()
const contents = ref<H5PContentItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const apiBase = (import.meta.env['VITE_OPENCLASS_API_URL'] as string | undefined) ?? 'http://localhost:3001'

onMounted(async () => {
  try {
    const res = await fetch(`${apiBase}/api/v1/h5p/content`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    contents.value = (await res.json()) as H5PContentItem[]
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ophalen mislukt'
  } finally {
    loading.value = false
  }
})

function openContent(id: string) {
  router.push({ name: 'h5p-viewer-play', params: { contentId: id } })
}
</script>
