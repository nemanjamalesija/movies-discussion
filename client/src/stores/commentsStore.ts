import { defineStore } from 'pinia'
import type { CommentType } from '@/types/postType'
import { ref } from 'vue'

export const usePostCommentsStore = defineStore('comments', () => {
  const comments = ref([] as CommentType[])

  function setComments(newComments: CommentType[]) {
    comments.value = newComments
  }

  function deleteComment(commentId: string) {
    comments.value = comments.value.filter((c) => c._id != commentId)
  }

  function editComment(commentId: string, newCommentText: string) {
    const currentComment = comments.value.find((c) => c._id == commentId)
    if (!currentComment) return

    currentComment.text = newCommentText
    comments.value = comments.value.map((c) => {
      if (c._id == currentComment._id) return currentComment
      else return c
    })
  }

  return { deleteComment, editComment, comments, setComments }
})
