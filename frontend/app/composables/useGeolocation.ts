const CACHE_KEY = 'geolocation_cache'
const CACHE_TTL = 5 * 60 * 1000
let permissionGranted = false

const readCache = (): { lat: number; lng: number } | null => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { lat, lng, at } = JSON.parse(raw)
    if (Date.now() - at < CACHE_TTL) return { lat, lng }
  } catch {}
  return null
}

const writeCache = (lat: number, lng: number) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ lat, lng, at: Date.now() }))
  } catch {}
}

export const useGeolocation = () => {
  const getPosition = async (): Promise<{ lat: number; lng: number }> => {
    const cached = readCache()
    if (cached) return cached

    let position: { lat: number; lng: number }

    const isNativePlatform = (window as typeof window & { Capacitor?: { isNativePlatform?: () => boolean } })
      .Capacitor?.isNativePlatform?.()

    if (isNativePlatform) {
      const { Geolocation } = await import('@capacitor/geolocation')
      if (!permissionGranted) {
        const status = await Geolocation.checkPermissions()
        if (status.location !== 'granted') {
          const requested = await Geolocation.requestPermissions()
          if (requested.location !== 'granted') {
            throw new Error('Permission de géolocalisation refusée.')
          }
        }
        permissionGranted = true
      }
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 30000 })
      position = { lat: pos.coords.latitude, lng: pos.coords.longitude }
    } else {
      position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Géolocalisation non supportée par ce navigateur.'))
          return
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          (err) => reject(new Error(err.message)),
          { enableHighAccuracy: true, timeout: 30000 },
        )
      })
    }

    writeCache(position.lat, position.lng)
    return position
  }

  return { getPosition }
}
