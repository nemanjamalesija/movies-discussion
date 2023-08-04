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

  return { loading, setLoading, currentUser, setCurrentUser, visitedUser, visitedUserAditionalInfo }
})
