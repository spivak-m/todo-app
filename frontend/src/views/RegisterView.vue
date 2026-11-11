<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { registerSchema } from 'shared';

const router = useRouter();
const auth = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref<string | null>(null);
const loading = ref(false);

async function onSubmit() {
  error.value = null;

  const result = registerSchema.safeParse({
    email: email.value,
    password: password.value,
  });
  if (!result.success) {
    error.value = result.error.issues[0]?.message ?? 'Invalid input';
    return;
  }

  loading.value = true;
  try {
    await auth.register(result.data);
    router.push('/todos');
  } catch (e: any) {
    error.value = e.response?.data?.error ?? 'Registration failed';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <h1>Register</h1>

    <label>
      Email
      <input v-model="email" type="email" required autocomplete="email" />
    </label>

    <label>
      Password (min 8 chars)
      <input v-model="password" type="password" required autocomplete="new-password" />
    </label>

    <p v-if="error" style="color: red">{{ error }}</p>

    <button type="submit" :disabled="loading">
      {{ loading ? 'Creating…' : 'Create account' }}
    </button>

    <p>
      Already have an account? <RouterLink to="/login">Login</RouterLink>
    </p>
  </form>
</template>
