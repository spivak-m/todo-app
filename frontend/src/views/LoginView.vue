<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { loginSchema } from 'shared';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref<string | null>(null);
const loading = ref(false);

async function onSubmit() {
  error.value = null;

  // Клиентская валидация той же zod-схемой, что на бэке
  const result = loginSchema.safeParse({
    email: email.value,
    password: password.value,
  });
  if (!result.success) {
    error.value = result.error.issues[0]?.message ?? 'Invalid input';
    return;
  }

  loading.value = true;
  try {
    await auth.login(result.data);
    const redirect = (route.query.redirect as string) || '/todos';
    router.push(redirect);
  } catch (e: any) {
    error.value = e.response?.data?.error ?? 'Login failed';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <h1>Login</h1>

    <label>
      Email
      <input v-model="email" type="email" required autocomplete="email" />
    </label>

    <label>
      Password
      <input v-model="password" type="password" required autocomplete="current-password" />
    </label>

    <p v-if="error" style="color: red">{{ error }}</p>

    <button type="submit" :disabled="loading">
      {{ loading ? 'Logging in…' : 'Login' }}
    </button>

    <p>
      No account? <RouterLink to="/register">Register</RouterLink>
    </p>
  </form>
</template>
