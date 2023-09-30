import { baseUrl } from '@/constants/baseUrl'
import formatZodErrors from '@/helpers/formatZodErrors'
import type { UserType } from '@/types/userType'
import { useToast } from 'vue-toastification'
import z from 'zod'

export default async function logIn(tryUser: { email: string; password: string }) {
  const toast = useToast()
  try {
    const response = await fetch(`${baseUrl}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tryUser)
    })

    const data = await response.json()

    // throw error from the backend
    if (!response.ok) {
      toast.error(data.message)
      return
    } else {
      // get token and current user from the response
      const { token } = data
      const {
        data: { user }
      } = data

      const { _id, firstName, lastName, email, friendRequests, friends, role, photo, active } = user

      // set jwt in the local storage
      localStorage.setItem('jwt', token)

      return {
        _id,
        firstName,
        lastName,
        email,
        role,
        photo,
        friendRequests,
        friends,
        active
      } as UserType
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      toast.error(formatZodErrors(error))
      return
    } else {
      toast.error('Oop, something went wrong!')
    }
  }
}
