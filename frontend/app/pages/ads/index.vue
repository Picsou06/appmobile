<script setup>
const { ads, isLoading, loadAds, loadMoreAds } = useAds()
const { getPosition } = useGeolocation()

const error    = ref('')
const sentinel = ref(null)
let observer   = null

const initObserver = () => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) loadMoreAds()
  }, { threshold: 0.1 })
  nextTick(() => {
    if (sentinel.value) observer.observe(sentinel.value)
  })
}

const load = async () => {
  error.value = ''
  try {
    const { lat, lng } = await getPosition()
    await loadAds(lat, lng)
    if (!observer) initObserver()
  } catch (e) {
    error.value = e.message ?? 'Impossible de récupérer votre position.'
  }
}

onMounted(load)
onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bg animate-fade-in">

    <AppHeader title="Annonces" />

    <main class="flex-1 p-4">

      <div class="mb-4 flex items-center gap-2">
        <NuxtLink to="/ads/create" class="btn-accent h-10 px-4 rounded-xl text-sm inline-flex">
          Ajouter
        </NuxtLink>
        <NuxtLink to="/ads/my" class="h-10 px-4 rounded-xl border border-[var(--border)] text-sm text-muted hover:text-body hover:border-[var(--border-hover)] transition-colors duration-150 inline-flex items-center">
          Mes annonces
        </NuxtLink>
        <NuxtLink to="/ads/map" class="h-10 px-4 rounded-xl border border-[var(--border)] text-sm text-muted hover:text-body hover:border-[var(--border-hover)] transition-colors duration-150 inline-flex items-center gap-1.5">
          🗺 Carte
        </NuxtLink>
      </div>

      <div v-if="error" class="flex flex-col items-center gap-4 py-16">
        <p class="text-accent text-sm text-center">{{ error }}</p>
        <button @click="load" class="btn-accent h-10 px-6 rounded-xl text-sm font-medium">
          Réessayer
        </button>
      </div>

      <div v-else-if="ads.length" class="space-y-3">
        <CardAd v-for="ad in ads" :key="ad.id" :ad="ad" />
      </div>

      <div v-else-if="isLoading" class="flex justify-center items-center py-16">
        <div class="w-8 h-8 rounded-full border-2 border-surface-hover border-t-accent animate-spin" />
      </div>

      <div v-else class="text-center text-muted py-16">Aucune annonce trouvée</div>

      <div ref="sentinel" class="flex justify-center items-center py-8">
        <div v-if="isLoading && ads.length" class="w-8 h-8 rounded-full border-2 border-surface-hover border-t-accent animate-spin" />
      </div>

    </main>

  </div>
</template>
