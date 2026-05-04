interface AdData {
  title: string
  description: string
  city: string
  lat: number
  lng: number
  imageFile?: File | null
}

const toFormData = (data: AdData): FormData => {
  const fd = new FormData()
  fd.append('title', data.title)
  fd.append('description', data.description)
  fd.append('city', data.city)
  fd.append('lat', String(data.lat))
  fd.append('lng', String(data.lng))
  if (data.imageFile) fd.append('image', data.imageFile)
  return fd
}

const ads       = ref<any[]>([])
const myAds     = ref<any[]>([])
const currentAd = ref<any>(null)
const isLoading = ref(false)
const hasMore   = ref(true)
const hasMoreMy = ref(true)

let page = 1
let myPage = 1
let currentLat = 0
let currentLng = 0

export const useAds = () => {
  const apiUrl = useApiUrl()
  const api    = useApi()

  const _resetList = (lat: number, lng: number) => {
    page          = 1
    ads.value     = []
    hasMore.value = true
    currentLat    = lat
    currentLng    = lng
  }

  const _resetMyList = () => {
    myPage = 1
    myAds.value = []
    hasMoreMy.value = true
  }

  const loadAds = async (lat: number, lng: number) => {
    _resetList(lat, lng)
    isLoading.value = true
    try {
      const res = await api(`${apiUrl}/api/ads?lat=${lat}&lng=${lng}&page=1`)
      ads.value   = res.data ?? []
      hasMore.value = (res.data?.length ?? 0) > 0
    } finally {
      isLoading.value = false
    }
  }

  const loadMoreAds = async () => {
    if (isLoading.value || !hasMore.value) return
    isLoading.value = true
    page++
    try {
      const res = await api(`${apiUrl}/api/ads?lat=${currentLat}&lng=${currentLng}&page=${page}`)
      if (res?.data?.length > 0) {
        ads.value = [...ads.value, ...res.data]
      } else {
        hasMore.value = false
      }
    } catch {
      page--
    } finally {
      isLoading.value = false
    }
  }

  const loadMyAds = async () => {
    _resetMyList()
    isLoading.value = true
    try {
      const res = await api(`${apiUrl}/api/user/ads?page=1`)
      myAds.value = res.data ?? []
      hasMoreMy.value = (res.data?.length ?? 0) > 0
    } finally {
      isLoading.value = false
    }
  }

  const loadMoreMyAds = async () => {
    if (isLoading.value || !hasMoreMy.value) return
    isLoading.value = true
    myPage++
    try {
      const res = await api(`${apiUrl}/api/user/ads?page=${myPage}`)
      if (res?.data?.length > 0) {
        myAds.value = [...myAds.value, ...res.data]
      } else {
        hasMoreMy.value = false
      }
    } catch {
      myPage--
    } finally {
      isLoading.value = false
    }
  }

  const loadAd = async (adId: string | number) => {
    const res = await api(`${apiUrl}/api/ads/${adId}`)
    currentAd.value = res.data ?? res
    return currentAd.value
  }

  const createAd = async (data: AdData) => {
    const res = await api(`${apiUrl}/api/ads`, { method: 'POST', body: toFormData(data) })
    const created = res.data ?? res
    myAds.value = [created, ...myAds.value]
    return created
  }

  const updateAd = async (adId: string | number, data: AdData) => {
    const res = await api(`${apiUrl}/api/ads/${adId}`, { method: 'POST', body: toFormData(data) })
    const updated = res.data ?? res
    ads.value = ads.value.map(ad => ad.id === Number(adId) ? updated : ad)
    myAds.value = myAds.value.map(ad => ad.id === Number(adId) ? updated : ad)
    if (currentAd.value?.id === Number(adId)) currentAd.value = updated
    return updated
  }

  const fetchAdsForFeed = async (lat: number, lng: number, perPage = 20) => {
    const res = await api(`${apiUrl}/api/ads?lat=${lat}&lng=${lng}&page=1&per_page=${perPage}`)
    return res.data ?? []
  }

  return {
    ads:       readonly(ads),
    myAds:     readonly(myAds),
    currentAd: readonly(currentAd),
    isLoading: readonly(isLoading),
    hasMore:   readonly(hasMore),
    hasMoreMy: readonly(hasMoreMy),
    loadAds,
    loadMoreAds,
    loadMyAds,
    loadMoreMyAds,
    loadAd,
    createAd,
    updateAd,
    fetchAdsForFeed,
  }
}
