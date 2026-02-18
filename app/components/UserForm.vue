<template>
  <div class="p-4 border rounded shadow-md bg-white">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Add User</h2>
      <UButton size="xs" color="neutral" variant="solid" @click="generateRandomUser">
        Generate Random
      </UButton>
    </div>
    <p class="mb-4">User will be imported to Access Development automatically after succesfull creation</p>
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">First Name</label>
        <input v-model="form.first_name" type="text" required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Last Name</label>
        <input v-model="form.last_name" type="text" required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Email (unique - should not match with existing
          emails)</label>
        <input v-model="form.email" type="email" required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2">
      </div>
      <div v-if="error" class="text-red-600 text-sm">
        {{ error }}
      </div>
      <button type="submit" :disabled="loading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
        {{ loading ? 'Adding...' : 'Add User' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['user-added'])

const form = ref({
  first_name: '',
  last_name: '',
  email: ''
})

const loading = ref(false)
const error = ref('')

const generateRandomUser = () => {
  const randomString = Math.random().toString(36).substring(7)
  const randomNum = Math.floor(Math.random() * 1000)
  form.value = {
    first_name: `User${randomString}`,
    last_name: `Test${randomNum}`,
    email: `user${randomString}${randomNum}@xcelerate.com`
  }
}

const submitForm = async () => {
  loading.value = true
  error.value = ''
  try {
    const newUser = await $fetch('/api/users', {
      method: 'POST',
      body: form.value
    })

    emit('user-added', newUser)
    form.value = {
      first_name: '',
      last_name: '',
      email: ''
    }
  } catch (err: any) {
    console.error('User creation failed:', err)
    const errMsg = err.data?.message || err.message || 'Failed to add user'
    const errStatus = err.statusCode || err.response?.status
    error.value = errStatus ? `${errStatus}: ${errMsg}` : errMsg
  } finally {
    loading.value = false
  }
}
</script>
