export const useApiUrl = () => {
  const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
  return APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL
}
