<template>
    <div class="container">
        <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 400px">
      <q-tabs
        v-model="tab"
        narrow-indicator
        dense
        align="justify"
        class="text-primary beautiful-bg"
      >
        <q-tab :ripple="false" name="teams" icon="groups" label="Команды" style="margin-right: 50px; padding-left: 50px; padding-right: 50px; border-radius: 20px 20px 0 0; border: 1px solid rgba(65, 120, 156, 0.5); border-bottom: 0;">
            <q-badge color="primary" floating>{{ createTeamRequests.length }}</q-badge>
        </q-tab>
        <q-tab :ripple="false" name="projects" icon="emoji_objects" label="Проекты" style="padding-left: 50px; padding-right: 50px; border-radius: 20px 20px 0 0; border: 1px solid rgba(65, 120, 156, 0.5); border-bottom: 0;" />
      </q-tabs>

      <q-tab-panels
          v-model="tab"
          animated
          swipeable
          transition-prev="slide-right"
          transition-next="slide-left"
          style="width: 85vw; justify-self: center; margin: 0; border-radius: 10px;"
          class="beautiful-bg-2"
        >
    
        <q-tab-panel name="teams">
            <div v-for="request in createTeamRequests" :key="request.id">
                <div style="display: flex; flex-direction: row; justify-content: space-between;">
                <p class="main-text"><strong>Название:</strong> {{ request.title }}</p>
                <q-btn outline color="primary" disable :label="statusInterpretation[request.status as keyof typeof statusInterpretation || 'withoutStatus']" style="margin-top: 20px; border-radius: 10px; height: 20px;" />
                </div>
                <p class="main-text"><strong>Описание:</strong> {{ request.description }}</p>
                <p class="main-text"><strong>Тим-лидер:</strong> {{ teamLeaders[request.creatorId]?.firstname }} {{ teamLeaders[request.creatorId]?.lastname }} (<span style="text-decoration: underline;">{{ teamLeaders[request.creatorId]?.mail }}</span>)</p>
                <p class="main-text"><strong>Дата подачи:</strong> {{ dateInterpretation(request.createdAt) }}</p>
                <div style="margin-top: 30px; margin-bottom: 20px; display: flex; flex-direction: row; justify-content: space-around;">
                    <q-btn filled color="primary" label="Принять" style="border-radius: 10px; width: 150px;" @click="approveCreateTeamRequest(request.id)" />
                    <q-btn outline color="primary" label="Отклонить" style="border-radius: 10px; width: 150px;" @click="rejectCreateTeamRequest(request.id)" />
                </div>
                <q-separator color="primary" v-if="request.id != createTeamRequests[createTeamRequests.length - 1]?.id" />
            </div>

            <p class="main-text" v-if="createTeamRequests.length === 0">Заявок на создание команды нету :(</p>
        </q-tab-panel>

        <q-tab-panel name="projects">
            <p>Проекты</p>
        </q-tab-panel>

    </q-tab-panels>

    </div>
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
    justify-content: center;
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

  .beautiful-bg {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  backdrop-filter: blur(1px);
  }

  .beautiful-bg-2 {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    backdrop-filter: blur(5px);
    border: 1px solid rgba(141, 183, 202, 0.342);
  }

  .main-text {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin: 15px;
    font-size: 18px;
    color: #41789C;
    font-weight: 400;
    word-wrap: break-word;
  }

</style>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { instance } from 'src/api/axios.api';
import { AuthService } from 'src/services/auth.service';
import type { ICreateTeamRequest, IUser } from 'src/types/types';
import { onMounted, onUnmounted, ref } from 'vue';
import { toast } from 'vue3-toastify';

 const tab = ref('teams')

 const userAvatars = ref<Record<string, string>>({})

 const createTeamRequests = ref<ICreateTeamRequest[]>([])

 const teamLeaders = ref<IUser[]>([])

 const loadAvatar = async (userId: number): Promise<void> => {
  try {
    const response = await AuthService.getAvatar(userId);
    if (response && response.size > 0) {
      const avatarUrl = URL.createObjectURL(response);
      userAvatars.value = { 
        ...userAvatars.value, 
        [userId]: avatarUrl 
      };
    }
  } catch (error) {
    console.error(`Ошибка загрузки аватара пользователя ${userId}:`, error);
  }
};

 const loadTeamLeaderData = async (teamLeaderId: number) => {
    try{
      const response = await instance.get<IUser>(`user/${teamLeaderId}`);
        teamLeaders.value[teamLeaderId] = response.data;

        await loadAvatar(response.data.id);
    }
    catch (error) {
      console.log('Ошибка загрузки данных лидеров:', error)
    }
  }

  const dateInterpretation = (date: string) => {
  const tempCreatedAt = new Date(date);
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(tempCreatedAt.getDate())}.${pad(tempCreatedAt.getMonth() + 1)}.${tempCreatedAt.getFullYear()}`;
};

 const approveCreateTeamRequest = async (requestId: number) => {
    try {
      await instance.patch(`create-team-request/${requestId}/approve`)
      toast.success('Заявка одобрена')
      createTeamRequests.value = createTeamRequests.value.filter(req => req.id != requestId)
    }
    catch (error: any) {
        toast.error(error.message)
    }
 }

 const rejectCreateTeamRequest = async (requestId: number) => {
    try {
        await instance.patch(`create-team-request/${requestId}/reject`)
        toast.success('Заявка отклонена')
        createTeamRequests.value = createTeamRequests.value.filter(req => req.id != requestId)
    }
    catch (error: any) {
        toast.error(error.message)
    }
 }

const statusInterpretation = {
    pending: 'На рассмотрении',
    approved: 'Одобрена',
    rejected: 'Отклонена'
}

 onMounted(async () => {
    createTeamRequests.value = (await instance.get('create-team-request/pending')).data

    createTeamRequests.value.forEach(req => {loadTeamLeaderData(req.creatorId).catch(error => console.error('Error loading leaders:', error))})
 })

 onUnmounted(() => {
  Object.entries(userAvatars.value).forEach(([url]) => {
    if (url && typeof url === 'string') {
      URL.revokeObjectURL(url);
    }
  });
});

</script>