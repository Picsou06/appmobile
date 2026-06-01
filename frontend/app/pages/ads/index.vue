<script setup>
const { ads, myAds, isLoading, loadAds, loadMoreAds, loadMyAds, loadMoreMyAds } = useAds()
const { getPosition } = useGeolocation()

const tab      = ref('all') // 'all' | 'mine'
const error    = ref('')
const sentinel = ref(null)
let observer   = null

const currentList    = computed(() => tab.value === 'all' ? ads.value   : myAds.value)
const currentHasMore = computed(() => tab.value === 'all' ? ads.value.length > 0 : myAds.value.length > 0)

const resetObserver = () => {
  observer?.disconnect()
  observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return
    if (tab.value === 'all') loadMoreAds()
    else                     loadMoreMyAds()
  }, { threshold: 0.1 })
  nextTick(() => { if (sentinel.value) observer.observe(sentinel.value) })
}

const loadAll = async () => {
  error.value = ''
  try {
    const { lat, lng } = await getPosition()
    await loadAds(lat, lng)
    resetObserver()
  } catch (e) {
    error.value = e.message ?? 'Impossible de récupérer votre position.'
  }
}

const switchTab = async (t) => {
  tab.value = t
  if (t === 'all' && ads.value.length === 0)   await loadAll()
  if (t === 'mine' && myAds.value.length === 0) await loadMyAds()
  resetObserver()
}

onMounted(loadAll)
onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bg animate-fade-in">

    <AppHeader title="Annonces" />

    <main class="flex-1 p-4">

      <!-- Barre d'actions -->
      <div class="mb-4 flex items-center gap-2">
        <NuxtLink to="/ads/create" class="btn-accent h-10 px-4 rounded-xl text-sm inline-flex">
          Ajouter
        </NuxtLink>

        <!-- Toggle onglets -->
        <div class="flex-1 flex h-10 bg-surface rounded-xl border border-[var(--border)] overflow-hidden">
          <button
            @click="switchTab('all')"
            :class="[
              'flex-1 text-sm transition-colors duration-150',
              tab === 'all' ? 'bg-accent text-white font-medium' : 'text-muted hover:text-body'
            ]"
          >
            Toutes
          </button>
          <button
            @click="switchTab('mine')"
            :class="[
              'flex-1 text-sm transition-colors duration-150',
              tab === 'mine' ? 'bg-accent text-white font-medium' : 'text-muted hover:text-body'
            ]"
          >
            Mes annonces
          </button>
        </div>
      </div>

      <!-- Erreur géoloc (onglet "Toutes") -->
      <div v-if="error && tab === 'all'" class="flex flex-col items-center gap-4 py-16">
        <p class="text-accent text-sm text-center">{{ error }}</p>
        <button @click="loadAll" class="btn-accent h-10 px-6 rounded-xl text-sm font-medium">
          Réessayer
        </button>
      </div>

      <!-- Liste -->
      <template v-else>

        <div v-if="currentList.length" class="space-y-3">
          <template v-for="ad in currentList" :key="ad.id">

            <!-- Onglet "Mes annonces" : titre cliquable + bouton édition -->
            <div
              v-if="tab === 'mine'"
              class="bg-surface border border-[var(--border)] rounded-2xl px-4 py-3 flex items-center gap-3 hover:border-[var(--border-hover)] transition-colors duration-150"
            >
              <NuxtLink :to="`/ads/${ad.id}`" class="flex-1 min-w-0">
                <p class="text-body font-semibold truncate">{{ ad.title }}</p>
                <p class="text-muted text-sm mt-0.5 truncate">{{ ad.city }}</p>
              </NuxtLink>
              <NuxtLink
                :to="`/ads/${ad.id}/edit`"
                class="shrink-0 w-8 h-8 flex items-center justify-center text-muted hover:text-body border border-[var(--border)] rounded-lg hover:border-[var(--border-hover)] transition-colors duration-150"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </NuxtLink>
            </div>

            <!-- Onglet "Toutes" : CardAd standard -->
            <CardAd v-else :ad="ad" />

          </template>
        </div>

        <div v-else-if="isLoading" class="flex justify-center items-center py-16">
          <div class="w-8 h-8 rounded-full border-2 border-surface-hover border-t-accent animate-spin" />
        </div>

        <div v-else class="text-center text-muted py-16">
          {{ tab === 'all' ? 'Aucune annonce trouvée' : 'Aucune annonce publiée' }}
        </div>

        <div ref="sentinel" class="flex justify-center items-center py-8">
          <div v-if="isLoading && currentList.length" class="w-8 h-8 rounded-full border-2 border-surface-hover border-t-accent animate-spin" />
        </div>

      </template>

    </main>

  </div>
</template>
