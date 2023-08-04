<script setup lang="ts">
import useGetUserStore from '../hooks/useGetUserStore'
import useAppNavigation from '../composables/useAppNavigation'
import { baseUrl } from '../constants/baseUrl'
import type { UserType } from '../types/userType'
import { onMounted, ref } from 'vue'
import UserPhotoAndName from '../components/ui/UserPhotoAndName.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { watch } from 'vue'
import SinglePostFeed from '../components/SinglePostFeed.vue'
import VisitedUsersFriends from '../components/VisitedUsersFriends.vue'

const { route, router, toast } = useAppNavigation()
const { loading, setLoading, currentUser, visitedUser, visitedUserAditionalInfo } =
  useGetUserStore()

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
      console.log(visitedUser.value)

      visitedUserAditionalInfo.value = { isAlreadyFriends, isFriendRequested }

      console.log(visitedUser.value.posts)
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

watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId !== oldId) {
      await getVisitedUser()
    }
  }
)
</script>
<template>
  <LoadingSpinner v-if="loading" class="mt-40" />
  <section v-else class="bg-white">
    <header class="h-[70vh] max-w-7xl pb-32 shadow-sm relative mx-auto">
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

      <!-- if current user is the target user -->
      <div v-if="currentUser._id === visitedUser._id" class="absolute bottom-[2%] right-[10%]">
        <button class="px-5 py-2 bg-gray-200 font-bold rounded-md">
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
      </div>

      <!-- if target user is already a friend -->
      <div
        v-if="visitedUserAditionalInfo.isAlreadyFriends"
        class="absolute bottom-[2%] right-[10%]"
      >
        <button class="px-5 py-2 bg-gray-200 font-bold rounded-md">
          <p class="flex items-center gap-2 text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-5 h-5"
            >
              <path
                fill-rule="evenodd"
                d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                clip-rule="evenodd"
              />
            </svg>

            <span>Message</span>
          </p>
        </button>
      </div>
    </header>
  </section>
  <section>
    <div class="grid grid-cols-[2fr,3fr] gap-5 max-w-7xl mx-auto">
      <!-- user friends -->
      <section class="shadow-md rounded-md bg-white px-4 py-4 mt-3">
        <div class="mb-3">
          <h3 class="font-semibold text-lg">Friends</h3>
          <p class="flex items-center gap-1 text-slate-500 text-base -mt-1">
            <span>{{ visitedUser.friends?.length }}</span>
            <span>friends</span>
          </p>
        </div>

        <!-- visited users friends -->
        <div class="grid grid-cols-3 gap-3">
          <VisitedUsersFriends v-for="user in visitedUser.friends" :key="user._id" :user="user" />
        </div>
      </section>

      <!-- user posts -->

      <div class="w-full" v-if="visitedUser.posts">
        <SinglePostFeed
          v-for="post in visitedUser.posts"
          :key="post._id"
          :post="post"
          :currentUser="visitedUser"
          :posts="visitedUser.posts"
        />
      </div>
    </div>
  </section>
</template>
