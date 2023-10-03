import { baseUrl } from '@/constants/baseUrl'
import useGetToken from '@/hooks/useGetToken'
import { useToast } from 'vue-toastification'

export default // DELETE POST
async function deleteCommentAPI(commentId: string) {
  const jwtToken = useGetToken()
  const toast = useToast()

  try {
    const res = await fetch(`${baseUrl}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      }
    })

    if (!res.ok) {
      const errorData = await res.json()
      toast.error(errorData.message)
      return 'fail'
    }

    return 'success'
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
  }
}
