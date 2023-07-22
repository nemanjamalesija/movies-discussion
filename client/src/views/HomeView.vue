<script setup lang="ts">
import HomeLinks from '../components/HomeLinks.vue'
import HomeFeed from '../components/HomeFeed.vue'
import HomeFriends from '../components/HomeFriends.vue'
</script>

<template>
  <section class="grid grid-cols-[1fr 1.5fr 1fr] mt-24 px-6">
    <HomeLinks />
    <HomeFeed />
    <HomeFriends />
  </section>
</template>
