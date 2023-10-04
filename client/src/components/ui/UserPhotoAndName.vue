<script setup lang="ts">
import type { UserType } from '../../types/userType'
const props = defineProps<{
  containerClass: string
  currentUser: UserType
  wrapperSize: { height: string; width: string }
  imageSize: { height: string; width: string }
}>()
</script>
<template>
  <RouterLink :to="`/${props.currentUser._id}`" class="block">
    <div :class="props.containerClass">
      <div
        v-if="props.currentUser.photo"
        class="bg-gray-300 rounded-full flex items-center justify-center cursor-pointer"
        :style="{ height: props.wrapperSize.height, width: props.wrapperSize.width }"
      >
        <img
          class="object-cover inline-block rounded-full"
          :src="props.currentUser.photo"
          :alt="props.currentUser.firstName + ' image'"
          :style="{ height: props.imageSize.height, width: props.imageSize.width }"
        />
      </div>
      <!-- // if there is no photo display generic anonymus user image -->
      <button
        v-if="!props.currentUser.photo"
        class="bg-gray-300 rounded-full flex items-center justify-center cursor-pointer border-2 border-white"
        :style="{ height: props.wrapperSize.height, width: props.wrapperSize.width }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#fff"
          :style="{ height: props.imageSize.height, width: props.imageSize.width }"
        >
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
