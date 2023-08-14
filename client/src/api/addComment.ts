import { baseUrl } from '../constants/baseUrl'
import getTokenLocalsTorage from './getTokenLocalStorage'
import useGetPostsFeedStore from '../hooks/useGetPostsFeedStore'
import type { UserType } from '@/types/userType'
import type { CommentType, PostFeed } from '@/types/postType'

export default async function addComment(
  postId: string,
  newCommentText: string,
  postUser: UserType,
  posts: PostFeed[]
) {
  const { jwtToken, router, toast } = getTokenLocalsTorage()
  const { handleUpdatePostComments } = useGetPostsFeedStore()

  try {
    const response = await fetch(`${baseUrl}/comments/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      },
      body: JSON.stringify({
        text: newCommentText
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

      handleUpdatePostComments(postUser, posts, postId, newComment as CommentType)
      newCommentText = ''
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
  }
}
