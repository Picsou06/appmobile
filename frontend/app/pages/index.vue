<script setup>
const apiUrl = useApiUrl()

const { user } = useAuth()

let page = 1
let isLoading = false
let hasMore = true

const { data: posts } = useFetch(`${apiUrl}/api/posts?page=${page}`, {
	headers: {
		Authorization: `Bearer ${user.value?.token}`
	},
	transform: (res) => res.data
})

const handleScroll = async () => {
	if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
		if (isLoading || !hasMore) return;
		
		isLoading = true;
		page++
		console.log('Loading page', page)
		try {
			const res = await $fetch(`${apiUrl}/api/posts?page=${page}`, {
				headers: {
					Authorization: `Bearer ${user.value?.token}`
				}
			})
			if (res && res.data && res.data.length > 0) {
				posts.value = [...posts.value, ...res.data]
			} else {
				hasMore = false;
			}
		} catch (error) {
			console.error(error)
		} finally {
			isLoading = false;
		}
	}
}

onMounted(() => {
	window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll)
})
</script>


<template>
	<div class="min-h-screen flex flex-col bg-bg animate-fade-in">

		<AppHeader title="Accueil" />

		<main class="flex-1 p-4">
			<div v-if="posts" class="space-y-4">
			<div v-for="post in posts" :key="post.id" class="p-4 bg-gray-800 text-white rounded shadow">
				<h2 class="text-lg font-semibold mb-2">{{ post.title }}</h2>
				<p class="text-gray-300">{{ post.description?.length > 20 ? post.description.slice(0, 20) + '...' : post.description }}</p>
			</div>
			</div>
			<div v-else class="text-center text-gray-400">Chargement des posts...</div>
		</main>

	</div>
</template>
