<script setup>
const props = defineProps({
  initial: {
    type: Object,
    default: () => ({ title: '', description: '', city: '', lat: null, lng: null, image: null }),
  },
  submitLabel: { type: String, default: 'Enregistrer' },
  submitting: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const emit = defineEmits(['submit'])

const title = ref(props.initial.title ?? '')
const description = ref(props.initial.description ?? '')
const city = ref(props.initial.city ?? '')
const lat = ref(props.initial.lat ?? null)
const lng = ref(props.initial.lng ?? null)
const imageFile = ref(null)
const imagePreview = ref(props.initial.image ?? null)
const showPicker = ref(false)

watch(
  () => props.initial,
  (value) => {
    title.value = value?.title ?? ''
    description.value = value?.description ?? ''
    city.value = value?.city ?? ''
    lat.value = value?.lat ?? null
    lng.value = value?.lng ?? null
    imagePreview.value = value?.image ?? null
    imageFile.value = null
  },
  { deep: true }
)

const onImagePicked = (file) => {
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const removeImage = () => {
  imageFile.value = null
  imagePreview.value = null
}

const submit = () => {
  emit('submit', {
    title: title.value,
    description: description.value,
    city: city.value,
    lat: Number(lat.value),
    lng: Number(lng.value),
    imageFile: imageFile.value,
  })
}
</script>

<template>
  <div class="flex flex-col gap-5 p-4 pt-6">
    <div class="flex flex-col gap-2">
      <label class="text-muted text-xs font-mono uppercase tracking-widest">Photo (optionnel)</label>
      <button
        v-if="!imagePreview"
        type="button"
        @click="showPicker = true"
        class="flex flex-col items-center justify-center w-full h-40 rounded-2xl border border-dashed border-[var(--border)] text-muted hover:border-accent hover:text-accent transition-colors duration-150 cursor-pointer"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" class="mb-2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="text-sm">Choisir une image</span>
      </button>
      <div v-else class="relative w-full h-40 rounded-2xl overflow-hidden">
        <img :src="imagePreview" class="w-full h-full object-cover" />
        <div class="absolute bottom-2 right-2 flex gap-2">
          <button type="button" @click="showPicker = true" class="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors duration-150">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          <button type="button" @click="removeImage" class="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors duration-150">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-1 border border-[var(--border)] rounded-2xl bg-surface px-4 py-3">
      <label class="text-muted text-xs font-mono uppercase tracking-widest">Titre</label>
      <input v-model="title" type="text" placeholder="Titre de l'annonce" class="w-full bg-transparent text-body text-sm placeholder:text-faint outline-none" />
    </div>

    <div class="flex flex-col gap-1 border border-[var(--border)] rounded-2xl bg-surface px-4 py-3">
      <label class="text-muted text-xs font-mono uppercase tracking-widest">Ville</label>
      <input v-model="city" type="text" placeholder="Ville" class="w-full bg-transparent text-body text-sm placeholder:text-faint outline-none" />
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="flex flex-col gap-1 border border-[var(--border)] rounded-2xl bg-surface px-4 py-3">
        <label class="text-muted text-xs font-mono uppercase tracking-widest">Latitude</label>
        <input v-model.number="lat" type="number" step="any" placeholder="48.8566" class="w-full bg-transparent text-body text-sm placeholder:text-faint outline-none" />
      </div>
      <div class="flex flex-col gap-1 border border-[var(--border)] rounded-2xl bg-surface px-4 py-3">
        <label class="text-muted text-xs font-mono uppercase tracking-widest">Longitude</label>
        <input v-model.number="lng" type="number" step="any" placeholder="2.3522" class="w-full bg-transparent text-body text-sm placeholder:text-faint outline-none" />
      </div>
    </div>

    <div class="flex flex-col gap-1 border border-[var(--border)] rounded-2xl bg-surface px-4 py-3">
      <label class="text-muted text-xs font-mono uppercase tracking-widest">Description</label>
      <textarea v-model="description" rows="5" placeholder="Décrivez votre annonce..." class="w-full bg-transparent text-body text-sm placeholder:text-faint outline-none resize-none" />
    </div>

    <p v-if="error" class="text-accent text-sm">{{ error }}</p>

    <button
      @click="submit"
      :disabled="submitting"
      class="btn-accent w-full h-12 rounded-2xl font-medium text-sm disabled:opacity-50 hover:shadow-[0_8px_32px_var(--accent-glow)] transition-shadow duration-200"
    >
      <span v-if="submitting" class="flex items-center justify-center gap-2">
        <span class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        Envoi...
      </span>
      <span v-else>{{ submitLabel }}</span>
    </button>

    <ImagePickerSheet v-model="showPicker" @picked="onImagePicked" />
  </div>
</template>
