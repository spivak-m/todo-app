<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const router = useRouter();

async function onLogout() {
  await auth.logout();
  router.push('/login');
}
</script>

<template>
  <div>
    <h1>Todos</h1>
    <p v-if="auth.user">Hello, {{ auth.user.email }}</p>
    <button @click="onLogout">Logout</button>
    <p>(UI for todos — next stage)</p>
  </div>
</template>
