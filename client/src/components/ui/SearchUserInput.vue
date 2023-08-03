<script setup lang="ts">
import useAppNavigation from '@/composables/useAppNavigation'
import { baseUrl } from '@/constants/baseUrl'
import type { UserType } from '@/types/userType'
import { ref } from 'vue'

const tryUser = ref<string>()
const searchedUsers = ref({} as UserType[])
const loadingUsers = ref<boolean>(false)
const { toast, router } = useAppNavigation()

async function getSearchedUSers() {
  const jwtToken = localStorage.getItem('jwt')

  if (!tryUser.value) return

  const [firstName, lastName] = tryUser.value.split(' ')

  if (!jwtToken) {
    toast.error('Could not get your session! Please log in.')
    router.push('/')
  }

  loadingUsers.value = true

  try {
    const response = await fetch(
      `${baseUrl}/users/getSearched?firstName=${firstName}&lastName=${lastName || ''}&limit=10`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + jwtToken
        }
      }
    )

    if (!response.ok) {
      const error = await response.json()
      toast.error(error.message)
      router.push('/login')
      return
    } else {
      const {
        data: { users }
      } = await response.json()

      searchedUsers.value = users
      console.log(searchedUsers)
      loadingUsers.value = false
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
    loadingUsers.value = false
  } finally {
    loadingUsers.value = false
  }
}
</script>
<template>
  <label for="default-search" class="mb-2 text-sm font-medium sr-only">Search</label>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <svg
        class="w-4 h-4 text-slate-500"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
        />
      </svg>
    </div>
    <input
      type="search"
      id="default-search"
      class="block w-full py-[0.5rem] px-6 pl-10 text-sm border border-slate-300 rounded-full bg-slate-50 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
      placeholder="Search"
      v-model="tryUser"
      @input="getSearchedUSers"
    />
  </div>
</template>
