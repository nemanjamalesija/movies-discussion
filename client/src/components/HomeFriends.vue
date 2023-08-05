<script setup lang="ts">
import type { UserType } from '../types/userType'
import UserPhotoAndName from './ui/UserPhotoAndName.vue'
import useAppNavigation from '../composables/useAppNavigation'
import { baseUrl } from '../constants/baseUrl'
import useGetUserStore from '../hooks/useGetUserStore'

const props = defineProps<{ currentUser: UserType }>()
const { toast, router } = useAppNavigation()
const { acceptFriendRequest } = useGetUserStore()

// /users/accept

async function acceptFriend(userId: string) {
  const jwtToken = localStorage.getItem('jwt')

  if (!jwtToken) {
    toast.error('Could not get your session! Please log in.')
    router.push('/')
  }

  try {
    const response = await fetch(`${baseUrl}/users/accept`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      },
      body: JSON.stringify({
        id: userId
      })
    })

    if (!response.ok) {
      const error = await response.json()
      toast.error(error.message)

      return
    } else {
      const {
        data: { targetUser }
      } = await response.json()
      acceptFriendRequest(targetUser as UserType)
      toast.success('User added to your friends list')
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
  }
}
</script>
<template>
  <div v-for="request in props.currentUser.friendRequests" :key="request._id">
    <h2 class="text-center font-semibold mb-2 text-lg">Friend requests</h2>
    <div class="flex items-center gap-4">
      <div class="mt-2">
        <UserPhotoAndName
          containerClass="flex gap-3 items-center hover:bg-slate-200 py-1 px-2 -ml-2 rounded-md cursor-pointer mb-2"
          :currentUser="props.currentUser"
          :wrapperSize="{ height: '3rem', width: '3rem' }"
          :imageSize="{ height: '2.4rem', width: '2.4rem' }"
        >
          <template #user-photo-adjacent>
            <div>
              <h2 class="flex items-center gap-1 font-semibold text-base">
                <span>{{ request.firstName }}</span>
                <span>{{ request.lastName }}</span>
              </h2>
            </div>
          </template>
        </UserPhotoAndName>
      </div>

      <div class="flex items-center gap-1">
        <button @click="acceptFriend(request._id)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-7 h-7"
          >
            <path
              fill-rule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
              clip-rule="evenodd"
              class="fill-indigo-600 hover:fill-indigo-700 transition-all duration-200"
            />
          </svg>
        </button>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-7 h-7"
          >
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
              clip-rule="evenodd"
              class="fill-red-600 hover:fill-red-700 transition-all duration-200"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
