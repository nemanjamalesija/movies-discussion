<script setup lang="ts">
import useGetUserStore from '../hooks/useGetUserStore'
import useAppNavigation from '../hooks/useAppNavigation'
import type { UserType } from '../types/userType'
import { onMounted, watch } from 'vue'
import UserPhotoAndName from '../components/ui/UserPhotoAndName.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import SinglePostFeed from '../components/SinglePostFeed.vue'
import VisitedUsersFriends from '../components/VisitedUsersFriends.vue'
import EditUsersProfile from '../components/UserProfile/EditUsersProfile.vue'
import RemoveFriend from '../components/UserProfile/RemoveFriend.vue'
import AddFriend from '../components/UserProfile/AddFriend.vue'
import FriendRequestSent from '../components/UserProfile/FriendRequestSent.vue'
import AcceptFriend from '../components/UserProfile/AcceptFriend.vue'
import getVisitedProfile from '../api/getVisitedProfile'
import addFriend from '../api/addFriend'
import acceptFriend from '../api/acceptFriend'
import removeFriendAPI from '../api/removeFriend'
import LogInSignUpConditional from '@/components/LogInSignUpConditional.vue'

const { route, router } = useAppNavigation()
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
  if (!currentUser.value.firstName) return

  const res = await addFriend(userId)

  if (res == 'success')
    visitedUserAditionalInfo.value = { isAlreadyFriends: undefined, isFriendRequested: true }
}

// ACCEPT FRIEND
async function acceptFriendHandler(userId: string) {
  const targetUser = await acceptFriend(userId)

  if (targetUser) {
    acceptFriendRequest(currentUser.value, targetUser as UserType)
    visitedUserAditionalInfo.value.isAlreadyFriends = true
  }
}

// REMOVE FRIEND
async function deleteFriendHandler(userId: string) {
  const targetUser = await removeFriendAPI(userId)

  if (targetUser) {
    removeFriend(currentUser.value, targetUser as UserType)
    visitedUserAditionalInfo.value.isAlreadyFriends = false
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
    <!-- if visiting profile without user logged in, 
    display link to log in and sign up pages -->
    <LogInSignUpConditional v-if="!currentUser.firstName" />

    <header class="bg-white">
      <div class="h-[55vh] lg:h-[70vh] max-w-7xl pb-32 relative mx-auto bg-white">
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

        <!-- BELOW:
         - conditional rendering of the visited user's profile based on: 
          1. friend status and
          2. if user visiting is the current user -->

        <!-- if user visiting is the current user -->
        <EditUsersProfile
          v-if="currentUser._id === visitedUser._id"
          class="absolute bottom-[2%] right-[1.2%]"
        />

        <!-- if target user is already a friend -->
        <div
          v-if="
            currentUser.firstName &&
            visitedUserAditionalInfo.isAlreadyFriends &&
            visitedUser._id !== currentUser._id
          "
          class="absolute bottom-[2%] right-[1.2%] flex items-center gap-3"
        >
          <RemoveFriend :visitedUserId="visitedUser._id" @onDeleteFriend="deleteFriendHandler" />
        </div>

        <!-- if target user is NOT a friend and no friend requests sent  -->
        <AddFriend
          v-if="
            currentUser.firstName &&
            !visitedUserAditionalInfo.isAlreadyFriends &&
            visitedUser._id !== currentUser._id
          "
          class="absolute bottom-[2%] right-[1.2%]"
          :visitedUserId="visitedUser._id"
          @onAddFriend="addFriendHandler"
        />

        <!-- if current user has sent friend request to the target user -->
        <FriendRequestSent
          v-if="
            !visitedUserAditionalInfo.isAlreadyFriends && visitedUserAditionalInfo.isFriendRequested
          "
          class="absolute bottom-[2%] right-[1.2%]"
        />

        <!-- if target user has sent friend request to the current user -->
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

    <section>
      <div class="flex flex-col lg:grid lg:grid-cols-[2.2fr,3fr] gap-5 max-w-[1250px] mx-auto">
        <!-- target user's friends -->
        <div class="shadow-md rounded-md bg-white px-4 py-4 mt-3 h-fit">
          <div class="mb-3">
            <h3 class="font-semibold text-lg">Friends</h3>
            <p class="flex items-center gap-1 text-slate-500 text-base -mt-1">
              <span>{{ visitedUser.friends?.length }}</span>
              <span>friends</span>
            </p>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <VisitedUsersFriends v-for="user in visitedUser.friends" :key="user._id" :user="user" />
          </div>
        </div>

        <!-- return this if target user has no posts -->
        <h2
          v-if="visitedUser.posts && visitedUser.posts.length === 0"
          class="text-slate-500 font-semibold text-base text-center mt-32"
        >
          This user doesn't have any posts.
        </h2>

        <!-- else return target user's posts -->
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
../composables/useGetUserStore../composables/useAppNavigation
