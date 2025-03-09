<template>
  <router-view />
  <ToastifyContainer position="bottom-right" />
</template>

<script setup lang="ts">
import { ToastifyContainer } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

</script>