<script setup>
definePageMeta({ middleware: 'auth' })

const router = useRouter()
const { createAd } = useAds()

const isSubmitting = ref(false)
const error = ref('')

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
    await createAd(payload)
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
    <AppHeader title="Nouvelle annonce" back />
    <main class="flex-1">
      <AdForm :submitting="isSubmitting" :error="error" submit-label="Publier" @submit="submit" />
    </main>
  </div>
</template>
