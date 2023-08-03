<script setup lang="ts">
import type { UserType } from '@/types/userType'
import UserPhotoAndName from './ui/UserPhotoAndName.vue'

const props = defineProps<{ user: UserType }>()
</script>
<template>
  <div class="searched-user">
    <UserPhotoAndName
      containerClass="flex gap-3 items-center rounded-t-md cursor-pointer "
      :currentUser="props.user"
      :wrapperSize="{ height: '2.5rem', width: '2.5rem' }"
      :imageSize="{ height: '2rem', width: '2rem' }"
    >
      <template #user-photo-adjacent>
        <div class="flex flex-col gap-1">
          <h2 class="flex items-center gap-1 font-semibold text-sm">
            <span>{{ props.user.firstName }}</span>
            <span>{{ props.user.lastName }}</span>
          </h2>
        </div>
      </template>
    </UserPhotoAndName>
  </div>
</template>

<style scoped>
.searched-user:not(:last-child) {
  margin-bottom: 0.5rem;
}
</style>
