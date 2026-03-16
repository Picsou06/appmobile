<script setup>
const apiUrl = useApiUrl()

const { user, token, fetchUser } = useAuth()

const form = reactive({
  firstname: '',
  lastname:  '',
  email:     ''
})

onMounted(() => {
  if (user.value) {
    form.firstname = user.value.firstname
    form.lastname  = user.value.lastname
    form.email     = user.value.email
  }
})

const profileMsg   = ref('')
const profileError = ref(false)

const updateProfile = async () => {
  await fetch(`${apiUrl}/api/user`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token.value}` },
    body: JSON.stringify(form)
  })
  await fetchUser()
  profileMsg.value   = 'Profil mis à jour !'
  profileError.value = false
}

const passwordForm = reactive({
  current_password:      '',
  password:              '',
  password_confirmation: ''
})

const showPwd = reactive({ current: false, newPwd: false, confirm: false })

const passwordMsg   = ref('')
const passwordError = ref(false)

const updatePassword = async () => {
  const res = await fetch(`${apiUrl}/api/user/password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token.value}` },
    body: JSON.stringify(passwordForm)
  })
  if (res.ok) {
    passwordMsg.value   = 'Mot de passe modifié !'
    passwordError.value = false
    passwordForm.current_password      = ''
    passwordForm.password              = ''
    passwordForm.password_confirmation = ''
  } else {
    passwordMsg.value   = 'Une erreur est survenue'
    passwordError.value = true
  }
}

// ─── Avatar upload ──────────────────────────────────────────────
const showAvatarPicker = ref(false)

const postAvatar = async (file) => {
  const formData = new FormData()
  formData.append('avatar', file)
  await fetch(`${apiUrl}/api/user/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token.value}` },
    body: formData
  })
  await fetchUser()
}

const onAvatarPicked = async (file) => {
  if (file) await postAvatar(file)
}

// ─── Avatar initials ───────────────────────────────────────────
const initials = computed(() =>
  user.value?.firstname ? user.value.firstname.charAt(0).toUpperCase() : '?'
)
</script>


<template>
  <div class="min-h-screen flex flex-col bg-bg animate-fade-in">

    <AppHeader title="Paramètres" back />

    <div class="flex-1 py-6 px-5 flex flex-col gap-5">

      <section class="section-card">
        <div class="mb-5">
          <p class="section-tag">// profil</p>
          <h2 class="section-title">Informations personnelles</h2>
        </div>

        <form class="flex flex-col gap-3" @submit.prevent="updateProfile">

          <div class="group form-field">
            <span class="field-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </span>
            <div class="field-body">
              <label for="firstname" class="field-label">Prénom</label>
              <input id="firstname" v-model="form.firstname" type="text" placeholder="Votre prénom" class="field-input" />
            </div>
          </div>

          <div class="group form-field">
            <span class="field-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.5" />
                <path d="M7 9h10M7 13h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </span>
            <div class="field-body">
              <label for="lastname" class="field-label">Nom</label>
              <input id="lastname" v-model="form.lastname" type="text" placeholder="Votre nom" class="field-input" />
            </div>
          </div>

          <div class="group form-field">
            <span class="field-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.5" />
                <path d="M2 7l10 7 10-7" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
              </svg>
            </span>
            <div class="field-body">
              <label for="profile-email" class="field-label">Email</label>
              <input id="profile-email" v-model="form.email" type="email" autocomplete="email" placeholder="votre@email.com" class="field-input" />
            </div>
          </div>

          <button type="submit" class="btn-accent h-[58px] rounded-2xl text-[15px] mt-1 hover:shadow-[0_8px_24px_var(--accent-glow)]">
            Mettre à jour
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <p v-if="profileMsg" :class="['text-center font-mono text-[11px] tracking-[0.5px] mt-1', profileError ? 'text-accent' : 'text-accent-gold']">
            {{ profileMsg }}
          </p>

        </form>
      </section>

      <!-- ── Section : Mot de passe ────────────────────────────── -->
      <section class="section-card">
        <div class="mb-5">
          <p class="section-tag">// sécurité</p>
          <h2 class="section-title">Modifier le mot de passe</h2>
        </div>

        <form class="flex flex-col gap-3" @submit.prevent="updatePassword">

          <div class="group form-field">
            <span class="field-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.5" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </span>
            <div class="field-body">
              <label for="current-pwd" class="field-label">Mot de passe actuel</label>
              <input id="current-pwd" v-model="passwordForm.current_password" :type="showPwd.current ? 'text' : 'password'" autocomplete="current-password" placeholder="••••••••" class="field-input" />
            </div>
            <button type="button" class="field-toggle rounded-lg" @click="showPwd.current = !showPwd.current">
              <svg v-if="!showPwd.current" width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" />
              </svg>
              <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <div class="group form-field">
            <span class="field-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <div class="field-body">
              <label for="new-pwd" class="field-label">Nouveau mot de passe</label>
              <input id="new-pwd" v-model="passwordForm.password" :type="showPwd.newPwd ? 'text' : 'password'" autocomplete="new-password" placeholder="••••••••" class="field-input" />
            </div>
            <button type="button" class="field-toggle rounded-lg" @click="showPwd.newPwd = !showPwd.newPwd">
              <svg v-if="!showPwd.newPwd" width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" />
              </svg>
              <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <div class="group form-field">
            <span class="field-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" stroke="currentColor" stroke-width="1.5" />
              </svg>
            </span>
            <div class="field-body">
              <label for="confirm-pwd" class="field-label">Confirmer le mot de passe</label>
              <input id="confirm-pwd" v-model="passwordForm.password_confirmation" :type="showPwd.confirm ? 'text' : 'password'" autocomplete="new-password" placeholder="••••••••" class="field-input" />
            </div>
            <button type="button" class="field-toggle rounded-lg" @click="showPwd.confirm = !showPwd.confirm">
              <svg v-if="!showPwd.confirm" width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" />
              </svg>
              <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <button type="submit" class="btn-accent h-[58px] rounded-2xl text-[15px] mt-1 hover:shadow-[0_8px_24px_var(--accent-glow)]">
            Modifier le mot de passe
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <p v-if="passwordMsg" :class="['text-center font-mono text-[11px] tracking-[0.5px] mt-1', passwordError ? 'text-accent' : 'text-accent-gold']">
            {{ passwordMsg }}
          </p>

        </form>
      </section>

      <!-- ── Section : Avatar ──────────────────────────────────── -->
      <section class="section-card">
        <div class="mb-5">
          <p class="section-tag">// avatar</p>
          <h2 class="section-title">Photo de profil</h2>
        </div>

        <div class="flex flex-col items-center gap-5">
          <div class="w-24 h-24 rounded-full bg-accent flex items-center justify-center overflow-hidden shadow-[0_8px_28px_var(--accent-glow)] shrink-0">
            <img v-if="user?.avatar" :src="`${apiUrl}/storage/${user.avatar}`" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else class="font-serif text-[42px] font-normal italic text-white">{{ initials }}</span>
          </div>

          <button
            @click="showAvatarPicker = true"
            class="flex items-center gap-2.5 px-6 h-[50px] bg-transparent border-[1.5px] border-[var(--border)] rounded-[14px] text-muted font-sans text-sm font-medium cursor-pointer transition-[border-color,color] duration-200 hover:border-accent hover:text-accent"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="1.5" />
            </svg>
            Changer la photo
          </button>
        </div>

        <ImagePickerSheet v-model="showAvatarPicker" @picked="onAvatarPicked" />

      </section>

      <div class="h-6" />

    </div>
  </div>
</template>
