export const useImagePicker = () => {
  const pickImage = async (source: 'camera' | 'gallery'): Promise<File | null> => {

    // ── Capacitor natif (Android / iOS) ──────────────────────────
    if (window.Capacitor?.isNativePlatform?.()) {
      const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera')
      try {
        const photo = await Camera.getPhoto({
          quality: 85,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos,
        })
        const blob = await (await fetch(photo.dataUrl!)).blob()
        return new File([blob], `photo.${photo.format}`, { type: `image/${photo.format}` })
      } catch {
        return null // annulé par l'utilisateur
      }
    }

    // ── Web fallback ─────────────────────────────────────────────
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      if (source === 'camera') input.setAttribute('capture', 'environment')
      input.onchange = () => resolve(input.files?.[0] ?? null)
      input.addEventListener('cancel', () => resolve(null))
      input.click()
    })
  }

  return { pickImage }
}
