<script setup lang="ts">
import CreatePostFeed from './CreatePostFeed.vue'
import { ref } from 'vue'
import useGetUserStore from '../hooks/useGetUserStore'

const isPostingPhoto = ref<boolean>(false)

const { currentUser } = useGetUserStore()
</script>
<template>GetFeed</template>
