<script setup lang="ts">
import useGetUserStore from '@/composables/useGetUserStore'

const { visitedUser } = useGetUserStore()
</script>
<template>
  <section class="shadow-md rounded-md bg-white px-4 py-4 mt-3 h-fit">
    <div class="mb-3">
      <h3 class="font-semibold text-lg">Friends</h3>
      <p class="flex items-center gap-1 text-slate-500 text-base -mt-1">
        <span>{{ visitedUser.friends?.length }}</span>
        <span>friends</span>
      </p>
    </div>

    <div class="grid grid-cols-3 gap-3">
      <SingleProfileFriend v-for="user in visitedUser.friends" :key="user._id" :user="user" />
    </div>
  </section>
</template>
