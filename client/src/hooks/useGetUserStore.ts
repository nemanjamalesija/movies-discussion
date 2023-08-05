import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/userStore'

export default function useGetUserStore() {
  const userStore = useUserStore()
  const { currentUser, visitedUser, visitedUserAditionalInfo, loading } = storeToRefs(userStore)
  const { setCurrentUser, setLoading, acceptFriendRequest, dennyFriendRequest } = useUserStore()

  return {
    userStore,
    currentUser,
    setCurrentUser,
    loading,
    setLoading,
    visitedUser,
    visitedUserAditionalInfo,
    acceptFriendRequest,
    dennyFriendRequest
  }
}
