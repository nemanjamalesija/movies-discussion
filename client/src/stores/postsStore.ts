import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import type { UserType } from '../types/userType'
import type { CommentType, PostType } from '@/types/postType'

export const usePostFeedStore = defineStore('postFeed', () => {
  const postsFeed = ref([] as PostType[])

  function addComment(
    currentUser: UserType,
    posts: PostType[],
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

  function deleteComment(comments: Ref<CommentType[]>, commentId: string) {
    comments.value = comments.value.filter((c) => c._id != commentId)
  }

  return { postsFeed, addComment, deleteComment }
})
