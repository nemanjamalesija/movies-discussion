import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/userStore'

export default function useGetUserStore() {
  const userStore = useUserStore()
  const { currentUser, visitedUser, visitedUserAditionalInfo, loading } = storeToRefs(userStore)
  const {
    setCurrentUser,
    deleteUsersPost,
    setLoading,
    acceptFriendRequest,
    dennyFriendRequest,
    removeFriend
  } = useUserStore()

  return {
    userStore,
    currentUser,
    setCurrentUser,
    deleteUsersPost,
    loading,
    setLoading,
    visitedUser,
    visitedUserAditionalInfo,
    acceptFriendRequest,
    dennyFriendRequest,
    removeFriend
  }
}
