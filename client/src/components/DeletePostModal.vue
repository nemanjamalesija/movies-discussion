<script setup lang="ts">
const props = defineProps<{
  showDeletePostModal: boolean
  postId: string
}>()
</script>
<template>
  <div>
    <button
      class="absolute -top-1 -right-1 p-2 hover:scale-125 transition-all duration-200 rounded-full"
      @click="$emit('onToggleDeletePostModal')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-7 h-7 group"
      >
        <path
          fill-rule="evenodd"
          d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
          clip-rule="evenodd"
          class="fill-gray-600"
        />
      </svg>
    </button>
    <div
      class="absolute right-5 top-4 flex-1 px-4 py-4 overflow-y-auto ext-sm"
      :class="!props.showDeletePostModal && ' invisible'"
    >
      <!-- popup delete post modal -->
      <div class="flex items-center mb-4">
        <div class="flex-1 bg-white p-2 rounded-lg mb-2 relative shadow-lg">
          <div
            class="flex flex-col gap-1 min-w-[120px] items-start justify-between font-semibold hover:font-bold"
          >
            <button
              class="w-full text-start hover:bg-slate-200 py-1 px-2 rounded-md"
              @click="$emit('onDeletePost', props.postId), $emit('onToggleDeletePostModal')"
            >
              Delete
            </button>
          </div>
          <!-- arrow -->
          <div
            class="absolute right-0 top-0 transform -translate-x-1/2 -rotate-45 w-2 h-2 bg-white"
          ></div>
          <!-- end arrow -->
        </div>
      </div>
    </div>
  </div>
</template>
