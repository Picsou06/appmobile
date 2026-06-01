<script setup>
definePageMeta({ middleware: 'auth' })

const route  = useRoute()
const apiUrl = useApiUrl()
const api    = useApi()
const { user } = useAuth()

const ad      = ref(null)
const loading = ref(true)
const error   = ref('')

onMounted(async () => {
  try {
    const res = await api(`${apiUrl}/api/ads/${route.params.id}`)
    ad.value = res.data ?? res
  } catch {
    error.value = 'Impossible de charger cette annonce.'
  } finally {
    loading.value = false
  }
})

const isOwner = computed(() =>
  ad.value && user.value && ad.value.user_id === user.value.id
)
</script>


<template>
  <div class="min-h-screen flex flex-col bg-bg animate-fade-in">

    <AppHeader title="Annonce" back>
      <template #right>
        <NuxtLink
          v-if="isOwner"
          :to="`/ads/${route.params.id}/edit`"
          class="w-9 h-9 flex items-center justify-center text-muted hover:text-body transition-colors duration-150"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </NuxtLink>
      </template>
    </AppHeader>

    <main class="flex-1">

      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="w-8 h-8 rounded-full border-2 border-surface-hover border-t-accent animate-spin" />
      </div>

      <p v-else-if="error" class="p-6 text-accent text-sm text-center">{{ error }}</p>

      <template v-else-if="ad">

        <!-- Image -->
        <div v-if="ad.image" class="w-full aspect-video bg-surface overflow-hidden">
          <img :src="`${apiUrl}/storage/${ad.image}`" :alt="ad.title" class="w-full h-full object-cover" />
        </div>

        <div class="p-5 flex flex-col gap-5">

          <!-- Titre + ville -->
          <div>
            <h1 class="text-body text-2xl font-semibold">{{ ad.title }}</h1>
            <div class="flex items-center gap-1.5 mt-1 text-muted text-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 21C12 21 5 13.5 5 8.5a7 7 0 1 1 14 0c0 5-7 12.5-7 12.5z" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="12" cy="8.5" r="2.5" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              {{ ad.city }}
              <span v-if="ad.distance != null" class="ml-2 text-accent-gold font-medium">
                à {{ Math.round(ad.distance) }} km
              </span>
            </div>
          </div>

          <!-- Description -->
          <p class="text-body text-sm leading-relaxed">{{ ad.description }}</p>

          <!-- Auteur -->
          <div v-if="ad.user" class="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
            <NuxtLink :to="`/user/${ad.user.id}`" class="flex items-center gap-3 group">
              <div class="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-serif text-sm italic overflow-hidden shrink-0">
                <img v-if="ad.user.avatar" :src="`${apiUrl}/storage/${ad.user.avatar}`" class="w-full h-full object-cover" />
                <span v-else>{{ ad.user.firstname?.charAt(0).toUpperCase() }}</span>
              </div>
              <div>
                <p class="text-body text-sm font-medium group-hover:text-accent transition-colors duration-150">
                  {{ ad.user.firstname }} {{ ad.user.lastname }}
                </p>
                <p class="text-muted text-xs">Publiée par</p>
              </div>
            </NuxtLink>
          </div>

          <!-- Bouton carte -->
          <NuxtLink
            to="/map"
            class="flex items-center justify-center gap-2 h-12 rounded-2xl border border-[var(--border)] text-muted hover:text-body hover:border-[var(--border-hover)] transition-colors duration-150 text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
            Voir sur la carte
          </NuxtLink>

        </div>
      </template>

    </main>
  </div>
</template>
