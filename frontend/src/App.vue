<template>
  <router-view />
  <ToastifyContainer />
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

<style>
 .Toastify__toast-container {
  width: 320px !important;
}

.Toastify__toast {
  border-radius: 10px !important;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
  font-size: 16px;
}

.Toastify__toast--success {
  background: #E0EEF8 !important;
  color: black !important;
}

.Toastify__toast--error {
  background: #E0EEF8 !important;
  color: black !important;
}

.Toastify__progress-bar--success {
  background: #1fc475 !important; /* Белый прогресс-бар */
  opacity: 0.7 !important;
}

.Toastify__progress-bar--error {
  background: #ab3737 !important; /* Белый прогресс-бар */
  opacity: 0.5 !important;
}

.Toastify__toast--error .Toastify__toast-icon svg {
  fill: #ab3737;
  opacity: 0.6;
}

.Toastify__toast--success .Toastify__toast-icon svg {
  fill: #1fc475;
}
</style>