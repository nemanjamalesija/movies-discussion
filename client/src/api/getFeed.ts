import { baseUrl } from '@/constants/baseUrl'
import useGetToken from '@/hooks/useGetToken'
import { useToast } from 'vue-toastification'

export default async function getFeed() {
  const toast = useToast()
  const jwtToken = useGetToken()

  try {
    const response = await fetch(`${baseUrl}/posts/feed?offset=0&limit=10`, {
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
        data: { posts }
      } = await response.json()

      return posts
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
  }
}
