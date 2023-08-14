<script setup lang="ts">
const props = defineProps<{ visitedUserId: string }>()
</script>

<template>
  <button
    class="px-5 py-2 bg-gray-200 hover:bg-gray-300 font-semibold rounded-md"
    @click="$emit('onAcceptFriend', props.visitedUserId)"
  >
    <p class="flex items-center gap-2 text-base">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-5 h-5 fill-indigo-600"
      >
        <path
          fill-rule="evenodd"
          d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
          clip-rule="evenodd"
        />
      </svg>

      <span>Accept invitation</span>
    </p>
  </button>
</template>
