<script setup lang="ts">
import type { UserType } from '@/types/userType'

const props = defineProps<{ user: UserType }>()

console.log(props)
</script>
<template>
  <RouterLink :to="`/${props.user._id}`">
    <div>
      <figure class="mb-2 hover:brightness-95 transition-all duration-150">
        <div
          v-if="props.user.photo"
          class="bg-gray-300 rounded-full flex items-center justify-center cursor-pointer"
        >
          <img
            class="object-cover inline-block rounded-full"
            :src="props.user.photo"
            :alt="props.user.firstName + ' image'"
          />
        </div>
        <button
          v-if="!props.user.photo"
          class="bg-gray-300 rounded-md flex items-center justify-center cursor-pointer border-2 border-white h-full w-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff">
            <path
              fill-rule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <!-- user photo adjacent element -->
      </figure>
      <h2 class="flex items-center gap-1 font-semibold text-sm">
        <span>{{ props.user.firstName }}</span>
        <span>{{ props.user.lastName }}</span>
      </h2>
    </div>
  </RouterLink>
</template>
