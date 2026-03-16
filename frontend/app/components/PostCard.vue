<script setup>
defineProps({
	post: { type: Object, required: true }
})

const apiUrl = useApiUrl()
const { sharePost } = useShare()
</script>

<template>
	<div class="bg-surface border border-[var(--border)] rounded-2xl overflow-hidden">
		<!-- En-tête : avatar + nom -->
		<NuxtLink v-if="post.user" :to="`/user/${post.user.id}`" class="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-colors duration-150">
			<div class="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-serif text-[15px] italic overflow-hidden shrink-0">
				<img v-if="post.user.avatar" :src="`${apiUrl}/storage/${post.user.avatar}`" :alt="post.user.firstname" class="w-full h-full object-cover" />
				<span v-else>{{ post.user.firstname?.charAt(0).toUpperCase() }}</span>
			</div>
			<span class="text-body text-sm font-medium">{{ post.user.firstname }} {{ post.user.lastname }}</span>
		</NuxtLink>
		<!-- Contenu + bouton partager -->
		<div class="flex items-end px-4 pb-4 gap-2">
			<NuxtLink :to="`/post/${post.id}`" class="flex-1 hover:opacity-80 transition-opacity duration-150">
				<h2 class="text-body font-semibold mb-1">{{ post.title }}</h2>
				<p class="text-muted text-sm">{{ post.description?.length > 80 ? post.description.slice(0, 80) + '…' : post.description }}</p>
			</NuxtLink>
			<button @click.prevent="sharePost(post)" class="shrink-0 w-8 h-8 flex items-center justify-center text-faint hover:text-muted transition-colors duration-150">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
					<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
		</div>
	</div>
</template>
