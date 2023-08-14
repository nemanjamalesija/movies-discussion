<script setup lang="ts">
import type { CommentType } from '../types/postType'
import type { Ref } from 'vue'

const props = defineProps<{
  comments: Ref<CommentType[]>
}>()
</script>
<template>
  <div>
    <p
      role="button"
      tabindex="0"
      class="flex items-center gap-1 text-slate-500 text-sm"
      @click="$emit('toggleComments')"
    >
      <span>{{ props.comments.value.length }}</span>
      <span
        >{{
          props.comments.value.length > 1 || props.comments.value.length === 0
            ? 'Comments'
            : 'Comment'
        }}
      </span>
    </p>
  </div>
</template>
