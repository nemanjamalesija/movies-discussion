<script setup lang="ts">
import { ref, computed } from 'vue'
import useGetUserStore from '../hooks/useGetUserStore'
import { loginSchema } from '../schemas/loginUserSchema'
import type { LoginUserType } from '../schemas/loginUserSchema'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import useAppNavigation from '../hooks/useAppNavigation'
import logIn from '../api/logIn'

const { setCurrentUser, loading, setLoading } = useGetUserStore()
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

  // zod validation
  const tryUser = loginSchema.parse({
    email: loginUser.value.email,
    password: loginUser.value.password
  })

  setLoading(true)
  const user = await logIn(tryUser)

  if (user) {
    // set user in the state
    setCurrentUser(user)

    // grant access
    router.push('/')
  }
  setLoading(false)

  // clear input form
  loginUser.value.email = ''
  loginUser.value.password = ''
}
</script>

<template>
  <section class="mt-40 px-5 lg:px-0 login">
    <LoadingSpinner v-if="loading" />
    <div v-else class="form__container">
      <div>
        <h1 class="text-8xl text-indigo-600 mb-4 align-middle mt-16 font-semibold">Socialis</h1>
        <p class="text-2xl">
          Stay connected with your friends and the world around you with Socialis.
        </p>
      </div>
      <div class="login-form">
        <form class="form form--login">
          <div class="form__group">
            <label class="form__label" for="email">Email address</label>
            <input
              id="email"
              class="form__input"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
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
              autocomplete="current-password"
              required
              v-model="loginUser.password"
            />
          </div>
          <div class="form__group">
            <button
              class="py-3 px-6 w-full rounded-md uppercase font-semibold text-white transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 text-sm lg:text-base hover:bg-orange-60 disabled:bg-gray-500 mb-2"
              type="submit"
              :disabled="!allFieldsCompleted"
              @click.prevent="loginUserHandler"
            >
              Log in
            </button>

            <RouterLink to="/signup"
              ><button
                class="py-3 px-6 w-full rounded-md uppercase font-semibold text-white transition-all duration-300 bg-emerald-600 hover:bg-emerald-700 text-sm lg:text-base hover:bg-orange-60"
              >
                Create new account
              </button>
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
../hooks/useAppNavigation ../composables/useGetUserStore../composables/useAppNavigation
