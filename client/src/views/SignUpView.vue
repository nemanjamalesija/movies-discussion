<script setup lang="ts">
import { ref, computed } from 'vue'
import { baseUrl } from '../constants/baseUrl'
import useAppNavigation from '../composables/useAppNavigation'
import { signUpUserSchema } from '../schemas/signupUserSchema'
import type { SignUpUserType } from '../schemas/signupUserSchema'
import formatZodErrors from '../helpers/formatZodErrors'
import { z } from 'zod'
import useGetUserStore from '../hooks/useGetUserStore'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const { toast, router } = useAppNavigation()
const { loading, setLoading } = useGetUserStore()

const signUpUser = ref<SignUpUserType>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirm: ''
})

// for disable state of the submit button in the form
const allFieldsCompleted = computed(() => {
  return signUpUserSchema.safeParse(signUpUser.value).success
})

async function signUpHandler() {
  try {
    const tryUser = signUpUserSchema.parse({
      firstName: signUpUser.value.firstName,
      lastName: signUpUser.value.lastName,
      email: signUpUser.value.email,
      password: signUpUser.value.password,
      passwordConfirm: signUpUser.value.passwordConfirm
    })

    setLoading(true)

    const response = await fetch(`${baseUrl}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tryUser)
    })

    const data = await response.json()

    if (!response.ok) toast.error(data.message)
    else {
      setLoading(false)
      toast.success('Account created! Feel free to log in')
      router.push('/login')
    }

    signUpUser.value.firstName = ''
    signUpUser.value.email = ''
    signUpUser.value.password = ''
    signUpUser.value.passwordConfirm = ''
  } catch (error) {
    if (error instanceof z.ZodError) {
      toast.error(formatZodErrors(error))
    } else {
      toast.error('Oop, something went wrong!')
    }
  } finally {
    setLoading(false)
  }
}
</script>

<template>
  <section class="my-12 singup">
    <LoadingSpinner v-if="loading" />
    <div v-else class="form__container">
      <div>
        <h1 class="text-8xl text-indigo-600 mb-4 align-middle mt-32 font-bold">Socialis</h1>
        <p class="text-2xl">
          Stay connected with your friends and the world around you with Socialis.
        </p>
      </div>
      <div class="singup-form">
        <form class="form form--signup">
          <div class="form__group">
            <label class="form__label" for="name">Your name</label>
            <input
              id="firstName"
              class="form__input"
              type="text"
              placeholder="John"
              required
              v-model="signUpUser.firstName"
            />
          </div>
          <div class="form__group">
            <label class="form__label" for="name">Your last name</label>
            <input
              id="lastName"
              class="form__input"
              type="text"
              placeholder="John"
              required
              v-model="signUpUser.lastName"
            />
          </div>
          <div class="form__group">
            <label class="form__label" for="email">Email address</label>
            <input
              id="email"
              class="form__input"
              type="email"
              placeholder="you@example.com"
              required
              v-model="signUpUser.email"
            />
          </div>
          <div class="form__group ma-bt-md">
            <label class="form__label" for="password">Password</label>
            <input
              id="password"
              class="form__input"
              type="password"
              placeholder="••••••••"
              required
              minlength="8"
              v-model="signUpUser.password"
            />
          </div>
          <div class="form__group ma-bt-md">
            <label class="form__label" for="passwordConfirm">Confirm password</label>
            <input
              id="passwordConfirm"
              class="form__input"
              type="password"
              placeholder="••••••••"
              required
              minlength="8"
              v-model="signUpUser.passwordConfirm"
            />
          </div>
          <div class="form__group">
            <button
              class="py-3 px-6 w-full rounded-md uppercase font-semibold text-white transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 text-sm lg:text-base hover:bg-orange-60 disabled:bg-gray-500 mb-2"
              type="submit"
              @click.prevent="signUpHandler"
              :disabled="!allFieldsCompleted"
            >
              Sign up
            </button>

            <RouterLink to="/login"
              ><button
                class="py-3 px-6 w-full rounded-md uppercase font-semibold text-white transition-all duration-300 bg-emerald-600 hover:bg-emerald-700 text-sm lg:text-base hover:bg-orange-60"
              >
                Log in with your account
              </button>
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
