<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-8 text-center">Test User Access Dev</h1>
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Left Column: User Entry Form -->
      <div class="md:w-[30%]">
        <UserForm @user-added="handleUserAdded" />
      </div>

      <!-- Right Column: User List -->
      <div class="flex-1">
        <UserList ref="userListRef" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const userListRef = ref()

const handleUserAdded = async () => {
  await refreshNuxtData('users')
}
</script>
