<script setup lang="ts">
import type { UserType } from '../../types/userType'
const props = defineProps<{ class: string; currentUser: UserType }>()
</script>
<template>
  <RouterLink to="/" class="block w-full">
    <div :class="props.class">
      <img
        v-if="props.currentUser.photo"
        class="object-cover h-10 w-10 inline-block rounded-full"
        :src="props.currentUser.photo"
        :alt="props.currentUser.firstName + ' image'"
      />
      <button
        class="bg-gray-300 rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
        v-if="!props.currentUser.photo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" class="w-8 h-8">
          <path
            fill-rule="evenodd"
            d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <!-- user photo adjacent element -->
      <slot name="user-photo-adjacent"> &nbsp;</slot>
    </div>
  </RouterLink>
</template>
