<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { CommentType } from '../types/postType'
import UserPhotoAndName from './ui/UserPhotoAndName.vue'
import type { UserType } from '../types/userType'
import deleteCommentAPI from '@/api/deleteCommentAPI'
import useGetPostsFeedStore from '../composables/useGetPostsFeedStore'
import EditCommentForm from './EditCommentForm.vue'
import editCommentAPI from '../api/editCommentAPI'

const props = defineProps<{
  comments: Ref<CommentType[]>
  comment: CommentType
  currentUser: UserType
}>()

const isEditCommentVisibile = ref<boolean>(false)
const isEditModalVisibile = ref<boolean>(false)
const isEditFormVisible = ref<boolean>(false)
const commentEditingId = ref<string>('')

const { deleteComment, editComment } = useGetPostsFeedStore()

async function deleteCommentHandler(comments: Ref<CommentType[]>, commentId: string) {
  const res = await deleteCommentAPI(commentId)

  if (res != 'success') return
  deleteComment(comments, commentId)
}

async function editCommentHandler(commentId: string, newCommentText: string) {
  const editedComment = await editCommentAPI(commentId, newCommentText)
  isEditFormVisible.value = false
  isEditModalVisibile.value = false

  if (!editedComment) return

  editComment(props.comments, commentId, newCommentText)
}

function handleShowEditForm(commentId: string) {
  isEditFormVisible.value = true
  commentEditingId.value = commentId
}
</script>
<template>
  <EditCommentForm
    v-if="isEditFormVisible && commentEditingId == props.comment._id"
    :comment="props.comment"
    :currentUser="props.currentUser"
    @onSubmitEditForm="editCommentHandler"
  />
  <div v-else class="flex items-center">
    <UserPhotoAndName
      containerClass="flex gap-3 items-center rounded-t-md cursor-pointer bg-white  pb-2 "
      :currentUser="props.currentUser"
      :wrapperSize="{ height: '2.5rem', width: '2.5rem' }"
      :imageSize="{ height: '2rem', width: '2rem' }"
    >
    </UserPhotoAndName>

    <!-- edit delete modal box -->
    <div
      class="flex items-center gap-4 w-[92%]"
      @mouseover="isEditCommentVisibile = true"
      @mouseout="isEditCommentVisibile = false"
    >
      <div class="bg-slate-100 py-2 px-4 rounded-lg">
        <div>
          <h2 class="flex items-center gap-1 font-semibold text-sm">
            <span>{{ props.comment.author.firstName }}</span>
            <span>{{ props.comment.author.lastName }}</span>
          </h2>
          <blockquote class="text-sm">{{ props.comment.text }}</blockquote>
        </div>
      </div>
      <div v-if="props.currentUser._id === props.comment.author._id" class="relative">
        <button
          :class="
            isEditCommentVisibile
              ? 'bg-slate-100 hover:bg-slate-200 rounded-full visible '
              : 'invisible'
          "
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
          <!-- POPUP EDIT / DELETE COMMENT -->
          <div class="flex items-center mb-4">
            <div class="flex-1 bg-white p-2 rounded-lg mb-2 relative shadow-xl">
              <div
                class="flex flex-col gap-1 min-w-[120px] items-start justify-between font-semibold hover:font-bold"
              >
                <button
                  class="w-full text-start hover:bg-slate-200 py-1 px-2 rounded-md"
                  @click="handleShowEditForm(props.comment._id)"
                >
                  Edit
                </button>
                <button
                  class="w-full text-start hover:bg-slate-200 py-1 px-2 rounded-md"
                  @click="deleteCommentHandler(props.comments, props.comment._id)"
                >
                  Delete
                </button>
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
  </div>
</template>

<style scoped>
.edit-delete-comment {
  right: 40%;
  top: 55%;
  z-index: 999;
}
</style>
