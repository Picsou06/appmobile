<script setup>
const route = useRoute()

const isActive = (path: string) =>
  path === '/' ? route.path === '/' : route.path.startsWith(path)
</script>


<template>
  <div>
    <slot />

    <nav
      class="fixed bottom-0 left-0 right-0 z-30 bg-[rgba(12,12,14,0.92)] backdrop-blur-[16px] border-t border-[var(--border)] flex items-stretch"
      style="padding-bottom: var(--sab); height: calc(56px + var(--sab))"
    >
      <NuxtLink to="/" class="nav-tab" :class="{ 'nav-tab--active': isActive('/') }">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 12L12 3l9 9M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>Fil</span>
      </NuxtLink>

      <NuxtLink to="/ads" class="nav-tab" :class="{ 'nav-tab--active': isActive('/ads') }">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 5h18M3 10h18M3 15h12M3 20h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        </svg>
        <span>Annonces</span>
      </NuxtLink>

      <NuxtLink to="/map" class="nav-tab" :class="{ 'nav-tab--active': isActive('/map') }">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <line x1="9" y1="3" x2="9" y2="18" stroke="currentColor" stroke-width="1.6"/>
          <line x1="15" y1="6" x2="15" y2="21" stroke="currentColor" stroke-width="1.6"/>
        </svg>
        <span>Carte</span>
      </NuxtLink>

      <NuxtLink to="/my-posts" class="nav-tab" :class="{ 'nav-tab--active': isActive('/my-posts') }">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.6" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        </svg>
        <span>Compte</span>
      </NuxtLink>
    </nav>
  </div>
</template>


<style>
.nav-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: var(--color-muted, #7A7A8C);
  font-size: 10px;
  font-family: var(--font-sans, Karla, sans-serif);
  text-decoration: none;
  transition: color 0.15s;
}
.nav-tab:hover { color: #EEEEF3; }
.nav-tab--active { color: #FF4D6D; }
</style>
