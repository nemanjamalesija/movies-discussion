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
import AddFriend from '../components/UserProfile/AddFriend.vue'
import FriendRequestSent from '../components/UserProfile/FriendRequestSent.vue'
import AcceptFriend from '../components/UserProfile/AcceptFriend.vue'
import getVisitedProfile from '@/api/getVisitedProfile'
import addFriend from '../api/addFriend'
import acceptFriend from '../api/acceptFriend'

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

async function getVisitedUserHandler() {
  setLoading(true)
  const res = await getVisitedProfile(route.params.id as string)
  if (!res) {
    router.push('/')
    return
  }

  const { isAlreadyFriends, isFriendRequested, targetUser } = res

  setLoading(false)
  visitedUser.value = targetUser as UserType
  visitedUserAditionalInfo.value = { isAlreadyFriends, isFriendRequested }
}

// ADD FRIEND
async function addFriendHandler(userId: string) {
  const res = await addFriend(userId)

  if (res == 'success')
    visitedUserAditionalInfo.value = { isAlreadyFriends: undefined, isFriendRequested: true }
}

// ACCEPT FRIEND
async function acceptFriendHandler(userId: string) {
  const res = await acceptFriend(userId)

  if (!res) return

  const { targetUser } = res

  acceptFriendRequest(currentUser.value, targetUser as UserType)

  visitedUserAditionalInfo.value.isAlreadyFriends = true
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
  await getVisitedUserHandler()
})

watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId !== oldId) {
      await getVisitedUserHandler()
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

          <!-- if target user is NOT a friend  -->
          <AddFriend
            v-if="!visitedUserAditionalInfo.isAlreadyFriends && visitedUser._id !== currentUser._id"
            class="absolute bottom-[2%] right-[1.2%]"
            :visitedUserId="visitedUser._id"
            @onAddFriend="addFriendHandler"
          />

          <!-- friend request is already sent -->
          <FriendRequestSent
            v-if="
              !visitedUserAditionalInfo.isAlreadyFriends &&
              visitedUserAditionalInfo.isFriendRequested
            "
            class="absolute bottom-[2%] right-[1.2%]"
          />

          <!-- if user is current user and needs to accept friend request from target user -->
          <AcceptFriend
            v-if="
              !visitedUserAditionalInfo.isFriendRequested &&
              currentUser.friendRequests?.some((fr) => fr._id === visitedUser._id)
            "
            class="absolute bottom-[2%] right-[1.2%]"
            :visitedUserId="visitedUser._id"
            @onAcceptFriend="acceptFriendHandler"
          />
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
@/api/getVisitedProfile
