<script setup>
const { posts, isLoading, hasMore, loadPosts, loadMorePosts } = usePosts()
const { getPosition } = useGeolocation()
const { fetchAdsForFeed } = useAds()

const feedAds = ref([])

const sentinel = ref(null)
let observer = null

const randomInterval = () => Math.floor(Math.random() * 4) + 2

const mixedFeed = computed(() => {
	if (!feedAds.value.length) {
		return posts.value.map(post => ({ type: 'post', key: `post-${post.id}`, data: post }))
	}

	const items = []
	let adIndex = 0
	let countSinceLastAd = 0
	let nextInsertAt = randomInterval()

	for (const post of posts.value) {
		items.push({ type: 'post', key: `post-${post.id}`, data: post })
		countSinceLastAd++

		if (adIndex < feedAds.value.length && countSinceLastAd >= nextInsertAt) {
			const ad = feedAds.value[adIndex]
			items.push({ type: 'ad', key: `ad-${ad.id}-${adIndex}`, data: ad })
			adIndex++
			countSinceLastAd = 0
			nextInsertAt = randomInterval()
		}
	}

	return items
})

onMounted(async () => {
	await loadPosts()

	try {
		const { lat, lng } = await getPosition()
		feedAds.value = await fetchAdsForFeed(lat, lng, 15)
	} catch {
		feedAds.value = []
	}

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
				<template v-for="item in mixedFeed" :key="item.key">
					<PostCard v-if="item.type === 'post'" :post="item.data" />
					<CardAd v-else :ad="item.data" />
				</template>
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
