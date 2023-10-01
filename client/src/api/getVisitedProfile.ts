import { baseUrl } from '@/constants/baseUrl'
import useGetToken from '@/hooks/useGetToken'
import { useToast } from 'vue-toastification'

export default async function getVisitedProfile(id: string) {
  const toast = useToast()
  const jwtToken = useGetToken()

  try {
    const response = await fetch(`${baseUrl}/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      }
    })

    if (!response.ok) {
      const error = await response.json()
      toast.error(error.message)
      return
    } else {
      const {
        data: { isAlreadyFriends, isFriendRequested, targetUser }
      } = await response.json()

      return { targetUser, isAlreadyFriends, isFriendRequested }
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
  }
}
