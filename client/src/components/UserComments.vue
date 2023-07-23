<script setup lang="ts">
import { toRefs, ref } from 'vue'
import type { CommentType } from '../types/postType'
import UserPhotoAndName from './ui/UserPhotoAndName.vue'
import type { UserType } from '../types/userType'

const props = defineProps<{
  comment: CommentType
  currentUser: UserType
}>()

const isEditCommentVisibile = ref<boolean>(false)
const isEditModalVisibile = ref<boolean>(false)

console.log(props.comment)
</script>
<template>
  <UserPhotoAndName
    containerClass="flex gap-3 items-center rounded-t-md cursor-pointer bg-white  pb-4 relative"
    :currentUser="props.currentUser"
    :wrapperSize="{ height: '2.2rem', width: '2.2rem' }"
    :imageSize="{ height: '1.6rem', width: '1.6rem' }"
  >
    <template #user-photo-adjacent>
      <div
        class="flex items-center gap-4"
        @mouseover="isEditCommentVisibile = true"
        @mouseout="isEditCommentVisibile = false"
      >
        <div class="bg-slate-100 py-2 px-4 rounded-lg">
          <di>
            <h2 class="flex items-center gap-1 font-semibold text-sm">
              <span>{{ currentUser.firstName }}</span>
              <span>{{ currentUser.lastName }}</span>
            </h2>
            <blockquote class="text-sm">{{ props.comment.text }}</blockquote>
          </di>
        </div>
        <div v-if="currentUser.id === comment.author.id" class="relative">
          <button
            :class="isEditCommentVisibile ? 'bg-slate-100 rounded-full visible ' : 'invisible'"
            @click="isEditModalVisibile = !isEditModalVisibile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6"
            >
              <path
                fill-rule="evenodd"
                d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <div
            :class="
              isEditModalVisibile
                ? 'flex-1 px-4 py-4 overflow-y-auto absolute text-sm edit-delete-comment'
                : 'flex-1 px-4 py-4 overflow-y-auto absolute text-sm edit-delete-comment invisible'
            "
          >
            <!-- chat message -->

            <div class="flex items-center mb-4">
              <div class="flex-1 bg-white p-2 rounded-lg mb-2 relative shadow-xl">
                <div
                  class="flex flex-col gap-1 min-w-[120px] items-start justify-between font-semibold hover:font-bold"
                >
                  <button class="w-full text-start hover:bg-slate-100 py-1 px-2">Edit</button>
                  <button class="w-full text-start hover:bg-slate-100 py-1 px-2">Delete</button>
                </div>
                <!-- arrow -->
                <div
                  class="absolute right-0 -top-1 transform -translate-x-1/2 -rotate-45 w-2 h-2 bg-white"
                ></div>
                <!-- end arrow -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UserPhotoAndName>
</template>

<style scoped>
.edit-delete-comment {
  right: 40%;
  top: 55%;
  z-index: 999;
}
</style>
