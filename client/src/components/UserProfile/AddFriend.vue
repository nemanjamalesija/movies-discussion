<script setup lang="ts">
import useGetUserStore from '@/hooks/useGetUserStore'
const props = defineProps<{ visitedUserId: string }>()
const { currentUser } = useGetUserStore()
</script>
<template>
  <button
    class="px-5 py-2 bg-gray-200 hover:bg-gray-300 font-semibold rounded-md transition-all duration-150 disabled:invisible"
    @click="$emit('onAddFriend', props.visitedUserId)"
    :disabled="!currentUser.firstName"
  >
    <p class="flex items-center gap-2 text-base">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-5 h-5 fill-indigo-600"
      >
        <path
          d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"
        />
      </svg>

      <span>Add friend</span>
    </p>
  </button>
</template>
