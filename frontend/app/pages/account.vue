<script setup>
const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL

const { user, token, fetchUser } = useAuth()

// ─── Profile form ──────────────────────────────────────────────
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
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`
    },
    body: JSON.stringify(form)
  })

  await fetchUser()
  profileMsg.value   = 'Profil mis à jour !'
  profileError.value = false
}

// ─── Password form ─────────────────────────────────────────────
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
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`
    },
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

// ─── Avatar (web) ──────────────────────────────────────────────
const uploadAvatar = async (event) => {
  const file = event.target.files[0]
  const formData = new FormData()
  formData.append('avatar', file)

  await fetch(`${apiUrl}/api/user/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token.value}` },
    body: formData
  })

  await fetchUser()
}

// ─── Avatar (mobile) ───────────────────────────────────────────
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

const takePicture = async () => {
  const photo = await Camera.getPhoto({
    quality: 80,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Camera
  })

  const blob = await (await fetch(photo.dataUrl)).blob()
  const formData = new FormData()
  formData.append('avatar', blob, 'avatar.jpg')

  await fetch(`${apiUrl}/api/user/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token.value}` },
    body: formData
  })

  await fetchUser()
}

// ─── Screen size detection ─────────────────────────────────────
const isMobileScreen = ref(false)
onMounted(() => { isMobileScreen.value = window.innerWidth < 768 })

// ─── Avatar initials ───────────────────────────────────────────
const initials = computed(() =>
  user.value?.firstname ? user.value.firstname.charAt(0).toUpperCase() : '?'
)
</script>


<template>
  <div class="page">

    <!-- Topbar -->
    <header class="topbar">
      <NuxtLink to="/" class="back-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </NuxtLink>
      <h1 class="topbar-title">Mon compte</h1>
      <div class="topbar-spacer" />
    </header>

    <!-- Content -->
    <div class="content">

      <!-- ── Section : Profil ──────────────────────────────────── -->
      <section class="section">
        <div class="section-head">
          <p class="section-tag">// profil</p>
          <h2 class="section-title">Informations personnelles</h2>
        </div>

        <form class="form" @submit.prevent="updateProfile">

          <div class="field">
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

          <div class="field">
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

          <div class="field">
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

          <button type="submit" class="btn-primary">
            Mettre à jour
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <p v-if="profileMsg" :class="['status', profileError ? 'is-error' : 'is-success']">
            {{ profileMsg }}
          </p>

        </form>
      </section>

      <!-- ── Section : Mot de passe ────────────────────────────── -->
      <section class="section">
        <div class="section-head">
          <p class="section-tag">// sécurité</p>
          <h2 class="section-title">Modifier le mot de passe</h2>
        </div>

        <form class="form" @submit.prevent="updatePassword">

          <div class="field">
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
            <button type="button" class="field-toggle" @click="showPwd.current = !showPwd.current">
              <svg v-if="!showPwd.current" width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" />
              </svg>
              <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <div class="field">
            <span class="field-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <div class="field-body">
              <label for="new-pwd" class="field-label">Nouveau mot de passe</label>
              <input id="new-pwd" v-model="passwordForm.password" :type="showPwd.newPwd ? 'text' : 'password'" autocomplete="new-password" placeholder="••••••••" class="field-input" />
            </div>
            <button type="button" class="field-toggle" @click="showPwd.newPwd = !showPwd.newPwd">
              <svg v-if="!showPwd.newPwd" width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" />
              </svg>
              <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <div class="field">
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
            <button type="button" class="field-toggle" @click="showPwd.confirm = !showPwd.confirm">
              <svg v-if="!showPwd.confirm" width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" />
              </svg>
              <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <button type="submit" class="btn-primary">
            Modifier le mot de passe
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <p v-if="passwordMsg" :class="['status', passwordError ? 'is-error' : 'is-success']">
            {{ passwordMsg }}
          </p>

        </form>
      </section>

      <!-- ── Section : Avatar ──────────────────────────────────── -->
      <section class="section">
        <div class="section-head">
          <p class="section-tag">// avatar</p>
          <h2 class="section-title">Photo de profil</h2>
        </div>

        <div class="avatar-area">
          <div class="avatar-preview">
            <img
              v-if="user?.avatar"
              :src="`${apiUrl}/storage/${user.avatar}`"
              alt="Avatar"
              class="avatar-img"
            />
            <span v-else class="avatar-initials">{{ initials }}</span>
          </div>

          <!-- Web -->
          <label v-if="!isMobileScreen" class="btn-upload">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Choisir une photo
            <input type="file" accept="image/*" class="file-input" @change="uploadAvatar" />
          </label>

          <!-- Mobile -->
          <button v-else class="btn-upload" @click="takePicture">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.5" />
              <circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="1.5" />
            </svg>
            Prendre une photo
          </button>
        </div>

      </section>

      <div class="bottom-spacer" />

    </div>
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

/* ─── Topbar ──────────────────────────────────────────────────── */
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 16px;
  height: calc(60px + var(--sat));
  padding: var(--sat) 20px 0;
  background: rgba(12, 12, 14, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
  text-decoration: none;
  flex-shrink: 0;
  transition: border-color 0.2s, color 0.2s;
}

.back-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.topbar-title {
  font-family: 'Crimson Pro', serif;
  font-size: 20px;
  font-weight: 400;
  font-style: italic;
  color: var(--text);
  letter-spacing: -0.3px;
  flex: 1;
  text-align: center;
}

.topbar-spacer {
  width: 36px;
  flex-shrink: 0;
}

/* ─── Content ─────────────────────────────────────────────────── */
.content {
  flex: 1;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ─── Section card ────────────────────────────────────────────── */
.section {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: 24px;
  padding: 24px 20px;
}

.section-head {
  margin-bottom: 20px;
}

.section-tag {
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  color: var(--accent);
  letter-spacing: 1px;
  margin-bottom: 6px;
  opacity: 0.8;
}

.section-title {
  font-family: 'Crimson Pro', serif;
  font-size: 22px;
  font-weight: 400;
  font-style: italic;
  color: var(--text);
  letter-spacing: -0.4px;
}

/* ─── Form ────────────────────────────────────────────────────── */
.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ─── Field ───────────────────────────────────────────────────── */
.field {
  display: flex;
  align-items: center;
  gap: 14px;
  height: 70px;
  padding: 0 12px 0 16px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: 18px;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.field:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

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
  font-size: 15px;
  font-weight: 400;
  line-height: 1;
  padding: 0;
}

.field-input::placeholder {
  color: var(--text-subtle);
  font-size: 14px;
}

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
  border-radius: 8px;
  transition: color 0.2s;
}

.field-toggle:hover {
  color: var(--text-muted);
}

/* ─── Primary button ──────────────────────────────────────────── */
.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 58px;
  background: var(--accent);
  border: none;
  border-radius: 16px;
  color: #fff;
  font-family: 'Karla', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
  transition: transform 0.15s, box-shadow 0.2s, filter 0.15s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--accent-glow);
  filter: brightness(1.05);
}

.btn-primary:active {
  transform: translateY(1px);
  box-shadow: none;
}

/* ─── Status message ──────────────────────────────────────────── */
.status {
  text-align: center;
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  letter-spacing: 0.5px;
  margin-top: 4px;
}

.status.is-success { color: var(--accent-gold); }
.status.is-error   { color: var(--accent); }

/* ─── Avatar section ──────────────────────────────────────────── */
.avatar-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.avatar-preview {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 8px 28px var(--accent-glow);
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  font-family: 'Crimson Pro', serif;
  font-size: 42px;
  font-weight: 400;
  font-style: italic;
  color: #fff;
}

.btn-upload {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 24px;
  height: 50px;
  background: transparent;
  border: 1.5px solid var(--border);
  border-radius: 14px;
  color: var(--text-muted);
  font-family: 'Karla', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s, color 0.2s;
}

.btn-upload:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  font-size: 0;
}

/* ─── Bottom spacer ───────────────────────────────────────────── */
.bottom-spacer {
  height: 24px;
}
</style>
