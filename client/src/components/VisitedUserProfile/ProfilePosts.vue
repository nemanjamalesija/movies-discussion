<script setup lang="ts">
import useGetUserStore from '../../composables/useGetUserStore'
import VisitedUsersFriends from '../VisitedUsersFriends.vue'
import SinglePostFeed from '../SinglePostFeed.vue'

const { currentUser, visitedUser } = useGetUserStore()
</script>
<template>
  <section>
    <div class="flex flex-col lg:grid lg:grid-cols-[2.2fr,3fr] gap-5 max-w-[1250px] mx-auto">
      <!-- target user's friends -->
      <div class="shadow-md rounded-md bg-white px-4 py-4 mt-3 h-fit">
        <div class="mb-3">
          <h3 class="font-semibold text-lg">Friends</h3>
          <p class="flex items-center gap-1 text-slate-500 text-base -mt-1">
            <span>{{ visitedUser.friends?.length }}</span>
            <span>friends</span>
          </p>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <VisitedUsersFriends v-for="user in visitedUser.friends" :key="user._id" :user="user" />
        </div>
      </div>

      <!-- return this if target user has no posts -->
      <h2
        v-if="visitedUser.posts && visitedUser.posts.length === 0"
        class="text-slate-500 font-semibold text-base text-center mt-32"
      >
        This user doesn't have any posts.
      </h2>

      <!-- else return target user's posts -->
      <div class="w-full" v-if="visitedUser.posts && visitedUser.posts.length > 0">
        <SinglePostFeed
          v-for="post in visitedUser.posts"
          :key="post._id"
          :post="post"
          :currentUserProp="currentUser"
          :posts="visitedUser.posts"
        />

        <p
          v-if="visitedUser.posts.length > 0"
          class="text-slate-500 font-semibold text-base text-center mt-4"
        >
          No more posts to show
        </p>
      </div>
    </div>
  </section>
</template>
