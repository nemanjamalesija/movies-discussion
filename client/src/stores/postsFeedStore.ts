import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { UserType } from '../types/userType'
import type { CommentType, PostFeed } from '@/types/postType'

export const usePostFeedStore = defineStore('postFeed', () => {
  const postsFeed = ref([] as PostFeed[])

  function handleUpdatePostComments(
    currentUser: UserType,
    posts: PostFeed[],
    id: string,
    newComment: CommentType
  ) {
    const currentPostIndex = posts.findIndex((post) => post._id === id)

    if (currentPostIndex !== -1) {
      // Update the comments of the current post
      posts[currentPostIndex].comments.push({
        _id: newComment._id,
        text: newComment.text,
        author: {
          _id: currentUser._id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          photo: currentUser.photo
        }
      })
    }
  }

  return { postsFeed, handleUpdatePostComments }
})
