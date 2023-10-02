import { baseUrl } from '@/constants/baseUrl'
import useGetToken from '../hooks/useGetToken'
import { useToast } from 'vue-toastification'
import type { PostFeed } from '@/types/postType'

export default async function createNewPost(newPost: string) {
  const jwtToken = useGetToken()
  const toast = useToast()

  try {
    const response = await fetch(`${baseUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      },
      body: JSON.stringify({
        text: newPost
      })
    })

    if (!response.ok) {
      const error = await response.json()
      toast.error(error.message)
      return
    } else {
      const {
        data: { newPost }
      } = await response.json()

      return newPost as PostFeed
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
  }
}
