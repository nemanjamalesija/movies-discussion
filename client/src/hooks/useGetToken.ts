import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export default function useGetToken() {
  const toast = useToast()
  const router = useRouter()

  const jwtToken = localStorage.getItem('jwt')

  if (!jwtToken) {
    toast.error('Could not get your session! Please log in.')
    router.push('/login')
    return
  } else return jwtToken
}
