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
  <div
    class="min-h-screen flex items-center justify-center px-6 pb-10 relative overflow-hidden bg-bg"
    style="padding-top: calc(40px + var(--sat))"
  >
    <!-- Glow -->
    <div class="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,77,109,0.16)_0%,transparent_65%)] pointer-events-none" />

    <!-- Card -->
    <div class="w-full max-w-[400px] animate-rise">

      <!-- Brand -->
      <div class="mb-10">
        <p class="font-mono text-[11px] text-accent tracking-[1px] mb-2.5 opacity-80">// connexion</p>
        <h1 class="font-serif text-[54px] font-light italic text-body tracking-[-1.5px] leading-none">Bienvenue.</h1>
      </div>

      <!-- Form -->
      <form class="flex flex-col gap-3.5" @submit.prevent="handleLogin">

        <!-- Email -->
        <div class="group flex items-center gap-3.5 h-[72px] pr-3.5 pl-[18px] bg-surface border-[1.5px] border-[var(--border)] rounded-[20px] transition-[border-color,box-shadow,background] duration-300 focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--accent-glow),0_6px_22px_rgba(0,0,0,0.28)] focus-within:bg-surface-hover">
          <span class="field-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.5" />
              <path d="M2 7l10 7 10-7" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            </svg>
          </span>
          <div class="field-body">
            <label for="email" class="field-label">Email</label>
            <input id="email" v-model="email" type="email" autocomplete="email" placeholder="votre@email.com" class="field-input text-base" />
          </div>
        </div>

        <!-- Password -->
        <div class="group flex items-center gap-3.5 h-[72px] pr-3.5 pl-[18px] bg-surface border-[1.5px] border-[var(--border)] rounded-[20px] transition-[border-color,box-shadow,background] duration-300 focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--accent-glow),0_6px_22px_rgba(0,0,0,0.28)] focus-within:bg-surface-hover">
          <span class="field-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.5" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </span>
          <div class="field-body">
            <label for="password" class="field-label">Mot de passe</label>
            <input id="password" v-model="password" :type="showPwd ? 'text' : 'password'" autocomplete="current-password" placeholder="••••••••" class="field-input text-base" />
          </div>
          <button
            type="button"
            class="field-toggle rounded-[10px]"
            :aria-label="showPwd ? 'Masquer' : 'Afficher'"
            @click="showPwd = !showPwd"
          >
            <svg v-if="!showPwd" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" />
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="btn-accent h-16 rounded-[20px] text-base tracking-[0.2px] mt-2 hover:shadow-[0_10px_30px_var(--accent-glow)] active:brightness-95"
        >
          Se connecter
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

      </form>

      <p
        v-if="message"
        :class="['text-center mt-5 font-mono text-xs tracking-[0.3px]', isError ? 'text-accent' : 'text-accent-gold']"
      >
        {{ message }}
      </p>

    </div>
  </div>
</template>
