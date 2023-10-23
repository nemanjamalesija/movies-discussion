<script setup lang="ts">
import { ref } from 'vue'
import { onAddComment } from '@/constants/emitEvents'

const props = defineProps<{
  postId: string
}>()

defineEmits(['onAddComment'])

const newCommentText = ref<string>('')
</script>
<template>
  <form
    @submit.prevent="$emit(onAddComment, props.postId, newCommentText), (newCommentText = '')"
    class="w-full"
  >
    <label for="default-search" class="mb-2 text-sm font-medium sr-only">Search</label>
    <div>
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
      <input
        type="text"
        id="comment-text"
        class="`block w-full py-[0.5rem] px-4 text-sm border border-slate-300 rounded-md bg-slate-50 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        placeholder="Write a comment..."
        v-model="newCommentText"
      />
    </div>
  </form>
</template>
