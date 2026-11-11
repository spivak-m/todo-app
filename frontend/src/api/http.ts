import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

let onAuthFailed: (() => Promise<void>) | null = null
let refreshPromise: Promise<void> | null = null
let authFailurePromise: Promise<void> | null = null

export function setAuthFailedHandler(fn: () => Promise<void>) {
  onAuthFailed = fn;
}

async function handleAuthFailure(): Promise<void> {
  if(onAuthFailed) {
    await onAuthFailed()
  } else {
    // фолбэк, если не зареган обработчик ошибки авторизации (в main.ts)
    window.location.href = '/login';
  }
}

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;

    // Не 401 → пробрасываем
    if(error.response?.status !== 401 || !original) {
      return Promise.reject(error);
    }

    // Уже пытались рефрешить → не зацикливаемся
    if(original._retry) {
      return Promise.reject(error);
    }

    // Сам /refresh вернул 401 → refresh-токен истёк, возвращаем reject, уходит в catch ниже
    if(original.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    original._retry = true

    try {
      // Дедупликация: если 5 запросов одновременно получили 401,
      // refresh уйдёт только один раз, остальные ждут его
      if (!refreshPromise) {
        refreshPromise = http
          .post('/auth/refresh')
          .then(() => undefined)
          .finally(() => {
            refreshPromise = null;
          });
      }
      await refreshPromise;

      // Повторяем исходный запрос с новым access-токеном в cookie
      return http(original);
    } catch (refreshError) {
      // Дедупликация: если на 5 запросах одновременно упал рефреш,
      // обработчик отработает только один раз,
      // возможная колбэка ошибка молча проглатывается
      if(!authFailurePromise) {
        authFailurePromise = handleAuthFailure()
          .catch(() => {})
          .finally(() => authFailurePromise = null)
      }
      await authFailurePromise;

      return Promise.reject(refreshError);
    }
  }
)
