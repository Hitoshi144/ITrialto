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
          <q-tab name="iMember" icon="groups" label="Я - участник" style="border-radius: 20px 0 0 0;" />
          <q-tab name="iTeamLeader" icon="person" label="Я - тим-лидер" style="border-radius: 0 0 0 20px;" />
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
                        <p class="team-description"><strong>Количество участников:</strong> {{ team.members.length + 1}}</p>
                    </div>
                </div>
                <div class="memberList">
                  <div class="team-title-panel members-panel">
                    <img class="user-avatar" v-if="teamsByMemberIdLeaders[team.id]?.id && memberAvatars[teamsByMemberIdLeaders[team.id]?.id ?? '']" 
                    :src="memberAvatars[teamsByMemberIdLeaders[team.id]?.id ?? ''] ?? ''" />
                    <img v-else class="user-avatar" src="../assets/avatar_alt.png" />
                    <div class="member-info">
                      <q-badge color="accent" style="align-self: center; margin-bottom: 10px;" class="leader-badge">Тим-лидер</q-badge>
                      <p class="team-description" style="text-align: center;">{{ teamsByMemberIdLeaders[team.id]?.firstname }} {{ teamsByMemberIdLeaders[team.id]?.lastname }}</p>
                      <p class="team-description" style="text-align: center; font-size: 14px; text-decoration: underline;">{{ teamsByMemberIdLeaders[team.id]?.mail }}</p>
                    </div>
                  </div>
                  <div class="team-title-panel members-panel" v-for="member in teamsByMemberIdMembers[team.id]" :key="member.id">
                      <img class="user-avatar" v-if="memberAvatars[member.id]" :src="memberAvatars[member.id] ?? ''" />
                      <img v-else class="user-avatar" src="../assets/avatar_alt.png" />
                      <div class="member-info">
                      <p class="team-description" style="text-align: center;">{{ member.firstname }} {{ member.lastname }}</p>
                      <p class="team-description" style="text-align: center; font-size: 14px; text-decoration: underline;">{{ member.mail }}</p>
                    </div>
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
    margin-top: 40px;
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

  .user-avatar {
    width: auto;
    height: 50px;
    margin-right: 10px;
    border-radius: 100%;
  }

  .members-panel {
    justify-content: center;
    align-items: center;
    margin-right: 10px;
  }

  .member-info {
    display: flex;
    flex-direction: column;
  }

  .memberList {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
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
import { AuthService } from 'src/services/auth.service';
import { useUserStore } from 'src/store';
import type { ITeam, IUser } from 'src/types/types';
import { onMounted, onUnmounted, ref } from 'vue';
  
  const tab = ref<string>('iMember');

  const user = useUserStore().getUser

  const teamsByMemberId = ref<ITeam[]>([])
  const teamsByLeaderId = ref<ITeam[]>([])
  const teamsByMemberIdMembers = ref<Record<string, IUser[]>>({});
  const teamsByMemberIdLeaders = ref<Record<string, IUser>>({})

  const memberAvatars = ref<Record<string, string>>({})

  const loadAvatar = async (userId: number): Promise<void> => {
  try {
    // Пытаемся загрузить аватар для всех пользователей
    const response = await AuthService.getAvatar(userId);
    if (response && response.size > 0) {
      const avatarUrl = URL.createObjectURL(response);
      memberAvatars.value = { 
        ...memberAvatars.value, 
        [userId]: avatarUrl 
      };
    }
  } catch (error) {
    console.error(`Ошибка загрузки аватара пользователя ${userId}:`, error);
    // В случае ошибки просто не добавляем аватар
  }
};

  const loadTeamLeaderData = async (teamId: number, teamLeaderId: number) => {
    try{
      const response = await instance.get<IUser>(`user/${teamLeaderId}`);
        teamsByMemberIdLeaders.value[teamId] = response.data;
        
        await loadAvatar(response.data.id);
    }
    catch (error) {
      console.log('Ошибка загрузки данных лидеров:', error)
    }
  }

  const loadMembersData = async (teamId: number, memberIds: string[]) => {
  try {
    const membersPromises = memberIds.map(id => 
      instance.get<IUser>(`user/${id}`)
    );
    const membersResponses = await Promise.all(membersPromises);
    teamsByMemberIdMembers.value[teamId] = membersResponses.map(r => r.data);

    await Promise.all(
      membersResponses.map(response => 
        loadAvatar(response.data.id)
    ));
  } catch (error) {
    console.error('Ошибка загрузки данных участников:', error);
  }
};

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

     teamsByMemberId.value.forEach(team => {
     loadMembersData(team.id, team.members).catch(error => console.error('Error loading members:', error));

     teamsByMemberId.value.forEach(team => {
      loadTeamLeaderData(team.id, team.teamLeaderId).catch(error => console.error('Error loading members:', error));
     })
  });
  }
)

onUnmounted(() => {
  Object.entries(memberAvatars.value).forEach(([url]) => {
    if (url && typeof url === 'string') {
      URL.revokeObjectURL(url);
    }
  });
});
  </script>