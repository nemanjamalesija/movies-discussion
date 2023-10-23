<script setup lang="ts">
import type { CommentType } from '@/types/postType'
import type { UserType } from '@/types/userType'
import { onSubmitEditForm } from '@/constants/emitEvents'
import { ref } from 'vue'

const props = defineProps<{
  comment: CommentType
  currentUser: UserType
}>()

defineEmits(['onSubmitEditForm'])

const editedCommentText = ref<string>(props.comment.text)
</script>
<template>
  <form
    class="flex items-center w-full"
    @submit.prevent="$emit(onSubmitEditForm, props.comment._id, editedCommentText)"
  >
    <div
      v-if="props.currentUser.photo"
      class="bg-gray-300 rounded-full flex items-center justify-center cursor-pointer"
      :style="{ height: '2.5rem', width: '2.5rem' }"
    >
      <img
        class="object-cover inline-block rounded-full"
        :src="props.currentUser.photo"
        :alt="props.currentUser.firstName + ' image'"
        :style="{ height: '2rem', width: '2rem' }"
      />
    </div>

    <!-- // if there is no photo display generic anonymus user image -->
    <div
      v-if="!props.currentUser.photo"
      class="bg-gray-300 rounded-full flex items-center justify-center cursor-pointer border-2 border-white"
      :style="{ height: '2.5rem', width: '2.5rem' }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="#fff"
        :style="{ height: '2rem', width: '2rem' }"
      >
        <path
          fill-rule="evenodd"
          d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    <div class="py-2 pl-4 rounded-lg w-full">
      <div>
        <input
          type="text"
          id="edit-comment-text"
          class="`block w-full py-[0.5rem] px-4 text-sm border border-slate-300 rounded-md bg-slate-50 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          v-model="editedCommentText"
        />
      </div>
    </div>
  </form>
</template>
