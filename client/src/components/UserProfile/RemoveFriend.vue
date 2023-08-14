<script setup lang="ts">
const props = defineProps<{ visitedUserId: string }>()
</script>
<template>
  <button
    class="px-5 py-2 bg-gray-200 font-semibold rounded-md hover:bg-gray-300 transition-all duration-150"
    @click="$emit('onDeleteFriend', props.visitedUserId)"
  >
    <p class="flex items-center gap-2 text-base">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-5 h-5 fill-red-600"
      >
        <path
          d="M10.375 2.25a4.125 4.125 0 100 8.25 4.125 4.125 0 000-8.25zM10.375 12a7.125 7.125 0 00-7.124 7.247.75.75 0 00.363.63 13.067 13.067 0 006.761 1.873c2.472 0 4.786-.684 6.76-1.873a.75.75 0 00.364-.63l.001-.12v-.002A7.125 7.125 0 0010.375 12zM16 9.75a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-6z"
        />
      </svg>

      <span>Remove friend</span>
    </p>
  </button>
</template>
