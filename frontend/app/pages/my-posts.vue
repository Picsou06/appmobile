<script setup>
definePageMeta({ middleware: 'auth' })

const apiUrl = useApiUrl()
const { user } = useAuth()
const { posts, isLoading, hasMore, loadUserPosts, loadMoreUserPosts } = usePosts()

const sentinel = ref(null)
let observer = null

onMounted(async () => {
	if (!user.value?.id) return
	await loadUserPosts(user.value.id)

	observer = new IntersectionObserver((entries) => {
		if (entries[0].isIntersecting) loadMoreUserPosts(user.value.id)
	}, { threshold: 0.1 })

	if (sentinel.value) observer.observe(sentinel.value)
})

onUnmounted(() => observer?.disconnect())

const initials = computed(() =>
	user.value?.firstname?.charAt(0).toUpperCase() ?? '?'
)
</script>


<template>
	<div class="min-h-screen flex flex-col bg-bg animate-fade-in">

		<AppHeader title="Mon Compte" back />

		<main class="flex-1 p-4">

			<div v-if="user" class="flex flex-col items-center py-6 mb-4">
				<div class="w-20 h-20 rounded-full bg-accent text-white flex items-center justify-center font-serif text-3xl italic overflow-hidden mb-3">
					<img v-if="user.avatar" :src="`${apiUrl}/storage/${user.avatar}`" :alt="user.firstname" class="w-full h-full object-cover" />
					<span v-else>{{ initials }}</span>
				</div>
				<p class="text-body font-semibold text-lg">{{ user.firstname }} {{ user.lastname }}</p>
				<p class="text-muted text-sm font-mono mt-1">{{ user.email }}</p>
			</div>

			<div v-if="posts.length" class="space-y-4">
				<PostCard v-for="post in posts" :key="post.id" :post="post" />
			</div>
			<div v-else-if="isLoading" class="flex justify-center items-center py-16">
				<div class="w-8 h-8 rounded-full border-2 border-surface-hover border-t-accent animate-spin" />
			</div>
			<div v-else class="text-center text-muted py-8">Aucun post pour l'instant</div>

			<div ref="sentinel" class="flex justify-center items-center py-8">
				<div v-if="isLoading && posts.length" class="w-8 h-8 rounded-full border-2 border-surface-hover border-t-accent animate-spin" />
			</div>

		</main>

	</div>
</template>
