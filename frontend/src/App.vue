<script setup lang="ts">
  import { useAppStore } from './stores/app';

  const appStore = useAppStore()
</script>

<template>
  <span v-if="!appStore.isAppInitialized">инициализация...</span>
  <RouterView v-else />
</template>
