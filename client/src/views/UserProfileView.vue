<script setup lang="ts">
import useGetUserStore from '../hooks/useGetUserStore'
import useAppNavigation from '../composables/useAppNavigation'
import { baseUrl } from '@/constants/baseUrl'
import type { UserType } from '../types/userType'
import { onMounted, ref } from 'vue'
import UserPhotoAndName from '../components/ui/UserPhotoAndName.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const { route, router, toast } = useAppNavigation()
const { loading, setLoading } = useGetUserStore()

type visitedUserAditionalInfoType = {
  isAlreadyFriends?: boolean
  isFriendRequested?: boolean
}

const visitedUser = ref({} as UserType)
const visitedUserAditionalInfo = ref({} as visitedUserAditionalInfoType)

async function getVisitedUser() {
  const jwtToken = localStorage.getItem('jwt')

  if (!jwtToken) {
    toast.error('Could not get your session! Please log in.')
    router.push('/')
  }
  setLoading(true)

  try {
    const response = await fetch(`${baseUrl}/users/${route.params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      }
    })

    if (!response.ok) {
      const error = await response.json()
      toast.error(error.message)
      router.push('/login')
      return
    } else {
      const {
        data: { isAlreadyFriends, isFriendRequested, targetUser }
      } = await response.json()

      setLoading(false)
      visitedUser.value = targetUser as UserType
      visitedUserAditionalInfo.value = { isAlreadyFriends, isFriendRequested }
      console.log(visitedUser.value)
      console.log(visitedUserAditionalInfo.value)
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
    setLoading(false)
  } finally {
    setLoading(false)
  }
}

onMounted(async () => {
  await getVisitedUser()
})
</script>
<template>
  <LoadingSpinner v-if="loading" class="mt-40" />
  <header v-else class="bg-white h-[70vh] pt-0 pl-32 pb-32 pr-32 shadow-sm relative">
    <div class="bg-gray-200 h-full rounded-md"></div>
    <UserPhotoAndName
      containerClass="flex gap-5 items-center absolute bottom-[2%] left-[10%] cursor-default"
      :currentUser="visitedUser"
      :wrapperSize="{ height: '10rem', width: '10rem' }"
      :imageSize="{ height: '9rem', width: '9rem' }"
    >
      <template #user-photo-adjacent>
        <div class="flex flex-col gap-1 mt-8">
          <h2 class="flex items-center gap-1 font-semibold text-3xl">
            <span>{{ visitedUser.firstName }}</span>
            <span>{{ visitedUser.lastName }}</span>
          </h2>

          <p class="flex gap-1 text-slate-500 font-semibold">
            <span>{{ visitedUser.friends?.length }}</span>
            <span>friends</span>
          </p>
        </div>
      </template>
    </UserPhotoAndName>

    <!-- conditional rendering based on friend status and current user -->
    <button class="px-6 py-3 bg-gray-200 absolute bottom-[2%] right-[10%] font-bold rounded-md">
      <p class="flex items-center gap-2 text-base">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-4 h-4"
        >
          <path
            d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"
          />
        </svg>
        <span>Edit profile</span>
      </p>
    </button>
  </header>
</template>
