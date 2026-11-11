import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth.ts'
import { useAppStore } from './stores/app.ts'
import { setAuthFailedHandler } from './api/http.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// обработчик провала авторизации
setAuthFailedHandler(async () => {
  const appStore = useAppStore();
  const authStore = useAuthStore();
  await authStore.logout();

  console.log('isAppInitialized',appStore.isAppInitialized);


  // Сценарий 1: init ещё не завершён — guard сам решит, куда редиректить
  if (!appStore.isAppInitialized) {
    console.log('[setAuthFailedHandler] #1');
    return;
  }

  // Сценарий 2: во время работы — навигации нет, редиректим здесь
  if (router.currentRoute.value.name !== 'login') {
    console.log('[setAuthFailedHandler] #2');
    await router.push({ name: 'login' });
  }
})

app.mount('#app')
