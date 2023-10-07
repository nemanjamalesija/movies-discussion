import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { UserType, visitedUserAditionalInfoType } from '../types/userType'
import type { Ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref({} as UserType)
  const visitedUser = ref({} as UserType)
  const visitedUserAditionalInfo = ref({} as visitedUserAditionalInfoType)

  const loading = ref(false)

  function setLoading(value: boolean) {
    loading.value = value
  }

  function setCurrentUser(userAPI: UserType) {
    currentUser.value = userAPI
  }

  function setVisitedUser(userAPI: UserType) {
    visitedUser.value = userAPI
  }

  function deleteUsersPost(user: Ref<UserType>, postId: string) {
    user.value.posts = user.value.posts?.filter((p) => p._id !== postId)
  }

  // friend requests related
  function acceptFriendRequest(targetUserId: string) {
    currentUser.value.friendRequests = currentUser.value.friendRequests?.filter(
      (f) => f._id != targetUserId
    )
    visitedUser.value.friendRequests = visitedUser.value.friendRequests?.filter(
      (f) => f._id === currentUser.value._id
    )

    currentUser.value.friends?.push(visitedUser.value)

    visitedUser.value.friends?.push(currentUser.value)
    visitedUserAditionalInfo.value.isAlreadyFriends = true
  }

  function removeFriend(targetUserId: string) {
    currentUser.value.friends = currentUser.value.friends?.filter((f) => f._id != targetUserId)

    visitedUser.value.friends = visitedUser.value.friends?.filter(
      (f) => f._id != currentUser.value._id
    )
    visitedUserAditionalInfo.value.isAlreadyFriends = false
  }

  function dennyFriendRequest(targetUserId: string) {
    const newUserFriendRequests = currentUser.value.friendRequests?.filter(
      (f) => f._id !== targetUserId
    )
    currentUser.value.friendRequests = newUserFriendRequests
  }

  return {
    loading,
    setLoading,
    currentUser,
    setCurrentUser,
    setVisitedUser,
    deleteUsersPost,
    visitedUser,
    visitedUserAditionalInfo,
    acceptFriendRequest,
    dennyFriendRequest,
    removeFriend
  }
})
