import { storeToRefs } from 'pinia'
import { usePostFeedStore } from '../stores/postFeedStore'

export default function useGetPostFeedStore() {
  const postFeedStore = usePostFeedStore()
  const { postsFeed } = storeToRefs(postFeedStore)
  const { handleUpdatePostComments } = usePostFeedStore()

  return { postsFeed, handleUpdatePostComments }
}
