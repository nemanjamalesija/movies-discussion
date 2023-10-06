import { baseUrl } from '@/constants/baseUrl'
import useGetToken from '@/composables/useGetToken'
import { useToast } from 'vue-toastification'

export default async function deleteFriend(userId: string) {
  const toast = useToast()
  const jwtToken = useGetToken()

  try {
    const response = await fetch(`${baseUrl}/users/remove`, {
      method: 'DELETE',
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
      const {
        data: { targetUser }
      } = await response.json()

      toast.success('User removed from your friends list')
      return targetUser
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
  }
}
