<script setup lang="ts">
import HomeLinks from '../components/HomeLinks.vue'
import HomeFeed from '../components/HomeFeed.vue'
import HomeFriends from '../components/HomeFriends.vue'
</script>

<template>
  <section class="grid grid-cols-[1fr,2fr,1fr] gap-20 mt-20 px-5 max-w-screen-2xl mx-auto">
    <HomeLinks />
    <HomeFeed />
    <HomeFriends />
  </section>
</template>
