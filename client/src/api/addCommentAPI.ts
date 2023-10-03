import { baseUrl } from '@/constants/baseUrl'
import useGetToken from '../hooks/useGetToken'
import { useToast } from 'vue-toastification'
import type { CommentType } from '@/types/postType'

export default async function addComment(postId: string, newCommentText: string) {
  const jwtToken = useGetToken()
  const toast = useToast()

  try {
    const response = await fetch(`${baseUrl}/comments/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      },
      body: JSON.stringify({
        text: newCommentText
      })
    })

    if (!response.ok) {
      const error = await response.json()
      toast.error(error.message)
      return
    } else {
      const {
        data: { newComment }
      } = await response.json()

      return newComment as CommentType
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
  }
}
