import useGetToken from '@/composables/useGetToken'
import { baseUrl } from '../constants/baseUrl'
import useAppNavigation from '../composables/useAppNavigation'

export default async function useGetSession() {
  const { toast, router } = useAppNavigation()
  const jwtToken = useGetToken()

  try {
    const response = await fetch(`${baseUrl}/users/getUserWithToken`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      }
    })

    if (!response.ok) {
      const error = await response.json()
      toast.error(error.message)

      return undefined
    }

    const data = await response.json()

    if (data.status === 'success') {
      const {
        data: { user }
      } = data

      return user
    }
  } catch (error) {
    console.log(error)
    router.push('/login')
    return undefined
  }
}
