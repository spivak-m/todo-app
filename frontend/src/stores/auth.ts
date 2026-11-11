import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { PublicUser, LoginInput, RegisterInput } from 'shared';
import { http } from '@/api/http.ts'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<PublicUser | null>(null);
  const isAuthenticated = computed(() => user.value !== null);

  async function checkAuth(): Promise<void> {
    try {
      const { data } = await http.get<{ user: PublicUser }>('/auth/me');
      user.value = data.user;
    } catch(e) {
      user.value = null;
      // 401 — это валидное состояние «не авторизован», не пробрасываем
      if(e.response?.status === 401) {
        return;
      }
      throw e
    }
  }

  async function login(input: LoginInput): Promise<void> {
    const { data } = await http.post<{ user: PublicUser }>('/auth/login', input);
    user.value = data.user;
  }

  async function register(input: RegisterInput): Promise<void> {
    const { data } = await http.post<{ user: PublicUser }>('/auth/register', input);
    user.value = data.user;
  }

  async function logout(): Promise<void> {
    console.log('auth logout method fired');

    user.value = null;
    await http.post('/auth/logout');
  }

  return { user, isAuthenticated, checkAuth, login, register, logout };
})
