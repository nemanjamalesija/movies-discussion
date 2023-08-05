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
const {
  loading,
  setLoading,
  currentUser,
  visitedUser,
  visitedUserAditionalInfo,
  acceptFriendRequest
} = useGetUserStore()

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
      return
    } else {
      const {
        data: { isAlreadyFriends, isFriendRequested, targetUser }
      } = await response.json()

      setLoading(false)
      visitedUser.value = targetUser as UserType

      console.log(visitedUser.value)
      visitedUserAditionalInfo.value = { isAlreadyFriends, isFriendRequested }
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

// /users/add
async function addFriend(userId: string) {
  const jwtToken = localStorage.getItem('jwt')

  if (!jwtToken) {
    toast.error('Could not get your session! Please log in.')
    router.push('/')
  }

  try {
    const response = await fetch(`${baseUrl}/users/add`, {
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
      await response.json()

      visitedUserAditionalInfo.value = { isAlreadyFriends: undefined, isFriendRequested: true }
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
  } finally {
    setLoading(false)
  }
}

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
      visitedUser.value.friends?.push(currentUser.value)
      visitedUserAditionalInfo.value.isAlreadyFriends = true
      toast.success('User added to your friends list')
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
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
  <LoadingSpinner v-if="loading" class="mt-60" />
  <div v-else class="pb-20">
    <section>
      <header class="bg-white">
        <div class="h-[70vh] max-w-7xl pb-32 relative mx-auto bg-white">
          <div class="bg-gray-200 h-full rounded-md"></div>
          <UserPhotoAndName
            containerClass="flex gap-5 items-center absolute bottom-[2%] left-[2%] cursor-default"
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

          <!-- below, conditional rendering based on friend status and current user -->

          <!-- if current user is the target user -->
          <div v-if="currentUser._id === visitedUser._id" class="absolute bottom-[2%] right-[1.2%]">
            <button
              class="px-5 py-2 bg-gray-200 font-semibold rounded-md hover:bg-gray-300 transition-all duration-150"
            >
              <p class="flex items-center gap-2 text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-4 h-4 fill-indigo-600"
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
            v-if="visitedUserAditionalInfo.isAlreadyFriends && visitedUser._id !== currentUser._id"
            class="absolute bottom-[2%] right-[1.2%] flex items-center gap-3"
          >
            <button
              class="px-5 py-2 bg-gray-200 font-semibold rounded-md hover:bg-gray-300 transition-all duration-150"
            >
              <p class="flex items-center gap-2 text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-5 h-5 fill-indigo-600"
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
            <button
              class="px-5 py-2 bg-gray-200 font-semibold rounded-md hover:bg-gray-300 transition-all duration-150"
            >
              <p class="flex items-center gap-2 text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-5 h-5 fill-red-600"
                >
                  <path
                    d="M10.375 2.25a4.125 4.125 0 100 8.25 4.125 4.125 0 000-8.25zM10.375 12a7.125 7.125 0 00-7.124 7.247.75.75 0 00.363.63 13.067 13.067 0 006.761 1.873c2.472 0 4.786-.684 6.76-1.873a.75.75 0 00.364-.63l.001-.12v-.002A7.125 7.125 0 0010.375 12zM16 9.75a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-6z"
                  />
                </svg>

                <span>Remove friend</span>
              </p>
            </button>
          </div>

          <!-- if target user is NOT a friend  and not current user -->
          <div
            v-if="!visitedUserAditionalInfo.isAlreadyFriends && visitedUser._id !== currentUser._id"
            class="absolute bottom-[2%] right-[1.2%]"
          >
            <button
              class="px-5 py-2 bg-gray-200 hover:bg-gray-300 font-semibold rounded-md transition-all duration-150"
              @click="addFriend(visitedUser._id)"
            >
              <p class="flex items-center gap-2 text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-5 h-5 fill-indigo-600"
                >
                  <path
                    d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"
                  />
                </svg>

                <span>Add friend</span>
              </p>
            </button>
          </div>

          <!-- friend request is sent -->
          <div
            v-if="
              !visitedUserAditionalInfo.isAlreadyFriends &&
              visitedUserAditionalInfo.isFriendRequested
            "
            class="absolute bottom-[2%] right-[1.2%]"
          >
            <button
              class="px-5 py-2 bg-gray-200 hover:bg-gray-300 font-semibold rounded-md transition-all duration-150"
            >
              <p class="flex items-center gap-2 text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-5 h-5 fill-indigo-600"
                >
                  <path
                    fill-rule="evenodd"
                    d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                    clip-rule="evenodd"
                  />
                </svg>

                <span>Invitation sent</span>
              </p>
            </button>
          </div>

          <!-- if current user && accept friend request -->
          <div
            v-if="
              !visitedUserAditionalInfo.isFriendRequested &&
              currentUser.friendRequests?.some((fr) => fr._id === visitedUser._id)
            "
            class="absolute bottom-[2%] right-[1.2%]"
          >
            <button
              class="px-5 py-2 bg-gray-200 hover:bg-gray-300 font-semibold rounded-md"
              @click="acceptFriend(visitedUser._id)"
            >
              <p class="flex items-center gap-2 text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-5 h-5 fill-indigo-600"
                >
                  <path
                    fill-rule="evenodd"
                    d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                    clip-rule="evenodd"
                  />
                </svg>

                <span>Accept invitation</span>
              </p>
            </button>
          </div>
        </div>
      </header>
    </section>
    <section>
      <div class="grid grid-cols-[2.2fr,3fr] gap-5 max-w-[1250px] mx-auto">
        <!-- user friends -->
        <section class="shadow-md rounded-md bg-white px-4 py-4 mt-3 h-fit">
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
          <p
            v-if="visitedUser.posts.length > 0"
            class="text-slate-500 font-semibold text-base text-center mt-4"
          >
            No more posts to show
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
