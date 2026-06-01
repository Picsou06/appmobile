<script setup>
definePageMeta({ middleware: 'auth' })

const { myAds, isLoading, loadMyAds, loadMoreMyAds } = useAds()

const sentinel = ref(null)
let observer = null

onMounted(async () => {
  await loadMyAds()

  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) loadMoreMyAds()
  }, { threshold: 0.1 })

  if (sentinel.value) observer.observe(sentinel.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bg animate-fade-in">

    <AppHeader title="Mes annonces" back />

    <main class="flex-1 p-4">

      <div class="mb-4">
        <NuxtLink to="/ads/create" class="btn-accent h-10 px-5 rounded-xl text-sm inline-flex">
          Ajouter une annonce
        </NuxtLink>
      </div>

      <div v-if="myAds.length" class="space-y-3">
        <div
          v-for="ad in myAds"
          :key="ad.id"
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
      </div>

      <div v-else-if="isLoading" class="flex justify-center items-center py-16">
        <div class="w-8 h-8 rounded-full border-2 border-surface-hover border-t-accent animate-spin" />
      </div>

      <div v-else class="text-center text-muted py-16">Aucune annonce</div>

      <div ref="sentinel" class="flex justify-center items-center py-8">
        <div v-if="isLoading && myAds.length" class="w-8 h-8 rounded-full border-2 border-surface-hover border-t-accent animate-spin" />
      </div>

    </main>

  </div>
</template>
