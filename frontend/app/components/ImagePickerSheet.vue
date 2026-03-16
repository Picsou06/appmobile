<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'picked'])
const { pickImage } = useImagePicker()

const select = async (source) => {
  emit('update:modelValue', false)
  const file = await pickImage(source)
  emit('picked', file)
}

const cancel = () => emit('update:modelValue', false)
</script>

<template>
  <Teleport to="body">
    <Transition name="backdrop">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 bg-black/50"
        @click="cancel"
      />
    </Transition>
    <Transition name="sheet">
      <div
        v-if="modelValue"
        class="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-3xl px-4 pt-4 flex flex-col gap-2"
        style="padding-bottom: calc(16px + var(--sab))"
      >
        <!-- Handle -->
        <div class="w-10 h-1 rounded-full bg-[var(--border)] mx-auto mb-3" />

        <!-- Camera -->
        <button
          @click="select('camera')"
          class="flex items-center gap-3 w-full px-4 h-14 rounded-2xl bg-[rgba(255,255,255,0.04)] text-body text-sm font-medium hover:bg-[rgba(255,255,255,0.08)] transition-colors duration-150"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          Appareil photo
        </button>

        <!-- Gallery -->
        <button
          @click="select('gallery')"
          class="flex items-center gap-3 w-full px-4 h-14 rounded-2xl bg-[rgba(255,255,255,0.04)] text-body text-sm font-medium hover:bg-[rgba(255,255,255,0.08)] transition-colors duration-150"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
            <path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Galerie
        </button>

        <!-- Cancel -->
        <button
          @click="cancel"
          class="flex items-center justify-center w-full h-14 rounded-2xl border border-[var(--border)] text-muted text-sm font-medium hover:text-body transition-colors duration-150 mt-1 mb-2"
        >
          Annuler
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.2s ease;
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: transform 0.25s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}
</style>
