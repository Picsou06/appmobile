<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const config = useRuntimeConfig()
const { getPosition }     = useGeolocation()
const { fetchAdsForFeed } = useAds()

const API_KEY = (config.public as any).GOOGLE_MAPS_API_KEY as string

const mapRef       = ref<HTMLElement | null>(null)
const isLoading    = ref(true)
const error        = ref('')
const selectedAd   = ref<any>(null)
const routeInfo    = ref<{ distance: string; duration: string } | null>(null)
const routeLoading = ref(false)

let userPos           = { lat: 0, lng: 0 }
let nativeMap: any    = null
let webMap: any       = null
let nativePolylineId: string | null = null
let webPolyline: any  = null

const isNative = () => !!(window as any).Capacitor?.isNativePlatform?.()

const formatDuration = (durationStr: string) => {
  const s = parseInt(durationStr)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${m} min`
}

const formatDistance = (meters: number) =>
  meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`

const decodePolyline = (encoded: string): { lat: number; lng: number }[] => {
  const points: { lat: number; lng: number }[] = []
  let index = 0, lat = 0, lng = 0
  while (index < encoded.length) {
    let b, shift = 0, result = 0
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20)
    lat += result & 1 ? ~(result >> 1) : result >> 1
    shift = result = 0
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20)
    lng += result & 1 ? ~(result >> 1) : result >> 1
    points.push({ lat: lat * 1e-5, lng: lng * 1e-5 })
  }
  return points
}

const computeRoute = async (destLat: number, destLng: number) => {
  const res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
    },
    body: JSON.stringify({
      origin:      { location: { latLng: { latitude: userPos.lat,  longitude: userPos.lng } } },
      destination: { location: { latLng: { latitude: destLat,      longitude: destLng    } } },
      travelMode: 'DRIVE',
    }),
  })
  const data = await res.json()
  return data.routes?.[0] ?? null
}

const clearPolyline = async () => {
  if (nativePolylineId) {
    await nativeMap?.removePolylines([nativePolylineId])
    nativePolylineId = null
  }
  if (webPolyline) {
    webPolyline.setMap(null)
    webPolyline = null
  }
}

const drawNativeRoute = async (points: { lat: number; lng: number }[]) => {
  await clearPolyline()
  const ids = await nativeMap.addPolylines([{
    path: points, strokeColor: '#FF4D6D', strokeWeight: 5, strokeOpacity: 1, geodesic: true, zIndex: 1,
  }])
  nativePolylineId = ids[0]
}

const drawWebRoute = (points: { lat: number; lng: number }[]) => {
  clearPolyline()
  const google = (window as any).google
  webPolyline = new google.maps.Polyline({
    path: points, geodesic: true, strokeColor: '#FF4D6D', strokeOpacity: 1, strokeWeight: 5, map: webMap,
  })
}

watch(selectedAd, async (ad) => {
  routeInfo.value = null
  if (!ad) { await clearPolyline(); return }

  routeLoading.value = true
  try {
    const route = await computeRoute(Number(ad.lat), Number(ad.lng))
    if (!route) return
    routeInfo.value = {
      distance: formatDistance(route.distanceMeters),
      duration: formatDuration(route.duration),
    }
    const points = decodePolyline(route.polyline.encodedPolyline)
    if (isNative()) await drawNativeRoute(points)
    else            drawWebRoute(points)
  } catch {}
  finally {
    routeLoading.value = false
  }
})

const initNativeMap = async (ads: any[]) => {
  const { GoogleMap } = await import('@capacitor/google-maps')
  nativeMap = await GoogleMap.create({
    id: 'ads-map', element: mapRef.value!, apiKey: API_KEY,
    config: { center: { lat: userPos.lat, lng: userPos.lng }, zoom: 13 },
    forceCreate: true,
  })

  await nativeMap.addMarker({
    coordinate: { lat: userPos.lat, lng: userPos.lng },
    title: 'Vous êtes ici',
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  })

  const markerMap: Record<string, any> = {}
  for (const ad of ads) {
    if (!ad.lat || !ad.lng) continue
    const markerId = await nativeMap.addMarker({
      coordinate: { lat: Number(ad.lat), lng: Number(ad.lng) },
      title: ad.title, snippet: ad.city,
    })
    markerMap[markerId] = ad
  }

  await nativeMap.setOnMarkerClickListener((ev: { markerId: string }) => {
    selectedAd.value = markerMap[ev.markerId] ?? null
  })
}

const loadGmScript = (): Promise<void> => {
  if ((window as any).google?.maps) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&language=fr`
    s.async = true; s.defer = true
    s.onload = () => resolve(); s.onerror = reject
    document.head.appendChild(s)
  })
}

const initWebMap = async (ads: any[]) => {
  await loadGmScript()
  const google = (window as any).google
  webMap = new google.maps.Map(mapRef.value!, {
    center: { lat: userPos.lat, lng: userPos.lng }, zoom: 13,
    disableDefaultUI: true, zoomControl: true,
  })

  new google.maps.Marker({
    position: { lat: userPos.lat, lng: userPos.lng }, map: webMap,
    title: 'Vous êtes ici', icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  })

  for (const ad of ads) {
    if (!ad.lat || !ad.lng) continue
    const marker = new google.maps.Marker({
      position: { lat: Number(ad.lat), lng: Number(ad.lng) }, map: webMap, title: ad.title,
    })
    marker.addListener('click', () => { selectedAd.value = ad })
  }
}

onMounted(async () => {
  document.documentElement.style.background = 'transparent'
  document.body.style.background = 'transparent'
  try {
    const pos = await getPosition()
    userPos = pos
    const ads = await fetchAdsForFeed(pos.lat, pos.lng, 50)
    await nextTick()
    if (isNative()) await initNativeMap(ads)
    else            await initWebMap(ads)
  } catch (e: any) {
    error.value = e?.message ?? 'Impossible de charger la carte.'
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  document.documentElement.style.background = ''
  document.body.style.background = ''
  nativeMap?.destroy()
})
</script>


<template>
  <div class="flex flex-col" style="height: 100dvh;">

    <AppHeader title="Carte" back />

    <div v-if="error" class="flex-1 flex flex-col items-center justify-center gap-4 p-6">
      <p class="text-accent text-sm text-center">{{ error }}</p>
      <button @click="error = ''; isLoading = true" class="btn-accent h-10 px-6 rounded-xl text-sm">
        Réessayer
      </button>
    </div>

    <div v-else class="flex-1 relative">

      <div v-if="isLoading"
           class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg z-10">
        <div class="w-10 h-10 rounded-full border-2 border-surface-hover border-t-accent animate-spin" />
        <p class="text-muted text-sm">Chargement de la carte…</p>
      </div>

      <div ref="mapRef" class="w-full h-full" />

      <Transition
        enter-active-class="transition-[opacity,transform] duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-[opacity,transform] duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div v-if="selectedAd" class="absolute bottom-0 left-0 right-0 z-20 p-4"
             :style="{ paddingBottom: 'calc(1rem + var(--sab))' }">
          <div class="bg-surface border border-[var(--border)] rounded-2xl p-4 shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">

            <div class="flex items-start justify-between gap-3 mb-3">
              <div class="min-w-0">
                <h3 class="text-body font-semibold truncate">{{ selectedAd.title }}</h3>
                <p class="text-muted text-sm mt-0.5">{{ selectedAd.city }}</p>
              </div>
              <button @click="selectedAd = null"
                      class="shrink-0 w-7 h-7 flex items-center justify-center text-faint hover:text-muted transition-colors duration-150">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>

            <div v-if="routeLoading" class="flex items-center gap-2 text-muted text-sm">
              <div class="w-4 h-4 rounded-full border-2 border-surface-hover border-t-accent animate-spin shrink-0" />
              Calcul de l'itinéraire…
            </div>

            <div v-else-if="routeInfo" class="flex items-center gap-5">
              <div class="flex items-center gap-1.5 text-accent-gold text-sm font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12h18M3 12l4-4M3 12l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ routeInfo.distance }}
              </div>
              <div class="flex items-center gap-1.5 text-muted text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
                {{ routeInfo.duration }}
              </div>
            </div>

          </div>
        </div>
      </Transition>

    </div>
  </div>
</template>
