<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigationLayout from './components/NavigationLayout.vue'
import useGetUserStore from './hooks/useGetUserStore'
import { onMounted } from 'vue'
import useGetSession from './hooks/useGetSession'

const { currentUser } = useGetUserStore()

onMounted(async () => {
  if (!currentUser.value.firstName) await useGetSession()
})
</script>

<template>
  <NavigationLayout v-if="currentUser.firstName" />
  <RouterView />
</template>

<style scoped></style>
