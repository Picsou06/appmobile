<script setup>
const router = useRouter()
const { createPost } = usePosts()

const title       = ref('')
const description = ref('')
const imageFile   = ref(null)
const imagePreview = ref(null)
const isSubmitting = ref(false)
const error        = ref(null)

const onFileChange = (e) => {
	const file = e.target.files[0]
	if (!file) return
	imageFile.value = file
	imagePreview.value = URL.createObjectURL(file)
}

const removeImage = () => {
	imageFile.value = null
	imagePreview.value = null
}

const submit = async () => {
	if (!title.value.trim() || !description.value.trim()) {
		error.value = 'Le titre et la description sont requis.'
		return
	}

	isSubmitting.value = true
	error.value = null

	try {
		await createPost({
			title: title.value,
			description: description.value,
			imageFile: imageFile.value,
		})
		router.push('/')
	} catch (e) {
		error.value = e?.data?.message ?? 'Une erreur est survenue.'
	} finally {
		isSubmitting.value = false
	}
}
</script>


<template>
	<div class="min-h-screen flex flex-col bg-bg animate-fade-in">

		<AppHeader title="Nouveau post" back />

		<main class="flex-1 flex flex-col gap-5 p-4 pt-6">

			<!-- Image -->
			<div class="flex flex-col gap-2">
				<label class="text-muted text-xs font-mono uppercase tracking-widest">Photo (optionnel)</label>
				<label v-if="!imagePreview" class="flex flex-col items-center justify-center w-full h-40 rounded-2xl border border-dashed border-[var(--border)] text-muted hover:border-accent hover:text-accent transition-colors duration-150 cursor-pointer">
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" class="mb-2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
					<span class="text-sm">Choisir une image</span>
					<input type="file" accept="image/*" class="hidden" @change="onFileChange" />
				</label>
				<div v-else class="relative w-full h-40 rounded-2xl overflow-hidden">
					<img :src="imagePreview" class="w-full h-full object-cover" />
					<button @click="removeImage" class="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors duration-150">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
							<path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
						</svg>
					</button>
				</div>
			</div>

			<!-- Titre -->
			<div class="flex flex-col gap-1 border border-[var(--border)] rounded-2xl bg-surface px-4 py-3">
				<label class="text-muted text-xs font-mono uppercase tracking-widest">Titre</label>
				<input
					v-model="title"
					type="text"
					placeholder="Titre du post"
					class="w-full bg-transparent text-body text-sm placeholder:text-faint outline-none"
				/>
			</div>

			<!-- Description -->
			<div class="flex flex-col gap-1 border border-[var(--border)] rounded-2xl bg-surface px-4 py-3">
				<label class="text-muted text-xs font-mono uppercase tracking-widest">Description</label>
				<textarea
					v-model="description"
					rows="5"
					placeholder="Décrivez votre post..."
					class="w-full bg-transparent text-body text-sm placeholder:text-faint outline-none resize-none"
				/>
			</div>

			<!-- Erreur -->
			<p v-if="error" class="text-accent text-sm">{{ error }}</p>

			<!-- Soumettre -->
			<button
				@click="submit"
				:disabled="isSubmitting"
				class="btn-accent w-full h-12 rounded-2xl font-medium text-sm disabled:opacity-50 hover:shadow-[0_8px_32px_var(--accent-glow)] transition-shadow duration-200"
			>
				<span v-if="isSubmitting" class="flex items-center justify-center gap-2">
					<span class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
					Publication...
				</span>
				<span v-else>Publier</span>
			</button>

		</main>

	</div>
</template>
