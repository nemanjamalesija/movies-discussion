<script setup lang="ts">
import type { PostType } from '../types/postType'
import type { UserType } from '../types/userType'
import { toRefs, ref } from 'vue'
import formatDate from '../helpers/formatDate'
import UserPhotoAndName from './ui/UserPhotoAndName.vue'
import UserComments from './UserComments.vue'
import useGetUserStore from '../composables/useGetUserStore'
import useGetPostsFeedStore from '../composables/useGetPostsFeedStore'
import PostLikesInfo from './PostLikesInfo.vue'
import PostCommentsInfo from './PostCommentsInfo.vue'
import LikeUnlikePost from './LikeUnlikePost.vue'
import DeletePostModal from './DeletePostModal.vue'
import AddCommentForm from './AddCommentForm.vue'
import addCommentAPI from '../api/addCommentAPI'
import likePost from '../api/likePost'
import unlikePost from '../api/unlikePost'
import deletePost from '../api/deletePost'
import focusInput from '../helpers/focusInput'

// props
const props = defineProps<{ post: PostType; posts: PostType[]; currentUserProp: UserType }>()

// refs
const postRef = toRefs(props.post)
const areCommentsVisible = ref<boolean>(false)
const showEditCommentForm = ref<boolean>(false)
const showDeletePostModal = ref<boolean>(false)
const isLiked = ref<boolean>(postRef.likes.value.some((f) => f._id === props.currentUserProp._id))

// stores
const { currentUser, visitedUser, deleteUsersPost } = useGetUserStore()
const { addComment, deletePostFeed } = useGetPostsFeedStore()

// ADD COMMENT
async function addCommentHandler(postId: string, newCommentText: string) {
  const newComment = await addCommentAPI(postId, newCommentText)

  if (!newComment) return
  addComment(props.currentUserProp, props.posts, postId, newComment)
}

// LIKE POST
async function likePostHandler(postId: string) {
  if (!currentUser.value.firstName) return
  const res = await likePost(postId)

  if (res != 'success') return
  postRef.likes.value = [...postRef.likes.value, props.currentUserProp]
  isLiked.value = true
}

// UNLIKE POST
async function unlikePostHandler(postId: string) {
  if (!currentUser.value.firstName) return
  const res = await unlikePost(postId)

  if (res != 'success') return
  postRef.likes.value = postRef.likes.value.filter((f) => f._id !== props.currentUserProp._id)
  isLiked.value = false
}

// DELETE POST
async function deletePostHandler(postId: string) {
  const res = await deletePost(postId)

  if (res != 'success') return

  deletePostFeed(postId)
  deleteUsersPost(currentUser, postId)
  visitedUser.value._id == currentUser.value._id && deleteUsersPost(visitedUser, postId)
}

// DISPLAY OR HIDE COMMENTS
function toggleComments() {
  areCommentsVisible.value = !areCommentsVisible.value

  focusInput(`#comment-input-${postRef._id.value}`)
}

// DISPLAY OR HIDE DELETE POST MODAL
function toggleDeletePostModal() {
  showDeletePostModal.value = !showDeletePostModal.value
}
</script>
<template>
  <div class="shadow-md rounded-md bg-white px-4 py-4 mt-3 relative">
    <UserPhotoAndName
      containerClass="flex gap-3 items-center cursor-pointer"
      :currentUser="postRef.author.value"
      :wrapperSize="{ height: '3rem', width: '3rem' }"
      :imageSize="{ height: '2.4rem', width: '2.4rem' }"
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
    <!-- post text -->
    <blockquote class="text-base mt-2 mb-3">
      {{ props.post.text }}
    </blockquote>
    <!-- number of likes and comments -->
    <div class="flex justify-between items-center mb-5">
      <PostLikesInfo :likes="postRef.likes" />
      <PostCommentsInfo :comments="postRef.comments" @click="toggleComments" />
    </div>

    <!-- like, unlike and see or hide comments user actions -->
    <LikeUnlikePost
      :isLiked="isLiked"
      :postRefId="postRef._id.value"
      @onLike="likePostHandler"
      @onUnlike="unlikePostHandler"
      @onToggleComments="toggleComments"
    />

    <!-- user comments and add new comment form -->
    <div v-show="areCommentsVisible" class="flex flex-col gap-3">
      <div class="flex items-center">
        <UserPhotoAndName
          containerClass="flex gap-3 items-center rounded-t-md cursor-pointer  bg-white  py-4"
          :currentUser="postRef.author.value"
          :wrapperSize="{ height: '2.5rem', width: '2.5rem' }"
          :imageSize="{ height: '2rem', width: '2rem' }"
          v-if="currentUser.firstName && !showEditCommentForm"
        >
        </UserPhotoAndName>
        <AddCommentForm
          v-if="currentUser.firstName && !showEditCommentForm"
          :postId="postRef._id.value"
          @onAddComment="addCommentHandler"
        />
      </div>

      <div v-for="comment in postRef.comments.value" :key="comment._id">
        <UserComments
          v-if="!showEditCommentForm"
          :comments="postRef.comments"
          :comment="comment"
          :currentUser="props.currentUserProp"
          @onShowEditCommentForm="showEditCommentForm = true"
        />
      </div>
    </div>

    <!-- delete post component (if current user is author of the post) -->
    <DeletePostModal
      v-if="props.currentUserProp._id === postRef.author.value._id"
      :showDeletePostModal="showDeletePostModal"
      :postId="postRef._id.value"
      @onDeletePost="deletePostHandler"
      @onToggleDeletePostModal="toggleDeletePostModal"
    />
  </div>
</template>
