import { storeToRefs } from 'pinia'
import { useSinglePostStore } from '@/stores/singlePostStore'

export default function useGetSinglePostStore() {
  const singlePostStore = useSinglePostStore()
  const { singlePost } = storeToRefs(singlePostStore)
  const { setSinglePost, likePost, unlikePost } = useSinglePostStore()

  return { singlePost, setSinglePost, likePost, unlikePost }
}
