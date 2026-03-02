<script setup>
const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL

const { user, logout } = useAuth()

const initials = computed(() =>
  user.value?.firstname ? user.value.firstname.charAt(0).toUpperCase() : '?'
)

const today = new Date().toLocaleDateString('fr-FR', {
  weekday: 'long', day: 'numeric', month: 'long'
})
</script>


<template>
  <div class="page">

    <!-- Header -->
    <header class="header">
      <div class="date-label">{{ today }}</div>
      <div class="greeting">
        <span class="greeting-sub">Bonjour,</span>
        <span class="greeting-name">{{ user?.firstname }}</span>
      </div>
    </header>

    <!-- Main -->
    <main class="main">

      <!-- Avatar -->
      <div class="avatar-wrap">
        <div class="avatar">
          <img v-if="user?.avatar" :src="`${apiUrl}/storage/${user.avatar}`" alt="Avatar" class="avatar-img" />
          <span v-else>{{ initials }}</span>
        </div>
      </div>

      <!-- Nav -->
      <nav class="menu">
        <NuxtLink to="/account" class="menu-item">
          <span class="menu-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </span>
          <span class="menu-label">Mon compte</span>
          <span class="menu-chevron">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </NuxtLink>
      </nav>

    </main>

    <!-- Footer -->
    <footer class="footer">
      <button class="logout-btn" @click="logout()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Déconnexion
      </button>
    </footer>

  </div>
</template>


<style scoped>
/* ─── Page ────────────────────────────────────────────────────── */
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  animation: fade-in 0.4s ease both;
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ─── Header ──────────────────────────────────────────────────── */
.header {
  padding: calc(60px + var(--sat)) 28px 32px;
  background: linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%);
  border-bottom: 1px solid var(--border);
}

.date-label {
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  color: var(--text-subtle);
  text-transform: uppercase;
  letter-spacing: 2.5px;
  margin-bottom: 14px;
}

.greeting {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.greeting-sub {
  font-size: 15px;
  color: var(--text-muted);
  font-weight: 300;
}

.greeting-name {
  font-family: 'Crimson Pro', serif;
  font-size: 52px;
  font-weight: 400;
  font-style: italic;
  color: var(--text);
  letter-spacing: -1.5px;
  line-height: 1.05;
}

/* ─── Main ────────────────────────────────────────────────────── */
.main {
  flex: 1;
  padding: 36px 28px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

/* ─── Avatar ──────────────────────────────────────────────────── */
.avatar-wrap {
  display: flex;
  justify-content: center;
}

.avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Crimson Pro', serif;
  font-size: 40px;
  font-weight: 400;
  font-style: italic;
  box-shadow: 0 8px 32px var(--accent-glow);
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ─── Menu ────────────────────────────────────────────────────── */
.menu {
  width: 100%;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  height: 68px;
  padding: 0 20px;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: 20px;
  color: var(--text);
  text-decoration: none;
  transition: border-color 0.2s, background 0.2s, transform 0.15s;
}

.menu-item:hover,
.menu-item:active {
  border-color: var(--border-hover);
  background: var(--surface-hover);
  transform: translateX(2px);
}

.menu-icon {
  color: var(--text-muted);
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.menu-label {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
}

.menu-chevron {
  color: var(--text-subtle);
  display: flex;
  align-items: center;
}

/* ─── Footer ──────────────────────────────────────────────────── */
.footer {
  padding: 20px 28px 44px;
  border-top: 1px solid var(--border);
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 52px;
  background: transparent;
  border: 1.5px solid var(--border);
  border-radius: 16px;
  color: var(--text-muted);
  font-family: 'Karla', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}

.logout-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(255, 77, 109, 0.05);
}
</style>
