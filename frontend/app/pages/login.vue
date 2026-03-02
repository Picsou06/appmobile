<script setup lang="ts">
const { login } = useAuth()

const email    = ref('')
const password = ref('')
const message  = ref('')
const isError  = ref(false)
const showPwd  = ref(false)

const handleLogin = async () => {
  const success = await login(email.value, password.value)

  if (success) {
    message.value = 'Connexion réussie !'
    isError.value = false
    navigateTo('/')
  } else {
    message.value = 'Email ou mot de passe incorrect'
    isError.value = true
  }
}
</script>


<template>
  <div class="page">
    <div class="glow" />

    <div class="card">

      <!-- Brand -->
      <div class="brand">
        <p class="brand-mono">// connexion</p>
        <h1 class="brand-title">Bienvenue.</h1>
      </div>

      <!-- Form -->
      <form class="form" @submit.prevent="handleLogin">

        <!-- Email -->
        <div class="field">
          <span class="field-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.5" />
              <path d="M2 7l10 7 10-7" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            </svg>
          </span>
          <div class="field-body">
            <label for="email" class="field-label">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="votre@email.com"
              class="field-input"
            />
          </div>
        </div>

        <!-- Password -->
        <div class="field">
          <span class="field-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.5" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </span>
          <div class="field-body">
            <label for="password" class="field-label">Mot de passe</label>
            <input
              id="password"
              v-model="password"
              :type="showPwd ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="••••••••"
              class="field-input"
            />
          </div>
          <button type="button" class="field-toggle" :aria-label="showPwd ? 'Masquer' : 'Afficher'" @click="showPwd = !showPwd">
            <!-- eye-open -->
            <svg v-if="!showPwd" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" />
            </svg>
            <!-- eye-off -->
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <button type="submit" class="submit-btn">
          Se connecter
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

      </form>

      <p v-if="message" :class="['message', isError ? 'is-error' : 'is-success']">
        {{ message }}
      </p>

    </div>
  </div>
</template>


<style scoped>
/* ─── Page ────────────────────────────────────────────────────── */
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(40px + var(--sat)) 24px 40px;
  position: relative;
  overflow: hidden;
  background: var(--bg);
}

.glow {
  position: absolute;
  bottom: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 77, 109, 0.16) 0%, transparent 65%);
  pointer-events: none;
}

/* ─── Card ────────────────────────────────────────────────────── */
.card {
  width: 100%;
  max-width: 400px;
  animation: rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes rise {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ─── Brand ───────────────────────────────────────────────────── */
.brand {
  margin-bottom: 40px;
}

.brand-mono {
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 1px;
  margin-bottom: 10px;
  opacity: 0.8;
}

.brand-title {
  font-family: 'Crimson Pro', serif;
  font-size: 54px;
  font-weight: 300;
  font-style: italic;
  color: var(--text);
  letter-spacing: -1.5px;
  line-height: 1;
}

/* ─── Form ────────────────────────────────────────────────────── */
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ─── Field ───────────────────────────────────────────────────── */
.field {
  display: flex;
  align-items: center;
  gap: 14px;
  height: 72px;
  padding: 0 14px 0 18px;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: 20px;
  transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
}

.field:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow), 0 6px 22px rgba(0, 0, 0, 0.28);
  background: var(--surface-hover);
}

/* Icon */
.field-icon {
  color: var(--text-subtle);
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: color 0.25s;
}

.field:focus-within .field-icon {
  color: var(--accent);
}

/* Body: label + input stacked */
.field-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: 8px 0;
}

.field-label {
  font-family: 'Fira Code', monospace;
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-muted);
  line-height: 1;
  transition: color 0.25s;
}

.field:focus-within .field-label {
  color: var(--accent);
}

.field-input {
  background: none;
  border: none;
  outline: none;
  width: 100%;
  min-width: 0;
  color: var(--text);
  font-family: 'Karla', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1;
  padding: 0;
}

.field-input::placeholder {
  color: var(--text-subtle);
  font-size: 14px;
}

/* Password toggle */
.field-toggle {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 8px;
  margin: -8px;
  color: var(--text-subtle);
  cursor: pointer;
  border-radius: 10px;
  transition: color 0.2s;
}

.field-toggle:hover {
  color: var(--text-muted);
}

/* ─── Submit ──────────────────────────────────────────────────── */
.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 64px;
  background: var(--accent);
  border: none;
  border-radius: 20px;
  color: #fff;
  font-family: 'Karla', sans-serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.2px;
  cursor: pointer;
  margin-top: 8px;
  transition: transform 0.15s, box-shadow 0.2s, filter 0.15s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px var(--accent-glow);
  filter: brightness(1.05);
}

.submit-btn:active {
  transform: translateY(1px);
  box-shadow: none;
  filter: brightness(0.95);
}

/* ─── Message ─────────────────────────────────────────────────── */
.message {
  text-align: center;
  margin-top: 20px;
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  letter-spacing: 0.3px;
}

.message.is-error   { color: var(--accent); }
.message.is-success { color: var(--accent-gold); }
</style>
