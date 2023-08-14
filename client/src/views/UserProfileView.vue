<script setup lang="ts">
import useGetUserStore from '../hooks/useGetUserStore'
import useAppNavigation from '../composables/useAppNavigation'
import { baseUrl } from '../constants/baseUrl'
import type { UserType } from '../types/userType'
import { onMounted } from 'vue'
import UserPhotoAndName from '../components/ui/UserPhotoAndName.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { watch } from 'vue'
import SinglePostFeed from '../components/SinglePostFeed.vue'
import VisitedUsersFriends from '../components/VisitedUsersFriends.vue'
import EditUsersProfile from '../components/UserProfile/EditUsersProfile.vue'
import MessageFriend from '../components/UserProfile/MessageFriend.vue'
import RemoveFriend from '../components/UserProfile/RemoveFriend.vue'

const { route, router, toast } = useAppNavigation()

const {
  loading,
  setLoading,
  currentUser,
  visitedUser,
  visitedUserAditionalInfo,
  acceptFriendRequest,
  removeFriend
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

      visitedUserAditionalInfo.value = { isAlreadyFriends, isFriendRequested }
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
    setLoading(false)
  } finally {
    setLoading(false)
  }
}

// ADD FRIEND
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

// ACCEPT FRIEND
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
      acceptFriendRequest(currentUser.value, targetUser as UserType)

      visitedUserAditionalInfo.value.isAlreadyFriends = true
      toast.success('User added to your friends list')
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
  }
}

// REMOVE FRIEND
async function deleteFriend(userId: string) {
  const jwtToken = localStorage.getItem('jwt')

  if (!jwtToken) {
    toast.error('Could not get your session! Please log in.')
    router.push('/')
  }

  try {
    const response = await fetch(`${baseUrl}/users/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      },
      body: JSON.stringify({
        id: userId
      })
    })

    const {
      data: { targetUser }
    } = await response.json()

    if (!response.ok) {
      const error = await response.json()
      toast.error(error.message)

      return
    } else {
      removeFriend(currentUser.value, targetUser as UserType)
      visitedUserAditionalInfo.value.isAlreadyFriends = false

      toast.success('User removed from your friends list')
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

          <!-- below, conditional rendering of the visited user's profile based on: 
          1. friend status and
          2. if user visiting is the current user -->

          <!-- if user visiting is the current user -->
          <EditUsersProfile
            v-if="currentUser._id === visitedUser._id"
            class="absolute bottom-[2%] right-[1.2%]"
          />

          <!-- if target user is already a friend -->
          <div
            v-if="visitedUserAditionalInfo.isAlreadyFriends && visitedUser._id !== currentUser._id"
            class="absolute bottom-[2%] right-[1.2%] flex items-center gap-3"
          >
            <MessageFriend />
            <RemoveFriend :visitedUserId="visitedUser._id" @onDeleteFriend="deleteFriend" />
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

          <!-- friend request is already sent -->
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

          <!-- if current user and needs to accept friend request from target user -->
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
        <!-- user's friends -->
        <div class="shadow-md rounded-md bg-white px-4 py-4 mt-3 h-fit">
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
        </div>

        <!-- return this if there is no posts -->
        <h2
          v-if="visitedUser.posts && visitedUser.posts.length === 0"
          class="text-slate-500 font-semibold text-base text-center mt-32"
        >
          This user doesn't have any posts.
        </h2>

        <!-- else return these posts -->
        <!-- user posts -->
        <div class="w-full" v-if="visitedUser.posts && visitedUser.posts.length > 0">
          <SinglePostFeed
            v-for="post in visitedUser.posts"
            :key="post._id"
            :post="post"
            :currentUserProp="currentUser"
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
