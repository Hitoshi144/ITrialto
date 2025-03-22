<template>
  <Header />
  <div class="content">
  <router-view />
  </div>
</template>

<style>
.content {
  padding-top: 20px;
  padding-bottom: 0px;
}
</style>

<script setup lang="ts">
import Header from 'components/HeaderControl.vue'
</script>