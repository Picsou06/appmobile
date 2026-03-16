<script setup>
const { posts, isLoading, hasMore, loadPosts, loadMorePosts } = usePosts()

const sentinel = ref(null)
let observer = null

onMounted(async () => {
	await loadPosts()

	observer = new IntersectionObserver((entries) => {
		if (entries[0].isIntersecting) loadMorePosts()
	}, { threshold: 0.1 })

	if (sentinel.value) observer.observe(sentinel.value)
})

onUnmounted(() => observer?.disconnect())
</script>


<template>
	<div class="min-h-screen flex flex-col bg-bg animate-fade-in">

		<AppHeader title="Accueil" />

		<!-- Bouton créer un post -->
		<NuxtLink to="/post/create" class="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-[0_8px_32px_var(--accent-glow)] hover:brightness-110 transition-[filter] duration-150">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
				<path d="M12 5v14M5 12h14" stroke="white" stroke-width="2" stroke-linecap="round" />
			</svg>
		</NuxtLink>

		<main class="flex-1 p-4">
			<div v-if="posts.length" class="space-y-4">
				<PostCard v-for="post in posts" :key="post.id" :post="post" />
			</div>
			<div v-else-if="isLoading" class="flex justify-center items-center py-16">
				<div class="w-8 h-8 rounded-full border-2 border-surface-hover border-t-accent animate-spin" />
			</div>
			<div v-else class="text-center text-muted py-16">Aucun post pour le moment</div>

			<!-- Sentinel + Loader de pagination -->
			<div ref="sentinel" class="flex justify-center items-center py-8">
				<div v-if="isLoading" class="w-8 h-8 rounded-full border-2 border-surface-hover border-t-accent animate-spin" />
			</div>
		</main>

	</div>
</template>
