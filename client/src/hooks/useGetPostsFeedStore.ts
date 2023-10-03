import { storeToRefs } from 'pinia'
import { usePostFeedStore } from '../stores/postsStore'

export default function useGetPostsFeedStore() {
  const postFeedStore = usePostFeedStore()
  const { postsFeed } = storeToRefs(postFeedStore)
  const { addComment, deleteComment } = usePostFeedStore()

  return { postsFeed, addComment, deleteComment }
}
