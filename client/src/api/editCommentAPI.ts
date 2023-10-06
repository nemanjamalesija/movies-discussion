import { baseUrl } from '@/constants/baseUrl'
import useGetToken from '@/composables/useGetToken'
import type { CommentType } from '@/types/postType'
import { useToast } from 'vue-toastification'

export default async function editCommentAPI(commentId: string, commentText: string) {
  const jwtToken = useGetToken()
  const toast = useToast()

  try {
    const response = await fetch(`${baseUrl}/comments/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      },
      body: JSON.stringify({
        text: commentText
      })
    })

    if (!response.ok) {
      const error = await response.json()
      toast.error(error.message)
      return
    } else {
      const {
        data: { data }
      } = await response.json()

      return data as CommentType
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
  }
}
