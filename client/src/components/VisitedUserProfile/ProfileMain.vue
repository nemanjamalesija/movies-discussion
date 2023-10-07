<script setup lang="ts">
import useGetUserStore from '../../composables/useGetUserStore'
import ProfileFriends from './ProfileFriends.vue'
import ProfilePosts from './ProfilePosts.vue'

const { visitedUser } = useGetUserStore()
</script>
<template>
  <main>
    <div class="flex flex-col lg:grid lg:grid-cols-[2.2fr,3fr] gap-5 max-w-[1250px] mx-auto">
      <!-- target user's friends -->
      <ProfileFriends />

      <ProfilePosts />
    </div>
  </main>
</template>
