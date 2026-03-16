export const useApi = () => {
  const { token, logout } = useAuth()

  return $fetch.create({
    onRequest({ options }) {
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`,
        }
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        logout()
      }
    },
  })
}
