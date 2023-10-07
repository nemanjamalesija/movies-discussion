<script setup lang="ts">
import useGetUserStore from '@/composables/useGetUserStore'
import SinglePostFeed from '../SinglePostFeed.vue'

const { currentUser, visitedUser } = useGetUserStore()
</script>
<template>
  <!-- return this if target user has no posts -->
  <section v-if="visitedUser.posts && visitedUser.posts.length === 0">
    <h2 class="text-slate-500 font-semibold text-base text-center mt-32">
      This user doesn't have any posts.
    </h2>
  </section>

  <!-- else return target user's posts -->
  <section v-if="visitedUser.posts && visitedUser.posts.length > 0" class="w-full">
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
  </section>
</template>
