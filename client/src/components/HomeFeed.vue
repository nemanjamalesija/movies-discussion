<script setup lang="ts">
import CreatePostFeed from './CreatePostFeed.vue'
import { ref } from 'vue'
import useGetUserStore from '../hooks/useGetUserStore'
import GetFeed from './GetFeed.vue'

const isPostingPhoto = ref<boolean>(false)

const { currentUser } = useGetUserStore()
</script>
<template>
  <main>
    <CreatePostFeed />
    <GetFeed />
  </main>
</template>
