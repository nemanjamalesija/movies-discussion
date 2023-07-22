<script setup lang="ts">
import useGetUserStore from '../hooks/useGetUserStore'
import { onMounted, ref } from 'vue'
import useAppNavigation from '../composables/useAppNavigation'
import logoutHandler from '../helpers/logoutHandler'
import userAnonym from '../utils/anonym.png'

const { currentUser, setCurrentUser } = useGetUserStore()
const { router, toast } = useAppNavigation()

onMounted(async () => {
  const navRef = ref(document.querySelector('.header-nav'))

  const handleStickyNav = function () {
    if (!navRef.value) return

    if (window.scrollY > 50) navRef.value.classList.add('sticky')
    else navRef.value.classList.remove('sticky')
  }

  window.addEventListener('scroll', handleStickyNav)

  return () => window.removeEventListener('scroll', handleStickyNav)
})
</script>
<template>
  <header class="header-nav absolute top-0 left-0 w-full z-40">
    <nav
      class="nav pb-3 relative h-full px-6 flex items-center justify-between text-base lg:text-lg font-medium"
    >
      <!-- Logo and page navigation -->
      <div class="flex items-center">
        <div class="logo flex items-center gap-2">
          <RouterLink to="/">
            <button
              class="capitalize font-semibold mr-4 w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center relative"
            >
              <span class="absolute text-4xl font-semibold text-white">S</span>
            </button>
          </RouterLink>

          <!-- Search input -->
          <label for="default-search" class="mb-2 text-sm font-medium sr-only">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                class="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              class="block w-full py-[0.6rem] px-6 pl-10 text-sm border border-gray-300 rounded-full bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Search"
              required
            />
          </div>
        </div>
      </div>

      <!-- User related -->
      <div class="nav__user flex items-center gap-10">
        <RouterLink
          class="font-semibold uppercase text-base"
          v-if="!currentUser.firstName"
          to="/login"
          >Log in</RouterLink
        >
        <RouterLink
          v-if="!currentUser.firstName"
          to="/signup"
          class="btn-signup py-3 px-6 rounded-full transition-all duration-300 hover:-translate-y-[3px] flex items-center justify-center text-base bg-white hover:bg-[#f8f9fa] font-semibold uppercase"
          >Sign up</RouterLink
        >

        <!-- User info -->
        <div v-if="currentUser.firstName" class="user flex flex-col items-center gap-3 font-bold">
          <div class="user__photo-box flex gap-4 items-center">
            <img
              class="card__picture-img object-cover w-11 h-11 inline-block rounded-full"
              :src="currentUser.photo !== '' ? currentUser.photo : userAnonym"
              :alt="currentUser.firstName + ' image'"
            />
            <p class="username inline-block font-semibold cursor-pointer">
              {{ currentUser.firstName }}
            </p>
          </div>

          <!-- Drop down modal -->
          <div class="account bg-white flex flex-col text-base gap-2 rounded-md w-max">
            <RouterLink v-if="currentUser.role === 'admin'" class="nav__link" to="/dashboard"
              >Dashboard</RouterLink
            >
            <RouterLink class="nav__link" to="/me"> Account </RouterLink>
            <RouterLink class="nav__link" to="/products"> My reviews </RouterLink>
            <RouterLink class="nav__link" to="/products"> Help & support </RouterLink>
            <RouterLink class="nav__link" to="/products"> Display & accesibility </RouterLink>
            <RouterLink class="nav__link" to="/products"> Give feedback</RouterLink>
            <button
              v-if="currentUser.firstName"
              class="nav__link text-start"
              @click.prevent="logoutHandler(router, toast, setCurrentUser)"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header-nav {
  transition: all 0.3s;
  padding-top: 2rem;
  padding-bottom: 2rem;
  position: fixed;
}

.header-nav.sticky {
  background-color: rgba(255, 255, 255, 0.95);
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.user {
  position: absolute;
  right: 5%;
  top: 6.5%;
  padding-bottom: 2rem;
}

.account {
  -webkit-box-shadow: 0 1rem 2.5rem rgba(0, 0, 0, 0.1);
  box-shadow: 0 1rem 2.5rem rgba(0, 0, 0, 0.1);
  max-height: 0;
  visibility: hidden;
  transition: max-height 0.3s;
  overflow: hidden;
}

.account {
  position: absolute;
  top: 78%;
  right: 0.3%;
}

.user:hover > .account {
  visibility: visible;
  transform-origin: top;
  padding: 1rem;
  max-height: 300px;
}

.nav__link:hover {
  transition: all 0.2s;
  color: #4f46e5;
}
</style>
