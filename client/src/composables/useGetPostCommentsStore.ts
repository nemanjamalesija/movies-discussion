import { storeToRefs } from 'pinia'
import { usePostCommentsStore } from '@/stores/commentsStore'

export default function useGetSinglePostStore() {
  const postCommentsStore = usePostCommentsStore()
  const { comments } = storeToRefs(postCommentsStore)
  const { setComments, deleteComment, editComment } = usePostCommentsStore()

  return { comments, setComments, deleteComment, editComment }
}
