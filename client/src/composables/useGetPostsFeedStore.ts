import { storeToRefs } from 'pinia'
import { usePostFeedStore } from '../stores/postsStore'

export default function useGetPostsFeedStore() {
  const postFeedStore = usePostFeedStore()
  const { postsFeed } = storeToRefs(postFeedStore)
  const { createPost, addComment, deleteComment, editComment, deletePostFeed } = usePostFeedStore()

  return { postsFeed, createPost, deletePostFeed, addComment, deleteComment, editComment }
}
