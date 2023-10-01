import { baseUrl } from '../constants/baseUrl'
import { useToast } from 'vue-toastification'

export default async function logOut() {
  const toast = useToast()
  try {
    await fetch(`${baseUrl}/users/logout`)

    localStorage.removeItem('jwt')
  } catch (error) {
    toast.error('Oops, something went wrong!')
    console.log(error)
  }
}
