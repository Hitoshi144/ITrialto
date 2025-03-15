<template>
  <router-view />
  <ToastifyContainer position="bottom-right" />
</template>

<script setup lang="ts">
import { ToastifyContainer } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useUserStore } from './store';
import { onMounted } from 'vue';

const userStore = useUserStore();

onMounted(async () => {
  try {
    await userStore.checkAuth();
  } catch (error) {
    console.error('Ошибка при проверке авторизации:', error);
  }
});
</script>