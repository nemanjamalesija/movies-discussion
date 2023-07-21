import type { UserType } from '@/types/userType'
import { baseUrl } from '../constants/baseUrl'
import type { Router } from 'vue-router'

import type { ToastInterface } from 'vue-toastification'

export default async function logoutHandler(
  router: Router,
  toast: ToastInterface,
  setCurrentUser: (user: UserType) => void
) {
  try {
    await fetch(`${baseUrl}/api/v1/users/logout`)

    router.push('/')
    localStorage.removeItem('jwt')
    setCurrentUser({
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      photo: '',
      role: '',
      friends: [],
      friendRequests: [],
      active: true
    })
  } catch (error) {
    toast.error('Oops, something went wrong!')
    console.log(error)
  }
}
