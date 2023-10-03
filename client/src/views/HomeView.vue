<script setup lang="ts">
import HomeLinks from '../components/HomeLinks.vue'
import HomeFeed from '../components/HomeFeed.vue'
import HomeIncomingRequests from '../components/HomeIncomingRequests.vue'
</script>

<template>
  <div class="grid grid-cols-[1fr,2fr,1fr] gap-20 mt-20 px-5 max-w-screen-2xl mx-auto pb-20">
    <HomeLinks />
    <HomeFeed />
    <HomeIncomingRequests />
  </div>
</template>
