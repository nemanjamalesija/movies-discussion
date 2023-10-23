<script setup lang="ts">
import useAppNavigation from '../../composables/useAppNavigation'
import type { UserType } from '../../types/userType'
import { ref } from 'vue'
import LoadingSpinner from '../LoadingSpinner.vue'
import NavInputSearchedUser from '../NavInputSearchedUser.vue'
import useGetToken from '@/composables/useGetToken'
import getSearchedUSersAPI from '../../api/getSearchedUsers'

const tryUser = ref<string>()
const searchedUsers = ref([] as UserType[])
const loadingUsers = ref<boolean>(false)
const showSearchedUsers = ref<boolean>(false)
const { toast, router } = useAppNavigation()

function closeShowSeachedUsers() {
  showSearchedUsers.value = false
  tryUser.value = ''
}

async function getSearchedUSers() {
  const jwtToken = useGetToken()

  if (!jwtToken) {
    toast.error('Could not get your session! Please log in.')
    router.push('/')
  }
  showSearchedUsers.value = true

  if (!tryUser.value) {
    searchedUsers.value = []
    showSearchedUsers.value = false
    return
  }

  const [firstName, lastName] = tryUser.value.split(' ')

  loadingUsers.value = true

  const users = await getSearchedUSersAPI(firstName, lastName)

  if (!users) return

  searchedUsers.value = users
  loadingUsers.value = false
}
</script>
<template>
  <div class="flex flex-col relative">
    <div>
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
          autocomplete="off"
          @input="getSearchedUSers"
        />
      </div>
    </div>
    <div
      v-if="showSearchedUsers"
      class="bg-white absolute top-[105%] left-0 w-full rounded-md shadow-lg p-3"
    >
      <LoadingSpinner v-if="loadingUsers" />
      <p
        v-if="searchedUsers?.length === 0 && !loadingUsers"
        class="text-slate-500 text-base text-center"
      >
        No results found
      </p>

      <template v-if="!loadingUsers && searchedUsers.length >= 0">
        <NavInputSearchedUser
          v-for="user in searchedUsers"
          :key="user._id"
          :user="user"
          @onClose="closeShowSeachedUsers"
        />
      </template>
    </div>
  </div>
</template>
