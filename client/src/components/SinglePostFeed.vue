<script setup lang="ts">
import type { CommentType, PostFeed } from '../types/postType'
import type { UserType } from '../types/userType'
import { toRefs, ref, onMounted } from 'vue'
import formatDate from '../helpers/formatDate'
import UserPhotoAndName from './ui/UserPhotoAndName.vue'
import UserComments from './UserComments.vue'
import useAppNavigation from '../composables/useAppNavigation'
import useGetUserStore from '../hooks/useGetUserStore'
import { baseUrl } from '../constants/baseUrl'
import useGetPostsFeedStore from '../hooks/useGetPostsFeedStore'
import PostLikesInfo from './PostLikesInfo.vue'
import PostCommentsInfo from './PostCommentsInfo.vue'
import LikeUnlikePost from './LikeUnlikePost.vue'
import DeletePostModal from './DeletePostModal.vue'

const props = defineProps<{ post: PostFeed; posts: PostFeed[]; currentUserProp: UserType }>()
const postRef = toRefs(props.post)
const areCommentsVisible = ref<boolean>(false)
const { toast, router } = useAppNavigation()
const { setLoading, currentUser, visitedUser } = useGetUserStore()
const newCommentText = ref<string>('')
const showDeletePostModal = ref<boolean>(false)
const isLiked = ref<boolean>(false)
const { handleUpdatePostComments, postsFeed } = useGetPostsFeedStore()

async function addComment(postId: string) {
  const jwtToken = localStorage.getItem('jwt')

  if (!jwtToken) {
    toast.error('Could not get your session! Please log in.')
    router.push('/')
  }

  try {
    const response = await fetch(`${baseUrl}/comments/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      },
      body: JSON.stringify({
        text: newCommentText.value
      })
    })

    if (!response.ok) {
      const error = await response.json()
      toast.error(error.message)
      router.push('/login')
      return
    } else {
      const {
        data: { newComment }
      } = await response.json()

      handleUpdatePostComments(
        props.currentUserProp,
        props.posts,
        postId,
        newComment as CommentType
      )
      newCommentText.value = ''
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
  } finally {
    setLoading(false)
  }
}

// like post
async function likePost(postId: string) {
  const jwtToken = localStorage.getItem('jwt')

  if (!jwtToken) {
    toast.error('Could not get your session! Please log in.')
    router.push('/')
  }

  try {
    const response = await fetch(`${baseUrl}/posts/like`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      },
      body: JSON.stringify({
        id: postId
      })
    })

    if (!response.ok) {
      const error = await response.json()
      toast.error(error.message)

      return
    } else {
      postRef.likes.value = [...postRef.likes.value, props.currentUserProp]
      isLiked.value = true
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
  }
}

async function unlikePost(postId: string) {
  const jwtToken = localStorage.getItem('jwt')

  if (!jwtToken) {
    toast.error('Could not get your session! Please log in.')
    router.push('/')
  }

  try {
    const response = await fetch(`${baseUrl}/posts/unlike`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      },
      body: JSON.stringify({
        id: postId
      })
    })

    if (!response.ok) {
      const error = await response.json()
      toast.error(error.message)

      return
    } else {
      postRef.likes.value = postRef.likes.value.filter((f) => f._id !== props.currentUserProp._id)
      isLiked.value = false
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
  }
}

async function deletePost(postId: string) {
  const jwtToken = localStorage.getItem('jwt')

  if (!jwtToken) {
    toast.error('Could not get your session! Please log in.')
    router.push('/')
  }

  try {
    await fetch(`${baseUrl}/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      }
    })

    visitedUser.value.posts = visitedUser.value.posts?.filter((p) => p._id !== postId)
    currentUser.value.posts = currentUser.value.posts?.filter((p) => p._id !== postId)
    postsFeed.value = postsFeed.value.filter((p) => p._id !== postId)
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
  }
}

function toggleComments() {
  areCommentsVisible.value = !areCommentsVisible.value
}

function toggleDeletePostModal() {
  showDeletePostModal.value = !showDeletePostModal.value
}

onMounted(() => {
  isLiked.value = postRef.likes.value.some((f) => f._id === props.currentUserProp._id)
})
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

    <!-- like and comment user action -->
    <LikeUnlikePost
      :isLiked="isLiked"
      :postRefId="postRef._id.value"
      @onLike="likePost"
      @onUnlike="unlikePost"
      @onToggleComments="toggleComments"
    />

    <!-- user comments -->
    <div v-show="areCommentsVisible" class="flex flex-col gap-3">
      <div class="flex items-center">
        <UserPhotoAndName
          containerClass="flex gap-3 items-center rounded-t-md cursor-pointer  bg-white  py-4"
          :currentUser="postRef.author.value"
          :wrapperSize="{ height: '2.5rem', width: '2.5rem' }"
          :imageSize="{ height: '2rem', width: '2rem' }"
        >
        </UserPhotoAndName>
        <form @submit.prevent="addComment(postRef._id.value)" class="w-full">
          <label for="default-search" class="mb-2 text-sm font-medium sr-only">Search</label>
          <div>
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
            <input
              type="text"
              class="`block w-full py-[0.5rem] px-4 text-sm border border-slate-300 rounded-md bg-slate-50 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              :class="'input--' + postRef._id.value"
              placeholder="Write a comment..."
              v-model="newCommentText"
            />
          </div>
        </form>
      </div>

      <UserComments
        v-for="comment in postRef.comments.value"
        :key="comment._id"
        :comment="comment"
        :currentUser="props.currentUserProp"
      />
    </div>

    <!-- delete post if current user is author of the post -->
    <DeletePostModal
      v-if="props.currentUserProp._id === postRef.author.value._id"
      :showDeletePostModal="showDeletePostModal"
      :postId="postRef._id.value"
      @onDeletePost="deletePost"
      @onToggleDeletePostModal="toggleDeletePostModal"
    />
  </div>
</template>
