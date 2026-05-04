<script setup>
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const apiUrl = useApiUrl()
const { currentAd, loadAd, updateAd } = useAds()

const isSubmitting = ref(false)
const isLoading = ref(true)
const error = ref('')
const loadError = ref('')

const adId = route.params.id

onMounted(async () => {
  try {
    await loadAd(adId)
  } catch {
    loadError.value = 'Impossible de charger cette annonce.'
  } finally {
    isLoading.value = false
  }
})

const initial = computed(() => {
  if (!currentAd.value) return null
  return {
    title: currentAd.value.title,
    description: currentAd.value.description,
    city: currentAd.value.city,
    lat: Number(currentAd.value.lat),
    lng: Number(currentAd.value.lng),
    image: currentAd.value.image ? `${apiUrl}/storage/${currentAd.value.image}` : null,
  }
})

const submit = async (payload) => {
  error.value = ''

  if (!payload.title?.trim() || !payload.description?.trim() || !payload.city?.trim()) {
    error.value = 'Titre, ville et description sont requis.'
    return
  }

  if (!Number.isFinite(payload.lat) || !Number.isFinite(payload.lng)) {
    error.value = 'Latitude et longitude sont requises.'
    return
  }

  isSubmitting.value = true
  try {
    await updateAd(adId, payload)
    router.push('/ads/my')
  } catch (e) {
    error.value = e?.data?.message ?? 'Une erreur est survenue.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bg animate-fade-in">
    <AppHeader title="Modifier annonce" back />

    <main class="flex-1">
      <div v-if="isLoading" class="flex justify-center items-center py-16">
        <div class="w-8 h-8 rounded-full border-2 border-surface-hover border-t-accent animate-spin" />
      </div>

      <div v-else-if="loadError" class="p-4 text-center text-accent">
        {{ loadError }}
      </div>

      <AdForm
        v-else-if="initial"
        :initial="initial"
        :submitting="isSubmitting"
        :error="error"
        submit-label="Enregistrer"
        @submit="submit"
      />
    </main>
  </div>
</template>
