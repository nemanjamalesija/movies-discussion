<script setup lang="ts">
import ProfileFriends from './ProfileFriends.vue'
import ProfilePosts from './ProfilePosts.vue'
</script>
<template>
  <main>
    <div class="flex flex-col lg:grid lg:grid-cols-[2.2fr,3fr] gap-5 max-w-[1250px] mx-auto">
      <ProfileFriends />
      <ProfilePosts />
    </div>
  </main>
</template>
