<template>
  <div class="p-4 border rounded shadow-md bg-white">
    <h2 class="text-xl font-bold mb-4">User List</h2>
    <div v-if="pending" class="text-center text-gray-500">Loading users...</div>
    <div v-else-if="error" class="text-center text-red-500">Failed to load users</div>
    <div v-else-if="users?.length === 0" class="text-center text-gray-500">No users found</div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACD ID</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.first_name }} - {{ user.last_name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex gap-2">
                <span class="font-bold">{{ user.acd_id || '-'
                }}</span>
                <UButton color="primary" size="xs" @click="loginToAccess(user)" :loading="loadingIds.has(user.id)">
                  Login Access
                </UButton>
              </div>
              <span class="text-xs">This id
                generated from Acc Dev after succesfull import</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: users, pending, error, refresh } = await useFetch('/api/users', {
  key: 'users'
})
const loadingIds = ref(new Set<number>())

const loginToAccess = async (user: any) => {
  if (!user.acd_id) return

  loadingIds.value.add(user.id)
  try {
    const res = await $fetch<{ url: string }>(`/api/users/${user.id}/access-url`)
    if (res.url) {
      window.open(res.url, '_blank')
    }
  } catch (error) {
    console.error('Failed to get access url', error)
    alert('Failed to login to Access Development')
  } finally {
    loadingIds.value.delete(user.id)
  }
}

defineExpose({
  refresh
})
</script>
