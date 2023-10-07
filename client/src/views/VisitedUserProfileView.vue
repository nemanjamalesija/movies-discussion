<script setup lang="ts">
import getVisitedProfile from '../api/getVisitedProfile'
import useGetUserStore from '../composables/useGetUserStore'
import useAppNavigation from '../composables/useAppNavigation'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import LogInSignUpConditional from '../components/LogInSignUpConditional.vue'
import ProfileHeader from '../components/VisitedUserProfile/ProfileHeader.vue'
import ProfilePosts from '../components/VisitedUserProfile/ProfilePosts.vue'
import type { UserType } from '../types/userType'
import { onMounted, watch } from 'vue'

const { route, router } = useAppNavigation()
const { loading, setLoading, currentUser, setVisitedUser, visitedUserAditionalInfo } =
  useGetUserStore()

async function getVisitedUserHandler() {
  setLoading(true)

  const res = await getVisitedProfile(route.params.id as string)
  if (!res) {
    router.push('/')
    return
  }

  const { isAlreadyFriends, isFriendRequested, targetUser } = res

  setLoading(false)
  setVisitedUser(targetUser as UserType)
  visitedUserAditionalInfo.value = { isAlreadyFriends, isFriendRequested }
}

onMounted(async () => {
  await getVisitedUserHandler()
})

watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId !== oldId) {
      await getVisitedUserHandler()
    }
  }
)
</script>
<template>
  <LoadingSpinner v-if="loading" class="mt-60" />
  <div v-else class="pb-20">
    <!-- if visiting profile without user logged in, 
    display link to log in and sign up pages -->
    <LogInSignUpConditional v-if="!currentUser.firstName" />

    <ProfileHeader />
    <ProfilePosts />
  </div>
</template>
