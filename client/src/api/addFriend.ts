import { baseUrl } from '@/constants/baseUrl'
import useGetToken from '@/hooks/useGetToken'
import { useToast } from 'vue-toastification'

export default async function addFriend(userId: string) {
  const jwtToken = useGetToken()
  const toast = useToast()

  try {
    const response = await fetch(`${baseUrl}/users/add`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      },
      body: JSON.stringify({
        id: userId
      })
    })

    if (!response.ok) {
      const error = await response.json()
      toast.error(error.message)
      return
    } else {
      await response.json()
      return { isAlreadyFriends: undefined, isFriendRequested: true }
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
  }
}
