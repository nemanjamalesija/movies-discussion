import { baseUrl } from '@/constants/baseUrl'
import useGetToken from '@/hooks/useGetToken'
import { useToast } from 'vue-toastification'

export default async function unlikePostHandler(postId: string) {
  const jwtToken = useGetToken()
  const toast = useToast()

  try {
    const response = await fetch(`${baseUrl}/posts/unlike`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      },
      body: JSON.stringify({
        id: postId
      })
    })

    if (!response.ok) {
      const error = await response.json()
      toast.error(error.message)

      return 'fail'
    } else {
      return 'success'
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
  }
}
