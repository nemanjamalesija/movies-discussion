import { storeToRefs } from 'pinia'
import { usePostFeedStore } from '../stores/postsFeedStore'

export default function useGetPostsFeedStore() {
  const postFeedStore = usePostFeedStore()
  const { postsFeed } = storeToRefs(postFeedStore)
  const { handleUpdatePostComments } = usePostFeedStore()

  return { postsFeed, handleUpdatePostComments }
}
