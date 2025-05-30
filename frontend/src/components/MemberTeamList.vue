<template>
    <div>
        <p class="i-member-teams-title">Команд: {{ teamsByMemberId.length }}</p>
            <div v-for="team in teamsByMemberId" :key="team.id" :id="`team-${team.id}`">
                <q-separator />
                <div>
                <p class="team-title">{{ team.title }}</p>
                </div>
                <p v-if="team.currentProjectId" class="working-team" @click="router.push({name: 'projects', params: {projectId: team.currentProjectId, rialtoId: givenProjects.find(project => project.id === team.currentProjectId)?.rialtoId}})"><strong>Занимается проектом: {{ givenProjects.find(project => project.id === team.currentProjectId)?.title }}</strong></p>
                <div class="team-info">
                    <div class="team-title-panel" style="flex-direction: column; width: 100%;">
                        <p class="team-description"><strong>Описание:</strong></p>
                        <p class="team-description">{{ team.description }}</p>
                    </div>
                    <div class="team-title-panel about-team" style="flex-direction: column;">
                        <p class="team-description"><strong>Тим-лидер:</strong> {{ teamsByMemberIdLeaders[team.id]?.firstname }} {{ teamsByMemberIdLeaders[team.id]?.lastname }}</p>
                        <p class="team-description"><strong>Дата создания:</strong> {{ dateInterpretation(team.createdAt) }}</p>
                        <p class="team-description"><strong>Статус:</strong> {{ team.currentProjectId ? 'В работе' : 'В поисках' }}</p>
                        <p class="team-description"><strong>Приватность:</strong> {{ privacyInterpretation[team.status] }}</p>
                        <p class="team-description"><strong>Количество участников:</strong> {{ team.members.length + 1}}</p>
                    </div>
                </div>

                <div class="team-title-panel" style="max-width: 100%;">
                  <div v-if="teamStacks[team.id]?.length && teamStacks[team.id]!.length > 0" class="stack-panel">
                    <p class="team-description" style="align-self: center;"><strong>Стек технологий: </strong></p>
                    <div class="stack-card" v-for="tech in teamStacks[team.id]" :key="tech">
                      <p style="margin: 0;">{{ tech }}</p>
                    </div>
                  </div>
                  <div v-else>
                    <p class="team-description" style="align-self: center;"><strong>Стек отсутствует</strong></p>
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
            </div>
</template>

<style scoped>
.i-member-teams-title {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #41789C;
    font-weight: 600;
    font-size: 24px;
  }

.team-title {
  margin: 15px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 24px;
  font-weight: 500;
  color: #41789C;
}

.team-title-panel {
    display: flex;
    justify-self: flex-start;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: #E0EEF8;
    max-width: 70%;
    padding: 15px;
    border-radius: 15px;
    border: 1px solid rgba(141, 183, 202, 0.342);
}

.team-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.team-description {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin: 0;
    font-size: 16px;
    color: #41789C;
    font-weight: 400;
    word-wrap: break-word;
}

.about-team {
    margin-left: 20px;
}

.stack-panel {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.members-panel {
    justify-content: center;
    align-items: center;
    margin-right: 10px;
}

.user-avatar {
    width: auto;
    height: 50px;
    margin-right: 10px;
    border-radius: 100%;
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

.stack-card {
    display: flex;
    margin: 5px;
    padding: 5px;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #E0EEF8;
    background-color: #41789C;
}

.working-team {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #41789C;
  font-size: 18px;
  margin: 0;
  box-shadow: 0 0 0 1px #41789C;;
  border-radius: 10px;
  padding: 5px  ;
  margin-top: 10px;
  transition: 0.3s ease;
  display: inline-block; /* Чтобы border-bottom не растягивался на всю ширину */
  border-bottom: 1px solid transparent; /* Прозрачное подчёркивание */
}

.working-team:hover {
  box-shadow: 0 0 0 3px #41789C;;
  cursor: pointer;
}

.highlight {
  animation: highlight 3s ease;
}

@keyframes highlight {
  0% { background-color: rgba(65, 120, 156, 0.2); }
  100% { background-color: transparent; }
}

@media screen and (max-width: 700px) {
  .team-info {
      flex-direction: column;
      justify-content: center;
      gap: 0px;
      .about-team {
          margin-left: 0;
      }
  }

  .team-title-panel {
    max-width: 100%;
  }
}
</style>

<script lang="ts" setup>
import { instance } from 'src/api/axios.api';
import type { IProjects, ITeam, IUser } from 'src/types/types';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { dateInterpretation, privacyInterpretation } from 'src/services/interpritation.service';
import { AuthService } from 'src/services/auth.service';
import { TeamService } from 'src/services/team.service';
import { useUserStore } from 'src/store';
import { useRoute, useRouter } from 'vue-router';

const userStore = useUserStore()
const user = computed(() => userStore.user)

const route = useRoute()
const router = useRouter()

const teamsByMemberId = ref<ITeam[]>([])

const givenProjects = ref<IProjects[]>([])

const teamsByMemberIdMembers = ref<Record<string, IUser[]>>({})
const teamsByMemberIdLeaders = ref<Record<string, IUser>>({})

const teamStacks = ref<Record<number, string[]>>({})
const memberAvatars = ref<Record<string, string>>({})

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

const loadAvatar = async (userId: number): Promise<void> => {
  try {
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
  }
};

const scrollToTeam = async () => {
  if (route.hash) {
    await nextTick(() => {
      const element = document.querySelector(route.hash)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
          element.classList.add('highlight')
          setTimeout(() => {
            element.classList.remove('highlight')
          }, 2000)
        }, 300)
      }
    })
  }
 }

 watch(() => route.hash, async () => {
  await scrollToTeam()
})

onMounted(async () => {
    teamsByMemberId.value = (await instance.get(`teams/member/${user.value?.id}`)).data

    teamsByMemberId.value.forEach(team => {
        loadMembersData(team.id, team.members).catch(error => console.error('Error loading members:', error))});
    
    teamsByMemberId.value.forEach(team => {
    loadTeamLeaderData(team.id, team.teamLeaderId).catch(error => console.error('Error loading leaders:', error));
    })

    await Promise.all(
        teamsByMemberId.value.map(async team => {
          teamStacks.value[team.id] = await TeamService.loadStack(team.id)

          if (team.currentProjectId) {
            givenProjects.value.push((await instance.get(`project/${team.currentProjectId}`)).data)
          }
      })
    )

    await scrollToTeam()

})
</script>