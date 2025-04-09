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
        >
          <q-tab name="iMember" icon="groups" label="Я - участник" />
          <q-tab name="iTeamLeader" icon="person" label="Я - тим-лидер" />
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
            <p class="i-member-teams-title">Команд: {{ teamsByMemberId.length }}</p>
            <div v-for="team in teamsByMemberId" :key="team.id">
                <q-separator />
                <div class="team-title-panel">
                <p class="team-title">{{ team.title }}</p>
                </div>
                <div class="team-info">
                    <div class="team-title-panel" style="flex-direction: column; width: 100%;">
                        <p class="team-description"><strong>Описание:</strong></p>
                        <p class="team-description">{{ team.description }}</p>
                    </div>
                    <div class="team-title-panel about-team" style="flex-direction: column;">
                        <p class="team-description"><strong>Тим-лидер:</strong> </p>
                        <p class="team-description"><strong>Дата создания:</strong> {{ dateInterpretation(team.createdAt) }}</p>
                        <p class="team-description"><strong>Статус:</strong> {{ team.currentProjectId ? 'В работе' : 'В поисках' }}</p>
                        <p class="team-description"><strong>Приватность:</strong> {{ privacyInterpretation[team.status] }}</p>
                        <p class="team-description"><strong>Количество участников:</strong> {{ team.members.length }}</p>
                    </div>
                </div>
            </div>
          </q-tab-panel>
  
          <q-tab-panel name="iTeamLeader">
            <div class="text-h4 q-mb-md">Alarms</div>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
          </q-tab-panel>
  
        </q-tab-panels>
      </div>
    </div>
  </template>
  
  <style>
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
  }
  
  .tab-container {
    display: flex;
    width: 90vw;
    max-width: 1200px;
    margin-top: 20px;
  }

  .title-panel {
    margin-top: 20px;
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

  .i-member-teams-title {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #41789C;
    font-weight: 600;
    font-size: 24px;
  }

  .team-title-panel {
    display: flex;
    justify-self: center;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: #E0EEF8;
    padding: 15px;
    border-radius: 15px;
    border: 1px solid rgba(141, 183, 202, 0.342);
  }

  .team-title {
    margin: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 18px;
    font-weight: 500;
    color: #41789C;
  }

  .team-description {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin: 0;
    font-size: 16px;
    color: #41789C;
    font-weight: 400;
  }

  .team-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .about-team {
    margin-left: 20px;
  }

  @media screen and (max-width: 700px) {
    .team-info {
        flex-direction: column;
        .about-team {
            margin-left: 0;
        }
    }
  }
  </style>
  
  <script setup lang="ts">
  import { instance } from 'src/api/axios.api';
import { useUserStore } from 'src/store';
import type { ITeam } from 'src/types/types';
import { onMounted, ref } from 'vue';
  
  const tab = ref<string>('iMember');

  const user = useUserStore().getUser

  const teamsByMemberId = ref<ITeam[]>([])
  const teamsByLeaderId = ref<ITeam[]>([])

  const privacyInterpretation: Record<string, string> = {
  close: "Закрыта",
  open: "Открыта"
};

  const dateInterpretation = (date: string) => {
  const tempCreatedAt = new Date(date);
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(tempCreatedAt.getDate())}.${pad(tempCreatedAt.getMonth() + 1)}.${tempCreatedAt.getFullYear()}`;
};

  onMounted(async () => {
     teamsByMemberId.value = (await instance.get(`teams/member/${user?.id}`)).data
     teamsByLeaderId.value = (await instance.get('teams')).data
  }
)
  </script>