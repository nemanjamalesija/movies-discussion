import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { UserType, visitedUserAditionalInfoType } from '../types/userType'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref({} as UserType)

  const loading = ref(false)

  function setLoading(value: boolean) {
    loading.value = value
  }

  function setCurrentUser(userAPI: UserType) {
    currentUser.value = userAPI
  }

  const visitedUser = ref({} as UserType)
  const visitedUserAditionalInfo = ref({} as visitedUserAditionalInfoType)

  // friend requests related
  function acceptFriendRequest(targetUser: UserType) {
    const newUserFriendRequests = currentUser.value.friendRequests?.filter(
      (f) => f._id !== targetUser._id
    )
    currentUser.value.friendRequests = newUserFriendRequests

    currentUser.value.friends?.push(targetUser)

    console.log(currentUser)
  }

  return {
    loading,
    setLoading,
    currentUser,
    setCurrentUser,
    visitedUser,
    visitedUserAditionalInfo,
    acceptFriendRequest
  }
})
