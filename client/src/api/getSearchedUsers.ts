import useGetToken from '@/composables/useGetToken'
import { baseUrl } from '@/constants/baseUrl'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export default async function getSearchedUSersAPI(firstName: string, lastName: string) {
  const jwtToken = useGetToken()
  const toast = useToast()
  const router = useRouter()

  if (!jwtToken) {
    toast.error('Could not get your session! Please log in.')
    router.push('/')
  }

  try {
    const response = await fetch(
      `${baseUrl}/users/getSearched?firstName=${firstName}&lastName=${lastName || ''}&limit=10`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + jwtToken
        }
      }
    )

    if (!response.ok) {
      const error = await response.json()
      toast.error(error.message)
      router.push('/login')
      return
    } else {
      const {
        data: { users }
      } = await response.json()

      return users
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
  }
}
