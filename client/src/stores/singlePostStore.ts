import { ref } from 'vue'
import { defineStore } from 'pinia'

import type { PostType } from '@/types/postType'

export const useSinglePostStore = defineStore('singlePost', () => {
  const singlePost = ref({} as PostType)

  function setSinglePost(newPost: PostType) {
    singlePost.value = newPost
  }

  function likePost(postId: string) {
    singlePost.value.likes = singlePost.value.likes.filter((f) => f._id != postId)
  }

  function unlikePost(postId: string) {
    singlePost.value.likes = singlePost.value.likes.filter((f) => f._id != postId)
  }

  return { singlePost, setSinglePost, likePost, unlikePost }
})
