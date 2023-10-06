import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import type { UserType } from '../types/userType'
import type { CommentType, PostType } from '@/types/postType'

export const usePostFeedStore = defineStore('postFeed', () => {
  const postsFeed = ref([] as PostType[])

  function createPost(newPost: PostType, currentUser: Ref<UserType>) {
    postsFeed.value.unshift({
      ...newPost,
      author: {
        _id: currentUser.value._id,
        firstName: currentUser.value.firstName,
        lastName: currentUser.value.lastName,
        photo: currentUser.value.photo
      }
    })
  }

  function deletePostFeed(posts: Ref<PostType[]>, postId: string) {
    posts.value = posts.value.filter((p) => p._id != postId)
  }

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

  function editComment(comments: Ref<CommentType[]>, commentId: string, newCommentText: string) {
    const currentComment = comments.value.find((c) => c._id == commentId)
    if (!currentComment) return

    currentComment.text = newCommentText
    comments.value = comments.value.map((c) => {
      if (c._id == currentComment._id) return currentComment
      else return c
    })
  }

  return { postsFeed, createPost, deletePostFeed, addComment, deleteComment, editComment }
})
