<script setup>
const route = useRoute()
const { currentPost, loadPost, updatePost } = usePosts()
const { user } = useAuth()

const postId    = route.params.id
const mode      = ref('view')
const saving    = ref(false)
const saveError = ref(null)
const loadError = ref(false)

onMounted(async () => {
	try {
		await loadPost(postId)
	} catch {
		loadError.value = true
	}
})

const isOwner = computed(() =>
	currentPost.value && user.value && currentPost.value.user_id === user.value.id
)

const handleSave = async ({ title, description, imageFile }) => {
	saving.value    = true
	saveError.value = null
	try {
		await updatePost(postId, { title, description, imageFile })
		mode.value = 'view'
	} catch (e) {
		saveError.value = e?.data?.message ?? 'Erreur lors de la sauvegarde.'
	} finally {
		saving.value = false
	}
}
</script>


<template>
	<div class="min-h-screen flex flex-col bg-bg animate-fade-in">

		<AppHeader :title="mode === 'edit' ? 'Modifier' : 'Post'" back>
			<template #right>
				<button
					v-if="isOwner && mode === 'view'"
					@click="mode = 'edit'"
					class="w-9 h-9 flex items-center justify-center text-muted hover:text-body transition-colors duration-150"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
						<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
					</svg>
				</button>
			</template>
		</AppHeader>

		<main class="flex-1">

			<div v-if="loadError" class="p-4 text-center text-accent">
				Impossible de charger ce post.
			</div>

			<div v-else-if="!currentPost" class="flex justify-center items-center py-16">
				<div class="w-8 h-8 rounded-full border-2 border-surface-hover border-t-accent animate-spin" />
			</div>

			<template v-else>
				<p v-if="saveError" class="mx-4 mt-4 text-accent text-sm">{{ saveError }}</p>

				<PostDetail
					:post="currentPost"
					:mode="mode"
					:saving="saving"
					@save="handleSave"
					@cancel="mode = 'view'"
				/>
			</template>

		</main>

	</div>
</template>
