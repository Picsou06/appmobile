import { LocalNotifications } from '@capacitor/local-notifications'

const POLL_INTERVAL = 30_000

let pollTimer: ReturnType<typeof setInterval> | null = null
const lastCounts = new Map<number, { othersLikes: number; comments: number }>()

export const useNotifications = () => {
  const { user } = useAuth()
  const apiUrl   = useApiUrl()
  const api      = useApi()

  const schedule = async (title: string, body: string) => {
    try {
      await LocalNotifications.schedule({
        notifications: [{ title, body, id: Math.floor(Math.random() * 1_000_000), schedule: { at: new Date(Date.now() + 500) } }],
      })
    } catch {}
  }

  const postPreview = (post: any): string => post.title || post.description?.slice(0, 40) || ''

  const notifyLike = (post: any, actorId: number | undefined) => {
    if (!user.value || !actorId || post.user_id === actorId) return
    schedule('Nouveau like 👍', `Votre like sur « ${postPreview(post)} » a été enregistré`)
  }

  const notifyComment = (post: any, actorId: number | undefined, actorName: string) => {
    if (!user.value || !actorId || post.user_id === actorId) return
    schedule('Nouveau commentaire 💬', `${actorName} a commenté « ${postPreview(post)} »`)
  }

  const fetchCounts = async () => {
    if (!user.value) return
    try {
      const res: any = await api(`${apiUrl}/api/user/posts`)
      const posts: any[] = res?.data ?? []

      for (const post of posts) {
        const id          = post.id as number
        const totalLikes  = (post.likes_count    as number) ?? 0
        const comments    = (post.comments_count as number) ?? 0
        const othersLikes = totalLikes - (post.liked_by_me === true ? 1 : 0)
        const prev        = lastCounts.get(id)

        if (!prev) {
          lastCounts.set(id, { othersLikes, comments })
          continue
        }

        if (othersLikes > prev.othersLikes) {
          const delta = othersLikes - prev.othersLikes
          schedule(
            'Nouveau like 👍',
            `${delta > 1 ? `${delta} personnes ont` : "Quelqu'un a"} aimé « ${postPreview(post)} »`,
          )
        }

        if (comments > prev.comments) {
          const delta = comments - prev.comments
          schedule(
            'Nouveau commentaire 💬',
            `${delta > 1 ? `${delta} nouveaux commentaires` : 'Nouveau commentaire'} sur « ${postPreview(post)} »`,
          )
        }

        lastCounts.set(id, { othersLikes, comments })
      }
    } catch {}
  }

  const startPolling = () => {
    if (pollTimer) return
    LocalNotifications.requestPermissions().catch(() => {})
    fetchCounts()
    pollTimer = setInterval(fetchCounts, POLL_INTERVAL)
  }

  const stopPolling = () => {
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
    lastCounts.clear()
  }

  return { notifyLike, notifyComment, startPolling, stopPolling }
}
