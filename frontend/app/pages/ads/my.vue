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
        <div v-for="ad in myAds" :key="ad.id" class="bg-surface border border-[var(--border)] rounded-2xl p-3">
          <div class="flex items-center justify-between gap-3">
            <CardAd :ad="ad" class="flex-1" />
            <NuxtLink :to="`/ads/${ad.id}/edit`" class="h-9 px-3 rounded-lg border border-[var(--border)] text-sm text-muted hover:text-body hover:border-[var(--border-hover)] transition-colors duration-150 inline-flex items-center">
              Modifier
            </NuxtLink>
          </div>
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
