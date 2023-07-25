<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useGetUserStore from '../hooks/useGetUserStore'
import useAppNavigation from '../composables/useAppNavigation'
import SinglePostFeed from './SinglePostFeed.vue'
import LoadingSpinner from './LoadingSpinner.vue'
import { baseUrl } from '../constants/baseUrl'
import type { CommentType, PostFeed } from '../types/postType'

const { loading, setLoading, currentUser } = useGetUserStore()
const { toast, router } = useAppNavigation()

const postsFeed = ref([] as PostFeed[])

async function getFeed() {
  const jwtToken = localStorage.getItem('jwt')

  if (!jwtToken) {
    toast.error('Could not get your session! Please log in.')
    router.push('/')
  }
  setLoading(true)

  try {
    const response = await fetch(`${baseUrl}/posts/feed?offset=0&limit=10`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      }
    })

    if (!response.ok) {
      const error = await response.json()
      toast.error(error.message)
      router.push('/login')
      return
    } else {
      const {
        data: { posts }
      } = await response.json()

      console.log(posts)

      postsFeed.value = posts as PostFeed[]
      console.log(postsFeed.value)
      setLoading(false)
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
    setLoading(false)
  } finally {
    setLoading(false)
  }
}

function handleUpdatePostComments(id: string, newComment: CommentType) {
  const currentPostIndex = postsFeed.value.findIndex((post) => post._id === id)

  if (currentPostIndex !== -1) {
    // Update the comments of the current post
    postsFeed.value[currentPostIndex].comments.push({
      _id: newComment._id,
      text: newComment.text,
      author: {
        id: currentUser.value.id,
        firstName: currentUser.value.firstName,
        lastName: currentUser.value.lastName,
        photo: currentUser.value.photo
      }
    })

    // Keep the post in the same position in the array, remove the post and add the updated post at the same index.
    const currentPost = postsFeed.value[currentPostIndex]
    postsFeed.value.splice(currentPostIndex, 1, currentPost)
  }
}

onMounted(async () => {
  await getFeed()
})
</script>
<template>
  <LoadingSpinner v-if="loading" />
  <div v-else class="flex gap-3 flex-col">
    <SinglePostFeed
      @updatePostComments="handleUpdatePostComments"
      v-for="post in postsFeed"
      :key="post._id"
      :post="post"
    />
  </div>
</template>
