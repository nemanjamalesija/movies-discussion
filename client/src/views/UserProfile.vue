<script setup lang="ts">
import useGetUserStore from '../hooks/useGetUserStore'
import useAppNavigation from '../composables/useAppNavigation'
import { baseUrl } from '@/constants/baseUrl'
import type { UserType } from '../types/userType'
import { onMounted, ref } from 'vue'
import UserPhotoAndName from '../components/ui/UserPhotoAndName.vue'

const { route, router, toast } = useAppNavigation()
const { loading, setLoading } = useGetUserStore()
const visitedUser = ref({} as UserType)

async function getVisitedUser() {
  const jwtToken = localStorage.getItem('jwt')

  if (!jwtToken) {
    toast.error('Could not get your session! Please log in.')
    router.push('/')
  }
  setLoading(true)

  try {
    const response = await fetch(`${baseUrl}/users/${route.params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      }
    })

    if (!response.ok) {
      const error = await response.json()
      toast.error(error.message)
      router.push('/login')
      return
    } else {
      const {
        data: { targetUser }
      } = await response.json()

      setLoading(false)
      visitedUser.value = targetUser as UserType
      console.log(visitedUser.value)
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
    setLoading(false)
  } finally {
    setLoading(false)
  }
}

onMounted(async () => {
  await getVisitedUser()
})
</script>
<template>
  <header class="bg-white h-[70vh] pt-0 pl-32 pb-32 pr-32 shadow-sm relative">
    <div class="bg-gray-200 h-full rounded-md"></div>
    <UserPhotoAndName
      containerClass="flex gap-5 items-center absolute bottom-[2%] left-[10%] cursor-default"
      :currentUser="visitedUser"
      :wrapperSize="{ height: '10rem', width: '10rem' }"
      :imageSize="{ height: '9rem', width: '9rem' }"
    >
      <template #user-photo-adjacent>
        <div class="flex flex-col gap-1 mt-8">
          <h2 class="flex items-center gap-1 font-semibold text-3xl">
            <span>{{ visitedUser.firstName }}</span>
            <span>{{ visitedUser.lastName }}</span>
          </h2>

          <p class="flex gap-1 text-slate-500 font-semibold">
            <span>{{ visitedUser.friends?.length }}</span>
            <span>friends</span>
          </p>
        </div>
      </template>
    </UserPhotoAndName>
  </header>
</template>
