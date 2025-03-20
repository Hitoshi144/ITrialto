<template>
  <Header />
  <div class="content">
  <router-view />
  </div>
</template>

<style>
.content {
  padding-top: 60px;
}
</style>

<script setup lang="ts">
import Header from 'components/HeaderControl.vue'
</script>