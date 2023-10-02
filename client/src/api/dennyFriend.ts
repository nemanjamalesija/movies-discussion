import { baseUrl } from '../constants/baseUrl'
import useGetToken from '../hooks/useGetToken'
import { useToast } from 'vue-toastification'

export default async function dennyFriend(userId: string) {
  const jwtToken = useGetToken()
  const toast = useToast()

  try {
    const res = await fetch(`${baseUrl}/users/denny`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      },
      body: JSON.stringify({
        id: userId
      })
    })

    if (!res.ok) {
      const errorData = await res.json()
      toast.error(errorData.message)
      return 'fail'
    }

    return 'success'
  } catch (error) {
    toast.error('Oops, something went wrong!')
    console.error(error)
  }
}
