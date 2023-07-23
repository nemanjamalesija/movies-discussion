<script setup lang="ts">
import { toRefs } from 'vue'
import type { CommentType } from '../types/postType'

const props = defineProps<{ comment: CommentType }>()
console.log(props.comment)
</script>
<template>UserComments</template>
