export const useShare = () => {
  const sharePost = async (post: any) => {
    const author = `${post.user?.firstname ?? ''} ${post.user?.lastname ?? ''}`.trim()
    const title  = `🔥 Regarde ce post sur la meilleure app du monde !`
    const text   = `${author} a posté : "${post.title}" — ${post.description ?? ''}\n\nDécouvre ça sur AppMobile 👇`
    const url    = `${window.location.origin}/post/${post.id}`

    // ── Capacitor Share (Android / iOS) ──────────────────────────
    if (window.Capacitor?.isNativePlatform?.()) {
      const { Share } = await import('@capacitor/share')
      try {
        await Share.share({ title, text, url })
      } catch {
        // L'utilisateur a annulé — pas d'erreur à afficher
      }
      return
    }

    // ── navigator.share (PWA / Chrome Android) ───────────────────
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch {
        // Annulé par l'utilisateur
      }
      return
    }

    // ── Fallback : copie dans le presse-papiers ──────────────────
    try {
      await navigator.clipboard.writeText(url)
      alert('Lien copié dans le presse-papiers !')
    } catch {
      alert(`Lien : ${url}`)
    }
  }

  return { sharePost }
}
