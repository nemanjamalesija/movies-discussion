<script setup lang="ts">
import type { CommentType } from '../types/postType'
import type { Ref } from 'vue'
import { computed } from 'vue'
import { onToggleComments } from '@/constants/emitEvents'

const props = defineProps<{
  comments: Ref<CommentType[]>
}>()

defineEmits(['onToggleComments'])
const displayCommentsInfo = computed(() => {
  const commentsNumber = props.comments.value.length

  return commentsNumber == 1 ? 'Comment' : 'Comments'
})
</script>
<template>
  <div>
    <p
      role="button"
      tabindex="0"
      class="flex items-center gap-1 text-slate-500 text-sm"
      @click="$emit(onToggleComments)"
    >
      <span>{{ props.comments.value.length }}</span>
      <span>{{ displayCommentsInfo }} </span>
    </p>
  </div>
</template>
