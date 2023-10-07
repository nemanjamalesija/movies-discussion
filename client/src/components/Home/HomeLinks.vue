<script setup lang="ts">
import useGetUserStore from '../../composables/useGetUserStore'
import UserPhotoAndName from '.././ui/UserPhotoAndName.vue'

const { currentUser } = useGetUserStore()
</script>
<template>
  <!-- user profile -->
  <aside class="hidden lg:block">
    <UserPhotoAndName
      containerClass="flex gap-3 items-center hover:bg-slate-200 py-1 px-2 -ml-2 rounded-md cursor-pointer mb-2"
      :currentUser="currentUser"
      :wrapperSize="{ height: '3rem', width: '3rem' }"
      :imageSize="{ height: '2.4rem', width: '2.4rem' }"
    >
      <template #user-photo-adjacent>
        <h2 class="flex items-center gap-1 font-semibold text-base">
          <span>{{ currentUser.firstName }}</span>
          <span>{{ currentUser.lastName }}</span>
        </h2>
      </template>
    </UserPhotoAndName>

    <!-- friends dummy -->
    <div class="link__group py-1 px-2 -ml-2 mb-2 rounded-md hover:bg-slate-200 cursor-pointer">
      <div class="link__group-icon flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="h-9 w-9 fill-indigo-600"
        >
          <path
            fill-rule="evenodd"
            d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z"
            clip-rule="evenodd"
          />
          <path
            d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z"
          />
        </svg>
        <p class="font-semibold text-base">Friends</p>
      </div>
    </div>

    <!-- marketplace dummy -->
    <div class="link__group py-1 px-2 -ml-2 mb-2 rounded-md hover:bg-slate-200 cursor-pointer">
      <div class="link__group-icon flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="h-9 w-9 fill-indigo-600"
        >
          <path
            fill-rule="evenodd"
            d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z"
            clip-rule="evenodd"
          />
        </svg>

        <p class="font-semibold text-base">Marketplace</p>
      </div>
    </div>

    <!-- memories dummy -->
    <div class="link__group py-1 px-2 -ml-2 mb-2 rounded-md hover:bg-slate-200 cursor-pointer">
      <div class="link__group-icon flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="h-9 w-9 fill-indigo-600"
        >
          <path
            fill-rule="evenodd"
            d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
            clip-rule="evenodd"
          />
        </svg>

        <p class="font-semibold text-base">Memories</p>
      </div>
    </div>

    <!-- settings dummy -->
    <div class="link__group py-1 px-2 -ml-2 mb-2 rounded-md hover:bg-slate-200 cursor-pointer">
      <div class="link__group-icon flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="h-9 w-9 fill-indigo-600"
        >
          <path
            fill-rule="evenodd"
            d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z"
            clip-rule="evenodd"
          />
        </svg>

        <p class="font-semibold text-base">Privacy</p>
      </div>
    </div>

    <!-- see more dummy -->
    <div class="link__group py-1 px-2 -ml-2 mb-2 rounded-md hover:bg-slate-200 cursor-pointer">
      <div class="link__group-icon flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="h-9 w-9 fill-indigo-600"
        >
          <path
            fill-rule="evenodd"
            d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
            clip-rule="evenodd"
          />
        </svg>

        <p class="font-semibold text-base">See more</p>
      </div>
    </div>
  </aside>
</template>

<style scoped></style>
