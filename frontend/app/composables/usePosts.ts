interface PostData {
  title: string
  description: string
  imageFile?: File | null
}

const toFormData = (data: PostData): FormData => {
  const fd = new FormData()
  fd.append('title', data.title)
  fd.append('description', data.description)
  if (data.imageFile) fd.append('image', data.imageFile)
  return fd
}

// ─── État partagé (module-level singleton) ────────────────────────
const posts       = ref<any[]>([])
const currentPost = ref<any>(null)
const profileUser = ref<any>(null)
const isLoading   = ref(false)
const hasMore     = ref(true)
let page = 1

export const usePosts = () => {
  const apiUrl = useApiUrl()
  const api    = useApi()

  const _resetList = () => {
    page          = 1
    posts.value   = []
    hasMore.value = true
    profileUser.value = null
  }

  // ─── Requêtes ────────────────────────────────────────────────────

  const loadPosts = async () => {
    _resetList()
    isLoading.value = true
    try {
      const res = await api(`${apiUrl}/api/posts?page=1`)
      posts.value   = res.data ?? []
      hasMore.value = (res.data?.length ?? 0) > 0
    } finally {
      isLoading.value = false
    }
  }

  const loadMorePosts = async () => {
    if (isLoading.value || !hasMore.value) return
    isLoading.value = true
    page++
    try {
      const res = await api(`${apiUrl}/api/posts?page=${page}`)
      if (res?.data?.length > 0) {
        posts.value = [...posts.value, ...res.data]
      } else {
        hasMore.value = false
      }
    } catch {
      page--
    } finally {
      isLoading.value = false
    }
  }

  const loadUserPosts = async (userId: string | number) => {
    _resetList()
    isLoading.value = true
    try {
      const res = await api(`${apiUrl}/api/users/${userId}/posts?page=1`)
      posts.value   = res.data ?? []
      hasMore.value = (res.data?.length ?? 0) > 0
      if (res.data?.[0]?.user) profileUser.value = res.data[0].user
    } finally {
      isLoading.value = false
    }
  }

  const loadMoreUserPosts = async (userId: string | number) => {
    if (isLoading.value || !hasMore.value) return
    isLoading.value = true
    page++
    try {
      const res = await api(`${apiUrl}/api/users/${userId}/posts?page=${page}`)
      if (res?.data?.length > 0) {
        posts.value = [...posts.value, ...res.data]
        if (!profileUser.value && res.data[0]?.user) profileUser.value = res.data[0].user
      } else {
        hasMore.value = false
      }
    } catch {
      page--
    } finally {
      isLoading.value = false
    }
  }

  const loadPost = async (postId: string | number) => {
    currentPost.value = null
    const res = await api(`${apiUrl}/api/users/posts/${postId}`)
    currentPost.value = res.data ?? res
  }

  // ─── Mutations ───────────────────────────────────────────────────

  const createPost = async (data: PostData) => {
    const res     = await api(`${apiUrl}/api/posts`, { method: 'POST', body: toFormData(data) })
    const created = res.data ?? res
    posts.value   = [created, ...posts.value]
    return created
  }

  const updatePost = async (postId: string | number, data: PostData) => {
    const res     = await api(`${apiUrl}/api/posts/${postId}`, { method: 'POST', body: toFormData(data) })
    const updated = res.data ?? res
    posts.value   = posts.value.map(p => p.id === Number(postId) ? updated : p)
    if (currentPost.value?.id === Number(postId)) currentPost.value = updated
    return updated
  }

  const deletePost = async (postId: string | number) => {
    await api(`${apiUrl}/api/posts/${postId}`, { method: 'DELETE' })
    posts.value = posts.value.filter(p => p.id !== Number(postId))
    if (currentPost.value?.id === Number(postId)) currentPost.value = null
  }

  return {
    // State (readonly pour forcer les mutations via les méthodes)
    posts:       readonly(posts),
    currentPost: readonly(currentPost),
    profileUser: readonly(profileUser),
    isLoading:   readonly(isLoading),
    hasMore:     readonly(hasMore),
    // Requêtes
    loadPosts,
    loadMorePosts,
    loadUserPosts,
    loadMoreUserPosts,
    loadPost,
    // Mutations
    createPost,
    updatePost,
    deletePost,
  }
}
