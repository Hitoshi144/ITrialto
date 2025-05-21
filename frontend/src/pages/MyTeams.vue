<template>
    <div class="container">
        <div class="title-panel">
      <p class="my-teams-title">Мои команды</p>
      </div>
      <div class="tab-container">
        <q-tabs
          v-model="tab"
          vertical
          class="text-primary beautiful-bg"
          style="position:sticky; align-self: flex-start; top: 60px; height: fit-content;"
        >
          <q-tab name="iMember" icon="groups" label="Я - участник" style="border-radius: 20px 0 0 0; border: 1px solid rgba(65, 120, 156, 0.5);" />
          <q-tab name="iTeamLeader" icon="person" label="Я - тим-лидер" style="border: 1px solid rgba(65, 120, 156, 0.5); border-top: 0px;" />
          <q-tab name="createTeamRequests" icon="more_time" label="Заявки" style="border-radius: 0 0 0 20px; border: 1px solid rgba(65, 120, 156, 0.5); border-top: 0px;" />
        </q-tabs>
  
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="slide-down"
          transition-next="slide-up"
          style="border-radius: 0 20px 20px 0; width: 75vw;"
          class="beautiful-bg-2"
        >
          <q-tab-panel name="iMember">
            <RouterView />
          </q-tab-panel>
  
          <q-tab-panel name="iTeamLeader">
            <RouterView v-model:is-delete-dialog-open="teamDeleting" />
          </q-tab-panel>

          <q-tab-panel name="createTeamRequests">
            <RouterView v-model:is-delete-dialog-open="createTeamReqDeleting" />
          </q-tab-panel>
  
        </q-tab-panels>
      </div>
    </div>
  </template>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: calc(100vh - 60px);
    align-items: center;
    margin-top: 40px;
    background: 
      radial-gradient(circle, transparent 20%, rgba(253, 254, 255, 0.7) 20%, rgba(245, 249, 252, 0.7) 80%, transparent 80%, transparent),
      radial-gradient(circle, transparent 20%, rgba(231, 237, 241, 0.7) 20%, rgba(224, 238, 248, 0.7) 80%, transparent 80%, transparent) 15px 15px,
      linear-gradient(rgba(147, 177, 197, 0.7) 1.2px, transparent 1.2px) 0 -0.6px,
      linear-gradient(90deg, rgba(138, 181, 209, 0.7) 1.2px, rgba(224, 238, 248, 0.7) 1.2px) -0.6px 0;
    background-size: 30px 30px, 30px 30px, 15px 15px, 15px 15px;
    background-attachment: local;
    overflow-x: hidden;
  }
  
  .tab-container {
    display: flex;
    width: 90vw;
    max-width: 1200px;
    margin-top: 40px;
    margin-bottom: 20px;
  }

  .title-panel {
    margin-top: 10px;
    padding: 10px;
    border-radius: 15px;
    background-color: #E0EEF8;
  }

  .beautiful-bg {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  backdrop-filter: blur(1px);
  }

  .beautiful-bg-2 {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    backdrop-filter: blur(5px);
    border: 1px solid rgba(141, 183, 202, 0.342);
  }

  .my-teams-title {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 36px;
    font-weight: 600;
    margin: 0;
    color: #41789C;
  }
  </style>
  
  <script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
  
const tab = ref<string>('iMember');

const createTeamReqDeleting = ref<boolean>(false)
const teamDeleting = ref<boolean>(false)

watch(
  () => route.name,
  (newRouteName) => {
    if (newRouteName === 'i-member') {
      tab.value = 'iMember';
    }
    else if (newRouteName === 'create-requests') {
      tab.value = 'createTeamRequests'
    }
    else if (newRouteName === 'i-teamleader') {
      tab.value = 'iTeamLeader'
    }
    // Добавьте другие условия для других вкладок
  },
  { immediate: true } // Выполнить сразу при создании
);

watch(tab, (newTab) => {
  if (newTab === 'iMember') {
    router.push({ name: 'i-member' }).catch(error => console.error('Navigation error: ', error))
  }
  else if (newTab === 'createTeamRequests') {
    router.push({name: 'create-requests'}).catch(error => console.error('Navigation error: ', error))
  }
  else if (newTab === 'iTeamLeader') {
    router.push({name: 'i-teamleader'}).catch(error => console.error('Navigation error: ', error))
  }
})
  </script>