<template>
<div>
    <div class="teams-header">
            <p class="i-member-teams-title">Команд: {{ teamsByLeaderId.length }}</p>
            <q-btn outline color="primary" label="создать команду" style="height: 20px; border-radius: 10px;" icon="add" @click="teamIsCreating = true" />
            </div>

            <q-dialog v-model="teamIsCreating" backdrop-filter="blur(4px)" transition-show="fade" transition-hide="fade" @before-hide="clearTeamVariables()">
              <q-card flat bordered class="team-edit-card" style="border-radius: 15px;">
                <q-card-section>
                  <div style="display: flex; flex-direction: row; justify-content: space-between;">
                  <p class="text-h5" style="color: #41789C;">Создание команды</p>
                  <q-btn flat color="primary" rounded icon="close" v-close-popup />
                  </div>
                </q-card-section>
                <q-card-section>
                  <q-input outlined label="Название команды" v-model="teamTitle" type="text" />
                </q-card-section>
                <q-card-section>
                  <q-input outlined label="Описание команды" v-model="teamDescription" type="textarea" autogrow />
                </q-card-section>
                <q-card-section>
                  <div style="display: flex; justify-content: center;">
                  <q-btn filled color="primary" label="подать заявку" @click="sendTeamCreatingRequest()" style="border-radius: 10px;" />
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>

            <div v-for="team in teamsByLeaderId" :key="team.id" :id="`team-${team.id}`">
                <q-separator />
                <div class="teams-header" style="align-items: center;">
                <p class="team-title">{{ team.title }}</p>
                <q-btn outline color="primary" :label="requestsToTeam.filter(req => req.teamId === team.id).length + ' ' + requestWordInterpretation(requestsToTeam.filter(req => req.teamId === team.id).length) + ' в команду'" style="height: 20px; border-radius: 10px; min-width: 200px;" @click="dialogStates.showingRequests[team.id] = true"  :disable="requestsToTeam.filter(req => req.teamId === team.id).length != 0 ? false : true" />

                  <q-dialog :model-value="dialogStates.showingRequests[team.id] ?? false" @update:model-value="val => dialogStates.showingRequests[team.id] = val" backdrop-filter="blur(4px)" transition-show="fade" transition-hide="fade">
                    <q-card flat bordered class="team-edit-card" style="border-radius: 15px;">
                      <q-card-section>
                        <div style="display: flex; flex-direction: row; justify-content: space-between;">
                        <p class="text-h5" style="color: #41789C;">Заявки на вступление в команду <strong>{{ team.title }}</strong></p>
                        <q-btn flat color="primary" rounded icon="close"  style="max-height: 48px;" v-close-popup />
                        </div>
                      </q-card-section>

                      <q-card-section v-for="request in requestsToTeam.filter(req => req.teamId === team.id)" :key="request.id">
                        <q-separator />
                        <div style="display: flex; justify-content: space-around; align-items: center; flex-direction: row; margin-top: 15px;">
                          <img class="user-avatar" style="margin-left: 40px; height: 80px; border: 2px solid #41789C;" v-if="memberAvatars[request.userId]" :src="memberAvatars[request.userId] ?? ''" />
                          <img v-else class="user-avatar" style="margin-left: 40px; height: 80px; border: 2px solid #41789C;" src="../assets/avatar_alt.png" />
                          <div style="display: flex; flex-direction: column;  width: 100%; align-items: center;">
                          <div class="team-title-panel" style="flex-direction: column; align-items: center;">
                            <p class="team-description">{{ request.user.firstname }} {{ request.user.lastname }}</p>
                            <p class="team-description" style="text-decoration: underline;">{{ request.user.mail }}</p>
                          </div>
                          <div class="team-title-panel">
                            <p class="team-description"><strong>Группа:</strong> {{ request.user.group }}</p>
                          </div>
                          <div class="team-title-panel" v-if="request.user.aboutMe">
                            <p class="team-description">{{ request.user.aboutMe }}</p>
                          </div>
                          </div>
                        </div>
                        <div style="display: flex; flex-direction: row; justify-content: space-around; margin-top: 20px;">
                          <q-btn filled color="primary" label="Принять" icon="check_circle" @click="approveRequestToTeam(request.id, team.id, request.userId)" style="border-radius: 10px;" />
                          <q-btn outline color="primary" label="Отклонить" icon="cancel" @click="rejectRequestToTeam(request.id, team.id)" style="border-radius: 10px;" />
                        </div>
                      </q-card-section>

                    </q-card>
                  </q-dialog>

                </div>
                <p v-if="team.currentProjectId" class="working-team" @click="router.push({name: 'projects', params: {projectId: team.currentProjectId, rialtoId: givenProjects.find(project => project.id === team.currentProjectId)?.rialtoId}})"><strong>Занимается проектом: {{ givenProjects.find(project => project.id === team.currentProjectId)?.title }}</strong></p>
                <div class="team-info">
                    <div class="team-title-panel" style="flex-direction: column; width: 100%;">
                        <p class="team-description"><strong>Описание:</strong></p>
                        <p class="team-description">{{ team.description }}</p>
                    </div>
                    <div class="team-title-panel about-team" style="flex-direction: column;">
                        <p class="team-description"><strong>Тим-лидер:</strong> {{ user?.firstname }} {{ user?.lastname }}</p>
                        <p class="team-description"><strong>Дата создания:</strong> {{ dateInterpretation(team.createdAt) }}</p>
                        <p class="team-description"><strong>Статус:</strong> {{ team.currentProjectId ? 'В работе' : 'В поисках' }}</p>
                        <p class="team-description"><strong>Приватность:</strong> {{ privacyInterpretation[team.status] }}</p>
                        <q-btn color="primary" unelevated size="xs" :label="team.status == 'close' ? 'Открыть' : 'Закрыть'" style="font-size: 10px; border-radius: 10px;"  @click="changeTeamPrivacy(team.id, team.status)" />
                        <p class="team-description"><strong>Количество участников:</strong> {{ team.members.length + 1}}</p>
                    </div>
                </div>

                <div class="team-title-panel" style="max-width: 100%;">
                  <div v-if="teamStacks[team.id] && teamStacks[team.id]!.length > 0" class="stack-panel">
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
                    <img class="user-avatar" v-if="user?.id && memberAvatars[user.id ?? '']" 
                    :src="memberAvatars[user?.id ?? ''] ?? ''" />
                    <img v-else class="user-avatar" src="../assets/avatar_alt.png" />
                    <div class="member-info">
                      <q-badge color="accent" style="align-self: center; margin-bottom: 10px;" class="leader-badge">Тим-лидер</q-badge>
                      <p class="team-description" style="text-align: center;">{{ user?.firstname }} {{ user?.lastname }}</p>
                      <p class="team-description" style="text-align: center; font-size: 14px; text-decoration: underline;">{{ user?.mail }}</p>
                    </div>
                  </div>
                  <div class="team-title-panel members-panel" v-for="member in teamsByLeaderIdMembers[team.id]" :key="member.id">
                      <img class="user-avatar" v-if="memberAvatars[member.id]" :src="memberAvatars[member.id] ?? ''" />
                      <img v-else class="user-avatar" src="../assets/avatar_alt.png" />
                      <div class="member-info">
                      <p class="team-description" style="text-align: center;">{{ member.firstname }} {{ member.lastname }}</p>
                      <p class="team-description" style="text-align: center; font-size: 14px; text-decoration: underline;">{{ member.mail }}</p>
                      <q-btn filled color="primary" label="исключить" size="10px" style="border-radius: 10px; margin-top: 5px;" @click="openMemberDeleteDialog(team.id, member.id.toString())" />

                      <q-dialog :model-value="getMemberDeletingState(team.id, member.id.toString())" @update:model-value="val => setMemberDeletingState(team.id, member.id.toString(), val)" backdrop-filter="blur(4px)" transition-show="fade" transition-hide="fade">
                        <q-card flat bordered class="team-edit-card" style="border-radius: 15px;">
                          <q-card-section>
                            <div style="display: flex; justify-content: space-between; flex-direction: row;">
                              <p class="text-h5" style="color: #41789C;">Исключение участника</p>
                              <q-btn flat color="primary" rounded icon="close" v-close-popup />
                            </div>
                          </q-card-section>
                          <q-card-section>
                            <p class="text-h6" style="color: #41789C; margin-left: 30px;">Вы уверены, что хотите <span style="color: #eb6449;">исключить</span> участника {{ member.firstname }} {{ member.lastname }} из команды "{{ team.title }}"?</p>
                          </q-card-section>
                          <q-card-section>
                            <div style="display: flex; justify-content: space-between; flex-direction: row;">
                              <q-btn outline color="negative" style="border-radius: 10px; margin-left: 20px;" label="Да, исключить" @click="deleteMemberFromTeam(team.id.toString(), member.id.toString())" />
                              <q-btn filled color="primary" style="border-radius: 10px; margin-right: 20px;" label="Нет, не исключать" @click="closeMemberDeleteDialog(team.id, member.id.toString())" />
                            </div>
                          </q-card-section>
                        </q-card>
                      </q-dialog>

                    </div>
                    </div>
                </div>
                <div class="teamControlButtons">
                  <q-btn outline color="primary" label="изменить" style="margin-right: 10px; border-radius: 10px; margin-bottom: 20px;" icon="edit" @click="editTeam(team.title, team.description, team.id)" />

                  <q-dialog :model-value="dialogStates.editingTeams[team.id] ?? false" @update:model-value="val => dialogStates.editingTeams[team.id] = val" backdrop-filter="blur(4px)" transition-show="fade" transition-hide="fade" @before-hide="clearTeamVariables()">
                    <q-card flat bordered class="team-edit-card" style="border-radius: 15px;">
                      <q-card-section>
                        <div style="display: flex; flex-direction: row; justify-content: space-between;">
                        <div class="text-h5" style="color: #41789C;">Изменение команды</div>
                        <q-btn flat color="primary" rounded icon="close" v-close-popup />
                        </div>
                      </q-card-section>
                      <q-card-section>
                        <q-input outlined label="Название команды" v-model="teamTitle" type="text" />
                      </q-card-section>
                      <q-card-section>
                        <q-input outlined label="Описание команды" v-model="teamDescription" type="textarea" autogrow />
                      </q-card-section>
                      <q-card-section>
                        <div style="display: flex; justify-content: center;">
                        <q-btn filled label="сохранить изменения" color="primary" @click="saveTeamChanges(team.id)" style="border-radius: 10px;" />
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-dialog>

                  <q-btn filled color="primary" label="удалить" style="border-radius: 10px; margin-bottom: 20px;" icon-right="delete_forever" @click="openDeleteDialog(team.id)" />

                  <q-dialog :model-value="dialogStates.deletingTeams[team.id] ?? false" @update:model-value="val => dialogStates.deletingTeams[team.id] = val" backdrop-filter="blur(4px)" transition-show="fade" transition-hide="fade">
                    <q-card flat bordered class="team-edit-card" style="border-radius: 15px;">
                      <q-card-section>
                        <div style="display: flex; justify-content: space-between; flex-direction: row;">
                          <p class="text-h5" style="color: #41789C;">Удаление команды</p>
                        <q-btn flat color="primary" rounded icon="close" v-close-popup />
                        </div>
                      </q-card-section>
                      <q-card-section>
                        <p class="text-h6" style="color: #41789C; margin-left: 30px;">Вы уверены, что хотите <span style="color: #eb6449;">удалить</span> команду "{{ team.title }}"?</p>
                      </q-card-section>
                      <q-card-section>
                        <div style="display: flex; flex-direction: row; justify-content: space-between;">
                          <q-btn outline color="negative" style="border-radius: 10px; margin-left: 20px;" label="Да, удалить" @click="deleteTeam(team.id.toString())" />
                          <q-btn filled color="primary" style="border-radius: 10px; margin-right: 20px;" label="Нет, не удалять" @click="dialogStates.deletingTeams[team.id] = false" />
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-dialog>

                </div>
            </div>
</div>
</template>

<style scoped>
.team-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 20px;
}

.teams-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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

.i-member-teams-title {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #41789C;
    font-weight: 600;
    font-size: 24px;
}

.team-edit-card {
    width: 75vw;
}

.team-title {
    margin: 15px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 24px;
    font-weight: 500;
    color: #41789C;
}

.user-avatar {
    width: auto;
    height: 50px;
    margin-right: 10px;
    border-radius: 100%;
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

.team-description {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  font-size: 16px;
  color: #41789C;
  font-weight: 400;
  word-wrap: break-word;
}

.stack-panel {
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

.memberList {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
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

.teamControlButtons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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

  .teams-header {
    flex-direction: column;
  }
}
</style>

<script lang="ts" setup>
  /* eslint-disable @typescript-eslint/no-explicit-any */
import { instance } from 'src/api/axios.api';
import type { IProjects, ITeam, ITeamRequests, IUser } from 'src/types/types';
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { toast } from 'vue3-toastify';
import { requestWordInterpretation, dateInterpretation, privacyInterpretation } from 'src/services/interpritation.service';
import { useUserStore } from 'src/store';
import { AuthService } from 'src/services/auth.service';
import { TeamService } from 'src/services/team.service';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()

const user = useUserStore().getUser

const teamsByLeaderId = ref<ITeam[]>([])

const teamStacks = ref<Record<number, string[]>>({})

const teamsByLeaderIdMembers = ref<Record<string, IUser[]>>({})
const memberAvatars = ref<Record<string, string>>({})

const requestsToTeam = ref<ITeamRequests[]>([])

const givenProjects = ref<IProjects[]>([])

const teamIsCreating = ref<boolean>(false)

const dialogStates = reactive({
  deletingTeams: {} as Record<number, boolean | null>,
  deletingMembers: {} as Record<string, Record<string, boolean | null>>,
  showingRequests: {} as Record<number, boolean | null>,
  editingTeams: {} as Record<number, boolean | null>
})

const getMemberDeletingState = (teamId: number, memberId: string) => {
  return dialogStates.deletingMembers[teamId]?.[memberId] ?? false
}

const setMemberDeletingState = (teamId: number, memberId: string, value: boolean) => {
  if (!dialogStates.deletingMembers[teamId]) {
    dialogStates.deletingMembers[teamId] = {}
  }
  dialogStates.deletingMembers[teamId][memberId] = value
}

const openDeleteDialog = (teamId: number) => {
  dialogStates.deletingTeams[teamId] = true
}

const openMemberDeleteDialog = (teamId: number, memberId: string) => {
  if (!dialogStates.deletingMembers[teamId]) {
    dialogStates.deletingMembers[teamId] = {}
  }
  dialogStates.deletingMembers[teamId][memberId] = true
}

const closeMemberDeleteDialog = (teamId: number, memberId: string) => {
  if (dialogStates.deletingMembers[teamId]) {
    dialogStates.deletingMembers[teamId][memberId] = false
  }
}

const teamTitle = ref<string>('')
const teamDescription = ref<string>('')

const clearTeamVariables = () => {
  teamTitle.value = ''
  teamDescription.value = ''
}

const loadMembersDataByLeaderId = async (teamId: number, memberIds: string[]) => {
  try {
    const membersPromises = memberIds.map(id => 
      instance.get<IUser>(`user/${id}`)
    );
    const membersResponses = await Promise.all(membersPromises);
    teamsByLeaderIdMembers.value[teamId] = membersResponses.map(r => r.data);

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

const loadMemberData = async (teamId: number, memberId: number) => {
    try {
    await loadAvatar(memberId)

    teamsByLeaderIdMembers.value[teamId]?.push((await instance.get<IUser>(`user/${memberId}`)).data)
    }
    catch (error: any) {
      console.log(error.message)
    }
  }

const sendTeamCreatingRequest = async () => {
    try {
      await instance.post('create-team-request', {title: teamTitle.value, description: teamDescription.value})
      toast.success('Заявка отправлена')
      teamIsCreating.value = false
      isDeleting.value = false
    }
    catch (error: any) {
      toast.error(error.message)
    }
  }

  const rejectRequestToTeam = async (requestId: number, teamId: number) => {
  try{
    await instance.patch(`team-request/${requestId}`, {status: 'rejected'})

    requestsToTeam.value = requestsToTeam.value.filter(req => req.id != requestId)

    if (requestsToTeam.value.filter(req => req.teamId === teamId).length === 0) {
      dialogStates.showingRequests[teamId] = false
    }

    toast.success('Заявка отклонена')
  }
  catch (error: any) {
    toast.error(error.message)
  }
}

const approveRequestToTeam = async (requestId: number, teamId: number, memberId: number) => {
  try {
    await instance.patch(`team-request/${requestId}`, {status: 'approved'})

    requestsToTeam.value = requestsToTeam.value.filter(req => req.id != requestId)

    await loadMemberData(teamId, memberId)

    if (requestsToTeam.value.filter(req => req.teamId === teamId).length === 0) {
      dialogStates.showingRequests[teamId] = false
    }

    toast.success('Заявка одобрена')
  }
  catch (error: any) {
    toast.error(error.message)
  }
}

const changeTeamPrivacy = async (teamId: number, teamStastus: string) => {
  try {
    if (teamStastus == 'close') {
      await instance.patch(`teams/open/${teamId}`)
      toast.success('Команда открыта')

      const teamIndex = teamsByLeaderId.value.findIndex(team => team.id === teamId);
      if (teamIndex !== -1) {
        teamsByLeaderId.value[teamIndex]!.status = 'open'; 
      }
    }
    else if (teamStastus == 'open') {
      await instance.patch(`teams/close/${teamId}`)
      toast.success('Команда закрыта')
      const teamIndex = teamsByLeaderId.value.findIndex(team => team.id === teamId);
      if (teamIndex !== -1) {
        teamsByLeaderId.value[teamIndex]!.status = 'close'; 
      }
    }
  }
  catch (error: any) {
    toast.error(error.message)
  }
}

const deleteMemberFromTeam = async (teamId: string, memberId: string) => {
    try {
      await instance.delete(`teams/${teamId}/members/${memberId}`)
      closeMemberDeleteDialog(Number(teamId), memberId)
      teamsByLeaderIdMembers.value[teamId] = teamsByLeaderIdMembers.value[teamId]!.filter(req => req.id != Number(memberId))
      toast.success('участник исключен')
    }
    catch (error: any) {
      toast.error(error.message)
    }
  }

const editTeam = (currentTeamTitle: string, currentTeamDescription: string, teamId: number) => {
  dialogStates.editingTeams[teamId] = true
  teamTitle.value = currentTeamTitle
  teamDescription.value = currentTeamDescription
}

const saveTeamChanges = async (teamId: number) => {
    try {
      await instance.patch(`teams/${teamId}`, {title: teamTitle.value, description: teamDescription.value})
      toast.success('Информация о команде изменена')
      const teamIndex = teamsByLeaderId.value.findIndex(team => team.id === teamId);
      if (teamIndex !== -1) {
        teamsByLeaderId.value[teamIndex]!.title = teamTitle.value
        teamsByLeaderId.value[teamIndex]!.description = teamDescription.value
      }
      dialogStates.editingTeams[teamId] = false
    }
    catch (error: any) {
      toast.error(error.message)
    }
  }

  const deleteTeam = async (teamId: string) => {
    try {
      await instance.delete(`teams/${teamId}`)
      teamsByLeaderId.value = teamsByLeaderId.value.filter(req => req.id != Number(teamId))
    }
    catch (error: any) {
      toast.error(error.message)
    }
  }

  const props = defineProps<{
  isTeamDeleteDialogOpen: boolean
}>();

const emit = defineEmits(['update:isTeamDeleteDialogOpen']);

// Computed для двустороннего связывания
const isDeleting = computed({
  get: () => props.isTeamDeleteDialogOpen,
  set: (value) => emit('update:isTeamDeleteDialogOpen', value)
});

const scrollToRequest = async () => {
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
  await scrollToRequest()
})

onMounted(async () => {
    teamsByLeaderId.value = (await instance.get('teams')).data
     requestsToTeam.value = (await instance.get('team-request/leader')).data

    await Promise.all(
      teamsByLeaderId.value.map(async team => {
        teamStacks.value[team.id] = await TeamService.loadStack(team.id)
        if (team.currentProjectId) {
          givenProjects.value.push((await instance.get(`project/${team.currentProjectId}`)).data)
        }
      })
    )

     requestsToTeam.value.forEach(request => {
      loadAvatar(request.userId).catch(error => console.error('Error loading request avatars:', error));
     })

     teamsByLeaderId.value.forEach(team => {
      loadMembersDataByLeaderId(team.id, team.members).catch(error => console.error('Error loading members:', error));
     }
     
  )

  await scrollToRequest()

})

onUnmounted(() => {
  Object.entries(memberAvatars.value).forEach(([url]) => {
    if (url && typeof url === 'string') {
      URL.revokeObjectURL(url);
    }
  });
});

</script>