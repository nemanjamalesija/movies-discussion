import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/userStore'

export default function useGetUserStore() {
  const userStore = useUserStore()
  const { currentUser, loading } = storeToRefs(userStore)
  const { setCurrentUser, setLoading } = useUserStore()

  return { userStore, currentUser, setCurrentUser, loading, setLoading }
}
