import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { UserType } from '../types/userType'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref({} as UserType)

  const loading = ref(false)

  function setLoading(value: boolean) {
    loading.value = value
  }

  function setCurrentUser(userAPI: UserType) {
    currentUser.value = userAPI
  }

  return { loading, setLoading, currentUser, setCurrentUser }
})
