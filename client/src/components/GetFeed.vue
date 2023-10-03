<script setup lang="ts">
import { onMounted } from 'vue'
import useGetUserStore from '../hooks/useGetUserStore'
import SinglePostFeed from './SinglePostFeed.vue'
import LoadingSpinner from './LoadingSpinner.vue'
import type { PostType } from '../types/postType'
import useGetPostsFeedStore from '../hooks/useGetPostsFeedStore'
import getFeed from '../api/getFeed'

const { loading, setLoading, currentUser } = useGetUserStore()
const { postsFeed } = useGetPostsFeedStore()

async function getFeedHandler() {
  setLoading(true)

  const posts = await getFeed()
  if (posts) postsFeed.value = posts as PostType[]

  setLoading(false)
}

onMounted(async () => {
  await getFeedHandler()
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
        :currentUserProp="currentUser"
      />
    </div>
    <p v-if="postsFeed.length > 0" class="text-slate-500 font-semibold text-base text-center mt-4">
      No more posts to show
    </p>
  </section>
</template>
