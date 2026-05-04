<script setup lang="ts">
interface Post { [key: string]: any }

const props = withDefaults(defineProps<{
	post:    Post
	mode?:   string
	saving?: boolean
}>(), {
	mode:   'view',
	saving: false,
})

const emit = defineEmits(['save', 'cancel'])

const apiUrl = useApiUrl()
const api    = useApi()
const { user } = useAuth()
const { notifyLike, notifyComment } = useNotifications()
const { sharePost } = useShare()

const likesCount  = ref<number>(props.post.likes_count ?? 0)
const likedByMe   = ref<boolean>(props.post.liked_by_me ?? false)

const toggleLike = async () => {
	const wasLiked = likedByMe.value
	likedByMe.value  = !wasLiked
	likesCount.value += wasLiked ? -1 : 1

	try {
		await api(`${apiUrl}/api/posts/${props.post.id}/like`, { method: 'POST' })
		if (!wasLiked) notifyLike(props.post, user.value?.id)
	} catch {
		likedByMe.value  = wasLiked
		likesCount.value += wasLiked ? 1 : -1
	}
}

const comments     = ref<any[]>(props.post.comments ?? [])
const commentBody  = ref('')
const showComments = ref(false)

const submitComment = async () => {
	const body = commentBody.value.trim()
	if (!body) return

	const res: any = await api(`${apiUrl}/api/posts/${props.post.id}/comments`, {
		method: 'POST',
		body: JSON.stringify({ body }),
	})
	const created = res.data ?? res
	comments.value = [...comments.value, created]
	commentBody.value = ''
	notifyComment(props.post, user.value?.id, user.value?.firstname ?? 'Quelqu\'un')
}

const formattedDate = computed(() => {
	if (!props.post?.created_at) return ''
	return new Intl.DateTimeFormat('fr-FR', {
		day: 'numeric', month: 'long', year: 'numeric'
	}).format(new Date(props.post.created_at))
})

// ─── État formulaire (mode edit) ───────────────────────────────
const title        = ref(props.post.title)
const description  = ref(props.post.description)
const imageFile    = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const showPicker   = ref(false)

watch(() => props.post, (p) => {
	title.value        = p.title
	description.value  = p.description
	imageFile.value    = null
	imagePreview.value = null
})

const onImagePicked = (file: File | null) => {
	if (!file) return
	imageFile.value    = file
	imagePreview.value = URL.createObjectURL(file)
}

const removeImage = () => {
	imageFile.value    = null
	imagePreview.value = null
}

const handleSave = () => {
	emit('save', {
		title:       title.value,
		description: description.value,
		imageFile:   imageFile.value,
	})
}
</script>


<template>
	<!-- ── Mode VIEW ─────────────────────────────────────── -->
	<template v-if="mode === 'view'">
		<div v-if="post.image" class="w-full aspect-video bg-surface overflow-hidden">
			<img :src="`${apiUrl}/storage/${post.image}`" :alt="post.title" class="w-full h-full object-cover" />
		</div>

		<div class="p-4 space-y-4">
			<NuxtLink v-if="post.user" :to="`/user/${post.user.id}`" class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-serif text-base italic overflow-hidden shrink-0">
					<img v-if="post.user.avatar" :src="`${apiUrl}/storage/${post.user.avatar}`" :alt="post.user.firstname" class="w-full h-full object-cover" />
					<span v-else>{{ post.user.firstname?.charAt(0).toUpperCase() }}</span>
				</div>
				<div>
					<p class="text-body text-sm font-medium">{{ post.user.firstname }} {{ post.user.lastname }}</p>
					<p class="text-faint text-xs">{{ formattedDate }}</p>
				</div>
			</NuxtLink>

			<h1 class="text-body font-serif text-2xl font-normal italic leading-snug">{{ post.title }}</h1>
			<p class="text-muted text-sm leading-relaxed">{{ post.description }}</p>

			<!-- Actions -->
			<div class="flex items-center gap-4">
				<!-- Like -->
				<button
					@click="toggleLike"
					class="flex items-center gap-1.5 text-sm transition-colors duration-150"
					:class="likedByMe ? 'text-accent' : 'text-muted hover:text-body'"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
							:fill="likedByMe ? 'currentColor' : 'none'"
							stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
					{{ likesCount }}
				</button>

				<!-- Commentaires -->
				<button
					@click="showComments = !showComments"
					class="flex items-center gap-1.5 text-muted text-sm hover:text-body transition-colors duration-150"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
						<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
							stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
					{{ comments.length }}
				</button>

				<!-- Partager -->
				<button
					@click="sharePost(post)"
					class="flex items-center gap-1.5 text-muted text-sm hover:text-body transition-colors duration-150 ml-auto"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
						<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
					Partager
				</button>
			</div>

			<!-- Section commentaires -->
			<div v-if="showComments" class="border-t border-[var(--border)] pt-4 space-y-3">
				<div v-for="c in comments" :key="c.id" class="flex gap-2">
					<div class="w-7 h-7 rounded-full bg-surface-hover shrink-0 flex items-center justify-center text-xs text-muted font-serif italic">
						{{ c.user?.firstname?.charAt(0).toUpperCase() ?? '?' }}
					</div>
					<div>
						<p class="text-body text-xs font-medium">{{ c.user?.firstname }} {{ c.user?.lastname }}</p>
						<p class="text-muted text-sm">{{ c.body }}</p>
					</div>
				</div>

				<form @submit.prevent="submitComment" class="flex gap-2 pt-1">
					<input
						v-model="commentBody"
						type="text"
						placeholder="Ajouter un commentaire…"
						class="flex-1 bg-surface border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-body placeholder:text-faint outline-none focus:border-accent transition-colors"
					/>
					<button
						type="submit"
						:disabled="!commentBody.trim()"
						class="btn-accent h-9 px-4 rounded-xl text-sm disabled:opacity-40"
					>Envoyer</button>
				</form>
			</div>
		</div>
	</template>

	<!-- ── Mode EDIT ─────────────────────────────────────── -->
	<template v-else>
		<div class="flex flex-col gap-5 p-4 pt-6">

			<!-- Image -->
			<div class="flex flex-col gap-2">
				<label class="text-muted text-xs font-mono uppercase tracking-widest">Photo</label>
				<div class="relative w-full aspect-video rounded-2xl overflow-hidden bg-surface border border-[var(--border)]">
					<img
						:src="imagePreview ?? (post.image ? `${apiUrl}/storage/${post.image}` : undefined)"
						v-if="imagePreview || post.image"
						class="w-full h-full object-cover"
					/>
					<button
						v-else
						type="button"
						@click="showPicker = true"
						class="flex flex-col items-center justify-center w-full h-full text-muted hover:text-accent transition-colors duration-150"
					>
						<svg width="28" height="28" viewBox="0 0 24 24" fill="none" class="mb-1">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
						<span class="text-sm">Choisir une image</span>
					</button>
					<!-- Boutons overlay si image présente -->
					<div v-if="imagePreview || post.image" class="absolute bottom-2 right-2 flex gap-2">
						<button type="button" @click="showPicker = true" class="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white cursor-pointer hover:bg-black/80 transition-colors duration-150">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
								<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
							</svg>
						</button>
						<button v-if="imagePreview" type="button" @click="removeImage" class="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors duration-150">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
								<path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			<!-- Titre -->
			<div class="flex flex-col gap-1 border border-[var(--border)] rounded-2xl bg-surface px-4 py-3">
				<label class="text-muted text-xs font-mono uppercase tracking-widest">Titre</label>
				<input v-model="title" type="text" class="w-full bg-transparent text-body text-sm outline-none placeholder:text-faint" />
			</div>

			<!-- Description -->
			<div class="flex flex-col gap-1 border border-[var(--border)] rounded-2xl bg-surface px-4 py-3">
				<label class="text-muted text-xs font-mono uppercase tracking-widest">Description</label>
				<textarea v-model="description" rows="5" class="w-full bg-transparent text-body text-sm outline-none resize-none placeholder:text-faint" />
			</div>

			<!-- Actions -->
			<div class="flex gap-3">
				<button
					@click="$emit('cancel')"
					class="flex-1 h-12 rounded-2xl border border-[var(--border)] text-muted text-sm font-medium hover:border-[var(--border-hover)] hover:text-body transition-colors duration-150"
				>
					Annuler
				</button>
				<button
					@click="handleSave"
					:disabled="saving"
					class="btn-accent flex-1 h-12 rounded-2xl text-sm disabled:opacity-50"
				>
					<span v-if="saving" class="flex items-center justify-center gap-2">
						<span class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
						Sauvegarde...
					</span>
					<span v-else>Sauvegarder</span>
				</button>
			</div>

		</div>

		<ImagePickerSheet v-model="showPicker" @picked="onImagePicked" />
	</template>
</template>
