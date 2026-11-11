import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useAppStore } from '@/stores/app';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/todos',
      name: 'todos',
      component: () => import('@/views/TodosView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      redirect: '/todos',
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/todos',
    },
  ],
});

router.beforeEach(async (to) => {
  const app = useAppStore();
  const auth = useAuthStore();

  // Инициализируем всё приложение один раз при старте
  if (!app.isAppInitialized) {
    try {
      await app.initApp();
    } catch(e) {
      console.error('[router] app init failed:', e);
      // не падаем — идём дальше, guard по requiresAuth сам разберётся
    }
  }

  // Защита роутов
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'todos' };
  }

  return true;
});

export default router;
