<script setup lang="ts">
import type { UserType } from '../types/userType'
import UserPhotoAndName from './ui/UserPhotoAndName.vue'
import useGetUserStore from '../hooks/useGetUserStore'
import acceptFriend from '../api/acceptFriend'
import dennyFriend from '../api/dennyFriend'

const { acceptFriendRequest, dennyFriendRequest, currentUser } = useGetUserStore()

async function acceptFriendHandler(userId: string) {
  const targetUser = await acceptFriend(userId)
  if (targetUser) acceptFriendRequest(currentUser.value, targetUser as UserType)
}

async function dennyFriendHandler(userId: string) {
  const res = await dennyFriend(userId)
  if (res == 'success') dennyFriendRequest(userId)
}
</script>
<template>
  <section v-if="currentUser.friendRequests">
    <div v-for="requestUser in currentUser.friendRequests" :key="requestUser._id">
      <h2 class="text-center font-semibold mb-2 text-lg">Friend requests</h2>
      <div class="flex items-center gap-4 hover:bg-slate-200 rounded-md px-3">
        <div class="mt-2">
          <UserPhotoAndName
            containerClass="flex gap-3 items-center cursor-pointer mb-2"
            :currentUser="requestUser"
            :wrapperSize="{ height: '3rem', width: '3rem' }"
            :imageSize="{ height: '2.4rem', width: '2.4rem' }"
          >
            <template #user-photo-adjacent>
              <div>
                <h2 class="flex items-center gap-1 font-semibold text-base">
                  <span>{{ requestUser.firstName }}</span>
                  <span>{{ requestUser.lastName }}</span>
                </h2>
              </div>
            </template>
          </UserPhotoAndName>
        </div>

        <div class="flex items-center gap-1">
          <button @click="acceptFriendHandler(requestUser._id)">
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
                class="fill-indigo-600 hover:fill-indigo-700 transition-all duration-150"
              />
            </svg>
          </button>
          <button @click="dennyFriendHandler(requestUser._id)">
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
                class="fill-red-600 hover:fill-red-700 transition-all duration-150"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
