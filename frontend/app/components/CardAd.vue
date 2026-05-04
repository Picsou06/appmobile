<script setup>
defineProps({
  ad: { type: Object, required: true }
})
</script>

<template>
  <div class="bg-surface border border-[var(--border)] rounded-2xl px-4 py-3 flex items-center gap-4">
    <div class="flex-1 min-w-0">
      <h2 class="text-body font-semibold truncate">{{ ad.title }}</h2>
      <p class="text-muted text-sm mt-0.5 truncate">{{ ad.city }}</p>
    </div>
    <span v-if="Number.isFinite(Number(ad.distance))" class="shrink-0 text-accent-gold text-sm font-medium">
      à {{ Math.round(ad.distance) }} km
    </span>
  </div>
</template>
