<template>
    <div class="header">
      <div class="header_logo">
        <img src="../assets/photo_2024-08-05_19-14-54.jpg" alt="Логотип" class="logo" />
        <h1 class="logo-text">ITrialto</h1>
      </div>
      <nav>
        <q-tabs>
            <q-tab name="projects" label="Биржа проектов" />
            <q-tab name="teams" label="Реестр команд" />
        </q-tabs>
      </nav>
      <div class="profile_logo">
        <img src="../assets/photo_2024-05-16_09-57-47.jpg" alt="Аватар" class="logo" />
        <h1 class="name">Имя Фамилия</h1>
      </div>
    </div>
  </template>
  
  <style scoped>
  .header {
    position: fixed;
    display: flex;
    align-items: center;
    width: 100vw;
    height: 75px;
    background: #41789c;
    padding: 0 20px;
    justify-content: space-between;
  }
  
  .header_logo, .profile_logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .logo {
    height: 50px;
    width: auto;
  }
  
  .logo-text {
    margin: 0;
    color:#E0EEF8;
    ;
    font-weight: 700;
    font-size: 2.5rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .name {
    margin: 0;
    color:#E0EEF8;
    ;
    font-size: 2.5rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  </style>
  
  <script setup lang="ts">
  </script>