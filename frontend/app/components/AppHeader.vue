<script setup>
defineProps({ title: String, back: Boolean })

const router = useRouter()

const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL

const { user, logout } = useAuth()

const initials = computed(() =>
  user.value?.firstname ? user.value.firstname.charAt(0).toUpperCase() : '?'
)

// ─── Dropdown ──────────────────────────────────────────────────
const menuOpen   = ref(false)
const containerRef = ref(null)

const closeMenu  = () => { menuOpen.value = false }

const handleLogout = () => {
  closeMenu()
  logout()
}

const onDocumentClick = (e) => {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    closeMenu()
  }
}

const onKeyDown = (e) => {
  if (e.key === 'Escape') closeMenu()
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick, true)
  document.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick, true)
  document.removeEventListener('keydown', onKeyDown)
})
</script>


<template>
  <header
    class="sticky top-0 z-20 flex items-center px-5 bg-[rgba(12,12,14,0.9)] backdrop-blur-[16px] border-b border-[var(--border)]"
    style="height: calc(60px + var(--sat)); padding-top: var(--sat)"
  >
    <!-- Bouton retour ou spacer -->
    <button
      v-if="back"
      class="w-9 h-9 flex items-center justify-center text-muted hover:text-body transition-colors duration-150 shrink-0"
      @click="router.back()"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <div v-else class="w-9 shrink-0" />

    <!-- Titre de la page -->
    <h1 class="flex-1 text-center font-serif text-xl font-normal italic text-body tracking-[-0.3px]">
      {{ title }}
    </h1>

    <!-- Slot actions optionnel (avant l'avatar) -->
    <slot name="right" />

    <!-- Avatar + menu déroulant -->
    <div class="relative shrink-0" ref="containerRef">

      <!-- Bouton avatar -->
      <button
        class="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-serif text-[15px] italic overflow-hidden transition-[box-shadow] duration-200 hover:shadow-[0_0_0_3px_var(--accent-glow)]"
        :class="menuOpen ? 'shadow-[0_0_0_3px_var(--accent-glow)]' : ''"
        @click="menuOpen = !menuOpen"
      >
        <img v-if="user?.avatar" :src="`${apiUrl}/storage/${user.avatar}`" alt="Avatar" class="w-full h-full object-cover" />
        <span v-else>{{ initials }}</span>
      </button>

      <!-- Dropdown -->
      <Transition
        enter-active-class="transition-[opacity,transform] duration-200 ease-out"
        enter-from-class="opacity-0 scale-95 -translate-y-1"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-[opacity,transform] duration-150 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 -translate-y-1"
      >
        <div
          v-if="menuOpen"
          class="absolute right-0 top-[calc(100%+10px)] w-56 bg-surface border border-[var(--border)] rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.55)] origin-top-right"
        >

          <!-- Info utilisateur -->
          <div class="px-4 py-3 border-b border-[var(--border)]">
            <p class="text-body text-sm font-medium truncate">{{ user?.firstname }} {{ user?.lastname }}</p>
            <p class="text-muted text-[11px] font-mono mt-0.5 truncate">{{ user?.email }}</p>
          </div>

          <!-- Mon Compte -->
          <NuxtLink
            :to="`/user/${user?.id}`"
            class="flex items-center gap-3 px-4 h-11 text-body text-sm hover:bg-surface-hover transition-colors duration-150"
            @click="closeMenu"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" class="text-muted shrink-0">
              <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            Mon Compte
          </NuxtLink>

          <!-- Paramètres -->
          <NuxtLink
            to="/settings"
            class="flex items-center gap-3 px-4 h-11 text-body text-sm hover:bg-surface-hover transition-colors duration-150"
            @click="closeMenu"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" class="text-muted shrink-0">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="currentColor" stroke-width="1.5" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" />
            </svg>
            Paramètres
          </NuxtLink>

          <div class="border-t border-[var(--border)]" />

          <!-- Déconnexion -->
          <button
            class="flex items-center gap-3 px-4 h-11 w-full text-left text-accent text-sm hover:bg-surface-hover transition-colors duration-150"
            @click="handleLogout"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" class="shrink-0">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Déconnexion
          </button>

        </div>
      </Transition>
    </div>
  </header>
</template>
