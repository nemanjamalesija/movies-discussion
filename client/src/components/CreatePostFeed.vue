<script setup lang="ts">
import { ref } from 'vue'
import useGetUserStore from '../hooks/useGetUserStore'
import UserPhotoAndName from './ui/UserPhotoAndName.vue'
import useAppNavigation from '../composables/useAppNavigation'
import { baseUrl } from '../constants/baseUrl'
import useGetPostsFeedStore from '../hooks/useGetPostsFeedStore'

const isPostingPhoto = ref<boolean>(false)
const newPostText = ref<string>('')
const { currentUser } = useGetUserStore()
const { toast, router } = useAppNavigation()
const { postsFeed } = useGetPostsFeedStore()

async function createNewPost() {
  const jwtToken = localStorage.getItem('jwt')

  if (!jwtToken) {
    toast.error('Could not get your session! Please log in.')
    router.push('/')
  }

  try {
    const response = await fetch(`${baseUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      },
      body: JSON.stringify({
        text: newPostText.value
      })
    })

    if (!response.ok) {
      const error = await response.json()
      toast.error(error.message)
      router.push('/login')
      return
    } else {
      const {
        data: { newPost }
      } = await response.json()

      postsFeed.value.unshift({
        ...newPost,
        author: {
          _id: currentUser.value._id,
          firstName: currentUser.value.firstName,
          lastName: currentUser.value.lastName,
          photo: currentUser.value.photo
        }
      })
      newPostText.value = ''

      console.log(postsFeed.value)
    }
  } catch (error) {
    toast.error('Oop, something went wrong!')
    console.log(error)
  }
}
</script>
<template>
  <div>
    <div class="flex w-full px-3 py-4 items-center border-b border-b-slate-100 bg-white">
      <UserPhotoAndName
        containerClass="flex gap-3 items-center rounded-t-md cursor-pointer  "
        :currentUser="currentUser"
        :wrapperSize="{ height: '3rem', width: '3rem' }"
        :imageSize="{ height: '2.4rem', width: '2.4rem' }"
      >
        <template #user-photo-adjacent> </template>
      </UserPhotoAndName>
      <form action="" class="w-full" @submit.prevent="createNewPost">
        <label for="default-search" class="mb-2 text-sm font-medium sr-only">Search</label>
        <div>
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
          <input
            type="search"
            id="default-search"
            class="block w-full py-[0.5rem] px-4 text-sm border border-slate-300 rounded-full bg-slate-50 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            :placeholder="`What's on your mind, ${currentUser.firstName} ?`"
            autocomplete="off"
            v-model="newPostText"
          />
        </div>
      </form>
    </div>
    <hr aria-orientation="horizontal" class="h-[1px] w-full bg-slate-100" />
    <div></div>
    <div class="bg-white px-3 py-4 rounded-b-md">
      <button
        v-if="!isPostingPhoto"
        class="w-full text-center flex items-center justify-center gap-2"
        @click="isPostingPhoto = true"
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-5 h-5 fill-indigo-600"
          >
            <path
              fill-rule="evenodd"
              d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
              clip-rule="evenodd"
            />
          </svg>
        </span>

        <span class="text-base font-semibold">Add photo</span>
      </button>
      <form v-if="isPostingPhoto" enctype="multipart/form-data">
        <div class="form-group">
          <input
            id="photo"
            type="file"
            name="photo"
            class="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 cursor-pointer bg-gray-50"
          />

          <p
            class="mt-2 ml-2 mb-7 inline-block text-sm text-gray-500 dark:text-gray-300"
            id="file_input_help"
          >
            SVG, PNG, JPG or GIF.
          </p>
          <div class="flex items-center gap-3">
            <button
              class="block w-full py-2 px-4 bg-indigo-600 text-base hover:bg-indigo-700 cursor-pointer rounded-md text-white capitalize font-semibold disabled:bg-gray-500 transition-all duration-150"
            >
              submit
            </button>
            <button
              class="block w-full py-2 px-4 bg-slate-200 text-base hover:bg-slate-300 cursor-pointer rounded-md capitalize font-semibold transition-all duration-150"
              @click.prevent="isPostingPhoto = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
