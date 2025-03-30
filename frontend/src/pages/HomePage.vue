<template>
  <Header class="header"/>
  <div class="content">
  <router-view />
  </div>
</template>

<style>
.header {
  z-index: 999;
}

.content {
  padding-top: 20px;
  padding-bottom: 0px;
  z-index: -999;
}
</style>

<script setup lang="ts">
import Header from 'components/HeaderControl.vue'
</script>