<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigationLayout from './components/NavigationLayout.vue'
import useGetUserStore from './hooks/useGetUserStore'

const { currentUser } = useGetUserStore()
</script>

<template>
  <NavigationLayout v-if="currentUser.firstName" />
  <RouterView />
</template>

<style scoped></style>
