<template>
    <div class="header">
      <div class="header_logo">
        <img src="../assets/logo.png" alt="Логотип" class="logo" />
        <h1 class="logo-text no-select">ITrialto</h1>
      </div>
      <nav>
        <q-tabs class="text-secondary" v-model="selectedPage">
            <q-tab name="projects" label="Биржа проектов" />
            <q-tab name="teams" label="Реестр команд" />
        </q-tabs>
      </nav>
      <q-btn class="bg-accent" rounded>
      <div class="profile_logo">
        <img src="../assets/avatar_alt.png" alt="Аватар" class="logo" />
        <div class="name_rule">
        <p class="name">{{ user?.firstname }} {{ user?.lastname }}</p>
        <q-badge rounded color="primary" style="font-size: smaller; font-weight: 600; opacity: 75%; justify-content: center; padding-top: 5px;">{{ rolesInterpritation[user?.role as keyof typeof rolesInterpritation || 'withoutRole'] }}</q-badge>
        </div>
      </div>
      <q-menu transition-show="jump-down" transition-hide="jump-up" transition-duration="300" fit :offset="[0, 5]">
        <q-list class="bg-secondary">
          <q-item clickable v-close-popup>
            <q-item-section class="no-select">Профиль</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-close-popup>
            <q-item-section class="no-select">Моя команда</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section class="no-select">Мои проекты</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-close-popup @click="logoutHandler" class="logout">
            <q-item-section class="no-select">Выйти</q-item-section>
            <q-item-section avatar>
              <img src="../assets/logout.png" height="20px" width="auto">
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
      </q-btn>
    </div>
  </template>
  
  <style scoped>
  .header {
    position: fixed;
    display: flex;
    align-items: center;
    width: 100vw;
    height: 60px;
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

  .profile_logo {
    height: 45px;
  }

  .profile_logo h1 {
    font-size: 1rem;
    font-weight: 400;
    margin: 0px;
  }

  .profile_logo img {
    height: 40px;
    width: auto;
  }

  .no-select {
    user-select: none;
  }

  .name {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: medium;
  }

  .name_rule {
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 817px) {
    

    .header_logo h1 {
      display: none;
    }
  }

  @media (max-width: 690px) {
    .name_rule {
      display: none;
    }
  }


  .logout {
    background-color: #E0EEF8;
    transition: background-color 0.3s ease;
  }
  .logout:hover {
    background-color: rgb(240, 125, 125);
  }

  </style>
  
  <script setup lang="ts">
  import { removeTokenFromLocalStorage } from 'src/helpers/localstorage.helper';
import { useUserStore } from 'src/store';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

  const userStore = useUserStore()

  const router = useRouter()

  const user = userStore.getUser

  const rolesInterpritation = {
    parther: 'Партнер',
    student: 'Студент',
    teacher: 'Преподаватель',
    withoutRole: 'Без роли'
  }

  const selectedPage = ref<string>('projects')

  const logoutHandler = async () => {
    userStore.logout()
    removeTokenFromLocalStorage('token')
    await router.push({name: 'auth'})
  }
  </script>