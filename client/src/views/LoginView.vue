<script setup lang="ts">
import { baseUrl } from '../constants/baseUrl'
import { ref, watch } from 'vue'
import useGetUserStore from '../hooks/useGetUserStore'
import useAppNavigation from '../composables/useAppNavigation'
import { loginSchema } from '../types/loginUserType'
import type { LoginUserType } from '../types/loginUserType'
import { computed } from 'vue'
import z from 'zod'
import formatZodErrors from '../helpers/formatZodErrors'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import type { UserType } from '@/types/userType'

const { setCurrentUser, currentUser, loading, setLoading } = useGetUserStore()
const { toast, router } = useAppNavigation()

const loginUser = ref<LoginUserType>({
  email: '',
  password: ''
})

// for disable state of the submit button in the form
const allFieldsCompleted = computed(() => {
  return loginSchema.safeParse(loginUser.value).success
})

async function loginUserHandler() {
  // if email or password missing
  if (!loginUser.value.email || !loginUser.value.password)
    return toast.error('Please provide both email and password')

  try {
    setLoading(true)

    // zod validation
    const tryUser = loginSchema.parse({
      email: loginUser.value.email,
      password: loginUser.value.password
    })

    const response = await fetch(`${baseUrl}/api/v1/users/login`, {
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

      const { id, firstName, lastName, email, friendRequests, friends, role, photo, active } =
        user as UserType

      // grant access
      router.push('/products')

      // set user in the state
      setCurrentUser({
        id,
        firstName,
        lastName,
        email,
        role,
        photo,
        friendRequests,
        friends,
        active
      })

      setLoading(false)

      // set jwt in the local storage
      localStorage.setItem('jwt', token)
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return toast.error(formatZodErrors(error))
    } else {
      setLoading(false)
      toast.error('Oop, something went wrong!')
    }
  } finally {
    // clear input form
    loginUser.value.email = ''
    loginUser.value.password = ''
    setLoading(false)
  }
}

// watch(currentUser, (newValue) => {
//   if (newValue.firstName) router.push('/')
// })
</script>

<template>
  <section class="mt-28 px-5 lg:px-0 login">
    <LoadingSpinner v-if="loading" />
    <div v-else class="login-form">
      <h2
        class="heading-secondary heading-secondary heading-gradient text-text-lg lg:text-2xl uppercase mb-8 font-semibold text-center"
      >
        Log into your account
      </h2>
      <form class="form form--login">
        <div class="form__group">
          <label class="form__label" for="email">Email address</label>
          <input
            id="email"
            class="form__input"
            type="email"
            placeholder="you@example.com"
            required
            v-model="loginUser.email"
          />
        </div>
        <div class="form__group ma-bt-md">
          <label class="form__label" for="password">Password</label>
          <input
            id="password"
            class="form__input"
            type="password"
            placeholder="••••••••"
            minlength="8"
            required
            v-model="loginUser.password"
          />
        </div>
        <div class="form__group">
          <button
            class="btn py-3 px-6 bg-orange-500 text-sm lg:text-base hover:bg-orange-600 disabled:bg-gray-500"
            type="submit"
            :disabled="!allFieldsCompleted"
            @click.prevent="loginUserHandler"
          >
            Log in
          </button>
        </div>
      </form>
    </div>
  </section>
</template>
