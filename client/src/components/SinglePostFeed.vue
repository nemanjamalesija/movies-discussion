<script setup lang="ts">
import type { PostFeed } from '@/types/postType'
import { toRefs } from 'vue'
import formatDate from '../helpers/formatDate'
import UserPhotoAndName from './ui/UserPhotoAndName.vue'

const props = defineProps<{ post: PostFeed }>()
const postRef = toRefs(props.post)
</script>
<template>
  <UserPhotoAndName
    class="shadow-sm flex gap-3 items-center rounded-md cursor-pointer border-b-2 border-b-slate-100 bg-white px-3 py-4 mt-3"
    :currentUser="postRef.author.value"
  >
    <template #user-photo-adjacent>
      <div>
        <!-- post user name -->
        <h2 class="flex items-center gap-1 font-semibold text-base -mb-1">
          <span>{{ postRef.author.value.firstName }}</span>
          <span>{{ postRef.author.value.lastName }}</span>
        </h2>

        <!-- date when post created -->
        <span class="text-xs text-slate-500">{{ formatDate(postRef.createdAt.value) }}</span>
      </div>
    </template>
  </UserPhotoAndName>
</template>

<style scoped></style>
