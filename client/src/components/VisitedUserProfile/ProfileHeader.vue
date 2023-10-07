<script setup lang="ts">
import useGetUserStore from '@/composables/useGetUserStore'
import RemoveFriend from './RemoveFriend.vue'
import AddFriend from './AddFriend.vue'
import AcceptFriend from './AcceptFriend.vue'
import FriendRequestSent from './FriendRequestSent.vue'
import EditUsersProfile from './EditUsersProfile.vue'
import UserPhotoAndName from '.././ui/UserPhotoAndName.vue'
import addFriend from '../../api/addFriend'
import acceptFriend from '../../api/acceptFriend'
import removeFriendAPI from '../../api/removeFriend'

const { currentUser, visitedUser, visitedUserAditionalInfo, acceptFriendRequest, removeFriend } =
  useGetUserStore()

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
    acceptFriendRequest(targetUser._id)
  }
}

// REMOVE FRIEND
async function deleteFriendHandler(userId: string) {
  const targetUser = await removeFriendAPI(userId)

  if (targetUser) {
    removeFriend(targetUser._id)
  }
}
</script>
<template>
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
</template>
