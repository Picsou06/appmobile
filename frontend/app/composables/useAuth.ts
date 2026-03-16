export const useAuth = () => {
  const user = useState<any>('user', () => null)
  const token = useState<string | null>('token', () => {
    if (process.client) {
      return localStorage.getItem('token')
    }
    return null
  })

  const apiUrl = useApiUrl()

  const login = async (email: string, password: string) => {
    const url = `${apiUrl}/api/login`
    console.log(`[AppMobile] login() → POST ${url}`)
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      console.log(`[AppMobile] login() ← HTTP ${res.status} ${res.statusText}`)

      if (!res.ok) throw new Error(`Login failed: HTTP ${res.status}`)

      const data = await res.json()

      token.value = data.token
      user.value = data.user

      localStorage.setItem('token', data.token)

      console.log(`[AppMobile] login() → succès, user: ${data.user?.email}`)
      return true

    } catch (e: any) {
      console.error(`[AppMobile] login() ERREUR: ${e?.message}`)
      console.error(`[AppMobile] login() Stack: ${e?.stack}`)
      return false
    }
  }


  const fetchUser = async () => {
    if (!token.value) return

    const url = `${apiUrl}/api/user`
    console.log(`[AppMobile] fetchUser() → GET ${url}`)
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      console.log(`[AppMobile] fetchUser() ← HTTP ${res.status} ${res.statusText}`)

      if (res.ok) {
        user.value = await res.json()
        console.log(`[AppMobile] fetchUser() → succès, user: ${user.value?.email}`)
      } else {
        console.error(`[AppMobile] fetchUser() ERREUR HTTP ${res.status}`)
      }
    } catch (e: any) {
      console.error(`[AppMobile] fetchUser() ERREUR réseau: ${e?.message}`)
      console.error(`[AppMobile] fetchUser() Stack: ${e?.stack}`)
    }
  }


  const logout = async () => {
    await fetch(`${apiUrl}/api/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })


    token.value = null
    user.value = null
    localStorage.removeItem('token')
    navigateTo('/login')
  }


  return {
    user,
    token,
    login,
    logout,
    fetchUser
  }
}
