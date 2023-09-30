import { baseUrl } from '@/constants/baseUrl'
import formatZodErrors from '@/helpers/formatZodErrors'
import { useToast } from 'vue-toastification'
import z from 'zod'

export default async function signUpHandler(tryUser: {
  firstName: string
  lastName: string
  email: string
  password: string
  passwordConfirm: string
}) {
  const toast = useToast()
  try {
    const response = await fetch(`${baseUrl}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tryUser)
    })

    const data = await response.json()

    if (!response.ok) {
      toast.error(data.message)
      return
    } else {
      return data.status
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      toast.error(formatZodErrors(error))
    } else {
      toast.error('Oop, something went wrong!')
    }
  }
}
