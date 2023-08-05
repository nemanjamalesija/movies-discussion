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

const props = defineProps<{ post: PostFeed; posts: PostFeed[]; currentUser: UserType }>()
const postRef = toRefs(props.post)
const areCommentsVisible = ref<boolean>(false)
const { toast, router } = useAppNavigation()
const { setLoading } = useGetUserStore()
const newCommentText = ref<string>('')
const showDeletePostModal = ref<boolean>(true)
const isLiked = ref<boolean>(false)
const { handleUpdatePostComments } = useGetPostsFeedStore()

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

      handleUpdatePostComments(props.currentUser, props.posts, postId, newComment as CommentType)
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
      postRef.likes.value = [...postRef.likes.value, props.currentUser]
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
      postRef.likes.value = postRef.likes.value.filter((f) => f._id !== props.currentUser._id)
      isLiked.value = false
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
  }
}

function toggleComments() {
  areCommentsVisible.value = !areCommentsVisible.value
}

onMounted(() => {
  isLiked.value = postRef.likes.value.some((f) => f._id === props.currentUser._id)
})

console.log(postRef.likes.value)
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
      <!-- likes -->
      <div class="flex items-center gap-1">
        <button class="flex items-center justify-center gap-1 h-5 w-5 rounded-full bg-indigo-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-3 h-3 fill-white"
          >
            <path
              d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z"
            />
          </svg>
        </button>

        <!-- likes info -->
        <!-- no likes -->
        <p v-if="postRef.likes.value.length === 0" class="text-slate-500 text-sm">
          <span class="text-slate-500"> 0 people like this. </span>
        </p>

        <!-- only one like -->
        <p v-if="postRef.likes.value.length === 1" class="text-slate-500 text-sm">
          <span class="text-slate-500">
            {{ postRef.likes.value[0].firstName }}&nbsp;{{ postRef.likes.value[0].lastName }}
          </span>
          <span>&nbsp;likes this.&nbsp;</span>
        </p>

        <!-- two likes -->
        <p v-if="postRef.likes.value.length === 2" class="text-slate-500 text-sm">
          <span>
            {{ postRef.likes.value[0].firstName }}&nbsp;{{ postRef.likes.value[0].lastName }}
          </span>
          <span>&nbsp;and&nbsp;</span>
          <span>
            {{ postRef.likes.value[1].firstName }}&nbsp;{{ postRef.likes.value[1].lastName }} </span
          >&nbsp;like this.
        </p>

        <!-- more than two likes -->
        <p v-if="postRef.likes.value.length > 2" class="text-slate-500 text-sm">
          <span>
            {{ postRef.likes.value[0].firstName }}&nbsp;{{ postRef.likes.value[0].lastName }}
          </span>
          <span>&nbsp;and&nbsp;</span>
          <span>{{ postRef.likes.value.length - 1 }}&nbsp;</span>others like this.
        </p>
      </div>

      <!-- comments number -->
      <div>
        <p
          role="button"
          tabindex="0"
          class="flex items-center gap-1 text-slate-500 text-sm"
          @click="toggleComments"
        >
          <span>{{ postRef.comments.value.length }}</span>
          <span
            >{{
              postRef.comments.value.length > 1 || postRef.comments.value.length === 0
                ? 'Comments'
                : 'Comment'
            }}
          </span>
        </p>
      </div>
    </div>
    <!-- like and comment user action -->
    <div class="flex items-center gap-3 border-t-2 border-b-2 border-slate-100">
      <!-- if already liked -->
      <button
        v-if="!isLiked"
        class="flex items-center justify-center gap-1 w-full py-2 px-4 text-base hover:bg-slate-100 cursor-pointer rounded-md capitalize font-semibold disabled:bg-gray-500 transition-all duration-150"
        @click="likePost(postRef._id.value)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-5 h-5"
          :class="`${isLiked ? 'fill-indigo-600' : 'fill-gray-600'}`"
        >
          <path
            d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z"
          />
        </svg>
        <span
          class="w-5 h-5 font-semibold flex items-center"
          :class="`${isLiked ? 'text-indigo-600' : 'text-gray-600'}`"
          >Like</span
        >
      </button>

      <!-- if post not liked -->
      <button
        v-if="isLiked"
        class="flex items-center justify-center gap-1 w-full py-2 px-4 text-base hover:bg-slate-100 cursor-pointer rounded-md capitalize font-semibold disabled:bg-gray-500 transition-all duration-150"
        @click="unlikePost(postRef._id.value)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-5 h-5"
          :class="`${isLiked ? 'fill-indigo-600' : 'fill-gray-600'}`"
        >
          <path
            d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z"
          />
        </svg>
        <span
          class="w-5 h-5 font-semibold flex items-center"
          :class="`${isLiked ? 'text-indigo-600' : 'text-gray-600'}`"
          >Like</span
        >
      </button>
      <button
        class="block w-full py-2 px-4 hover:bg-slate-100 text-base cursor-pointer rounded-md capitalize font-semibold text-gray-600 transition-all duration-150"
        @click="toggleComments"
      >
        Comment
      </button>
    </div>

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
        :currentUser="comment.author"
      />
    </div>
    <div v-if="props.currentUser._id === postRef.author.value._id">
      <button class="absolute top-1 right-1" @click="showDeletePostModal = !showDeletePostModal">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-7 h-7"
        >
          <path
            fill-rule="evenodd"
            d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <div
        class="absolute right-4 top-4 flex-1 px-4 py-4 overflow-y-auto ext-sm"
        :class="showDeletePostModal && ' invisible'"
      >
        <!-- popup delete post modal -->

        <div class="flex items-center mb-4">
          <div class="flex-1 bg-white p-2 rounded-lg mb-2 relative shadow-lg">
            <div
              class="flex flex-col gap-1 min-w-[120px] items-start justify-between font-semibold hover:font-bold"
            >
              <button class="w-full text-start hover:bg-slate-200 py-1 px-2 rounded-md">
                Delete
              </button>
            </div>
            <!-- arrow -->
            <div
              class="absolute right-0 top-0 transform -translate-x-1/2 -rotate-45 w-2 h-2 bg-white"
            ></div>
            <!-- end arrow -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
