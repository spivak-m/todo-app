import { ref } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const useAppStore = defineStore('app', () => {
  const isAppInitialized = ref(false);

  async function initApp() {
    if (isAppInitialized.value) return;

    const authStore = useAuthStore();

    try {
      // чекаем авторизацию
      await authStore.checkAuth();

      // что либо еще, для инициализации приложения (загрузка справочников и т.д.)
    } catch(err) {
      throw err;
    } finally {
      isAppInitialized.value = true;
    }
  }

  return { isAppInitialized, initApp };
})
