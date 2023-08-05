<script setup lang="ts">
import { onMounted } from 'vue'
import useGetUserStore from '../hooks/useGetUserStore'
import useAppNavigation from '../composables/useAppNavigation'
import SinglePostFeed from './SinglePostFeed.vue'
import LoadingSpinner from './LoadingSpinner.vue'
import { baseUrl } from '../constants/baseUrl'
import type { PostFeed } from '../types/postType'
import useGetPostsFeedStore from '../hooks/useGetPostsFeedStore'

const { loading, setLoading, currentUser } = useGetUserStore()
const { toast, router } = useAppNavigation()
const { postsFeed } = useGetPostsFeedStore()

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

onMounted(async () => {
  await getFeed()
})
</script>
<template>
  <LoadingSpinner v-if="loading" />
  <section v-else>
    <div class="flex gap-3 flex-col">
      <SinglePostFeed
        v-for="post in postsFeed"
        :key="post._id"
        :posts="postsFeed"
        :post="post"
        :currentUser="currentUser"
      />
    </div>
    <p v-if="postsFeed.length > 0" class="text-slate-500 font-semibold text-base text-center mt-4">
      No more posts to show
    </p>
  </section>
</template>
