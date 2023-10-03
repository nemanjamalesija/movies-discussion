<script setup lang="ts"></script>
<template>
  <RouterLink to="/login">
    <div class="absolute right-[37.5px] top-4">
      <p
        class="capitalize font-semibold mr-1 h-10 w-10 rounded-full bg-slate-600 hover:bg-slate-700 flex items-center justify-center transition-all duration-200"
      >
        <span class="text-3xl font-semibold text-white">S</span>
      </p>
      <span class="text-[#555] hover:text-[#444] font-semibold text-base">Log in</span>
    </div>
  </RouterLink>

  <RouterLink to="/signup">
    <div class="absolute right-8 top-24">
      <p
        class="capitalize font-semibold mr-1 h-10 w-10 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center transition-all duration-200"
      >
        <span class="text-3xl font-semibold text-white">S</span>
      </p>
      <span class="text-[#555] hover:text-[#444] font-semibold text-base">Sign up</span>
    </div>
  </RouterLink>
</template>
