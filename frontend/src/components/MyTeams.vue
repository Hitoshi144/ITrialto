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
            <p class="i-member-teams-title">Команд: {{ teamsByMemberId.length }}</p>
            <div v-for="team in teamsByMemberId" :key="team.id">
                <q-separator />
                <div>
                <p class="team-title">{{ team.title }}</p>
                </div>
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
                  <q-btn filled color="primary" label="подать заявку" @click="sendTeamCreatingRequest()" />
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>

            <div v-for="team in teamsByLeaderId" :key="team.id">
                <q-separator />
                <div class="teams-header" style="align-items: center;">
                <p class="team-title">{{ team.title }}</p>
                <q-btn outline color="primary" :label="requestsToTeam.filter(req => req.teamId === team.id).length + ' ' + requestWordInterpretation(requestsToTeam.filter(req => req.teamId === team.id).length) + ' в команду'" style="height: 20px; border-radius: 10px;" @click="showRequestToTeam = true"  :disable="requestsToTeam.filter(req => req.teamId === team.id).length != 0 ? false : true" />

                  <q-dialog v-model="showRequestToTeam" backdrop-filter="blur(4px)" transition-show="fade" transition-hide="fade">
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
                      <q-btn filled color="primary" label="исключить" size="10px" style="border-radius: 10px; margin-top: 5px;" @click="memberIsDeleting = true" />

                      <q-dialog v-model="memberIsDeleting" backdrop-filter="blur(4px)" transition-show="fade" transition-hide="fade">
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
                              <q-btn filled color="primary" style="border-radius: 10px; margin-right: 20px;" label="Нет, не исключать" @click="memberIsDeleting = false" />
                            </div>
                          </q-card-section>
                        </q-card>
                      </q-dialog>

                    </div>
                    </div>
                </div>
                <div class="teamControlButtons">
                  <q-btn outline color="primary" label="изменить" style="margin-right: 10px; border-radius: 10px; margin-bottom: 20px;" icon="edit" @click="editTeam(team.title, team.description)" />

                  <q-dialog v-model="teamIsEditing" backdrop-filter="blur(4px)" transition-show="fade" transition-hide="fade" @before-hide="clearTeamVariables()">
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

                  <q-btn filled color="primary" label="удалить" style="border-radius: 10px; margin-bottom: 20px;" icon-right="delete_forever" @click="teamIsDeleting = true" />

                  <q-dialog v-model="teamIsDeleting" backdrop-filter="blur(4px)" transition-show="fade" transition-hide="fade">
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
                          <q-btn filled color="primary" style="border-radius: 10px; margin-right: 20px;" label="Нет, не удалять" @click="teamIsDeleting = false" />
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-dialog>

                </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="createTeamRequests">
            <p class="i-member-teams-title">Заявок на рассмотрении: {{ createTeamRequests.length }}</p>
            <div v-for="request in createTeamRequests" :key="request.id">
              <q-separator />
              <p class="team-description" style="margin-top: 20px;"><strong>Название:</strong> {{ request.title }}</p>
              <p class="team-description" style="margin-top: 15px;"><strong>Описание:</strong> {{ request.description }}</p>
              <q-btn outline label="удалить заявку" style="border-radius: 10px; margin-top: 15px; display: flex; justify-self: flex-end;" color="primary" icon="delete_forever" @click="createTeamReqDeleting = true" />

              <q-dialog v-model="createTeamReqDeleting" backdrop-filter="blur(4px)" transition-show="fade" transition-hide="fade">
                <q-card flat bordered class="team-edit-card" style="border-radius: 15px;">
                  <q-card-section>
                    <div style="display: flex; justify-content: space-between; flex-direction: row;">
                          <p class="text-h5" style="color: #41789C;">Удаление заявки</p>
                          <q-btn flat color="primary" rounded icon="close" v-close-popup />
                        </div>
                  </q-card-section>
                  <q-card-section>
                    <p class="text-h6" style="color: #41789C; margin-left: 30px;">Вы уверены, что хотите удалить заявку на создание команды?</p>
                  </q-card-section>
                  <q-card-section>
                    <div style="display: flex; flex-direction: row; justify-content: space-between;">
                          <q-btn outline color="negative" style="border-radius: 10px; margin-left: 20px;" label="Да, удалить" @click="deleteCreateTeamReq(request.id)" />
                          <q-btn filled color="primary" style="border-radius: 10px; margin-right: 20px;" label="Нет, не удалять" @click="createTeamReqDeleting = false" />
                        </div>
                  </q-card-section>
                </q-card>
              </q-dialog>
            
            </div>
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
    justify-self: flex-start;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: #E0EEF8;
    max-width: 70%;
    padding: 15px;
    border-radius: 15px;
    border: 1px solid rgba(141, 183, 202, 0.342);
  }

  .team-title {
    margin: 15px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 24px;
    font-weight: 500;
    color: #41789C;
  }

  .team-description {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin: 0;
    font-size: 16px;
    color: #41789C;
    font-weight: 400;
    word-wrap: break-word;
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

  .teamControlButtons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .team-edit-card {
    width: 75vw;
  }

  .teams-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  @media screen and (max-width: 700px) {
    .team-info {
        flex-direction: column;
        .about-team {
            margin-left: 0;
        }
    }

    .teams-header {
      flex-direction: column;
    }
  }
  </style>
  
  <script setup lang="ts">
  /* eslint-disable @typescript-eslint/no-explicit-any */
import { instance } from 'src/api/axios.api';
import { AuthService } from 'src/services/auth.service';
import { useUserStore } from 'src/store';
import type { ICreateTeamRequest, ITeam, ITeamRequests, IUser } from 'src/types/types';
import { onMounted, onUnmounted, ref } from 'vue';
import { toast } from 'vue3-toastify';

  
  const tab = ref<string>('iMember');

  const user = useUserStore().getUser

  const teamsByMemberId = ref<ITeam[]>([])
  const teamsByLeaderId = ref<ITeam[]>([])
  const teamsByMemberIdMembers = ref<Record<string, IUser[]>>({})
  const teamsByMemberIdLeaders = ref<Record<string, IUser>>({})
  const teamsByLeaderIdMembers = ref<Record<string, IUser[]>>({})
  const createTeamRequests = ref<ICreateTeamRequest[]>([])

  const requestsToTeam = ref<ITeamRequests[]>([])

  const memberAvatars = ref<Record<string, string>>({})


  const teamIsEditing = ref<boolean>(false)
  const teamTitle = ref<string>('')
  const teamDescription = ref<string>('')

  const teamIsCreating = ref<boolean>(false)
  const teamIsDeleting = ref<boolean>(false)
  const memberIsDeleting = ref<boolean>(false)
  const showRequestToTeam = ref<boolean>(false)
  const createTeamReqDeleting = ref<boolean>(false)

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

  const loadMemberData = async (teamId: number, memberId: number) => {
    try {
    await loadAvatar(memberId)

    teamsByLeaderIdMembers.value[teamId]?.push((await instance.get<IUser>(`user/${memberId}`)).data)
    }
    catch (error: any) {
      console.log(error.message)
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

  const privacyInterpretation: Record<string, string> = {
  close: "Закрыта",
  open: "Открыта"
};

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

  const editTeam = (currentTeamTitle: string, currentTeamDescription: string) => {
    teamIsEditing.value = true
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
      teamIsEditing.value = false
    }
    catch (error: any) {
      toast.error(error.message)
    }
  }

  const sendTeamCreatingRequest = async () => {
    try {
      await instance.post('create-team-request', {title: teamTitle.value, description: teamDescription.value})
      toast.success('Заявка отправлена')
      teamIsCreating.value = false
    }
    catch (error: any) {
      toast.error(error.message)
    }
  }

  const deleteTeam = async (teamId: string) => {
    try {
      await instance.delete(`teams/${teamId}`)
      teamsByMemberId.value = teamsByLeaderId.value.filter(req => req.id != Number(teamId))
    }
    catch (error: any) {
      toast.error(error.message)
    }
  }

  const deleteMemberFromTeam = async (teamId: string, memberId: string) => {
    try {
      await instance.delete(`teams/${teamId}/members/${memberId}`)
      memberIsDeleting.value = false
      teamsByLeaderIdMembers.value[teamId] = teamsByLeaderIdMembers.value[teamId]!.filter(req => req.id != Number(memberId))
      toast.success('участник исключен')
    }
    catch (error: any) {
      toast.error(error.message)
    }
  }

  const dateInterpretation = (date: string) => {
  const tempCreatedAt = new Date(date);
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(tempCreatedAt.getDate())}.${pad(tempCreatedAt.getMonth() + 1)}.${tempCreatedAt.getFullYear()}`;
};

const requestWordInterpretation = (requestsCount: number) =>{
  if (requestsCount === 1) {
    return 'заявка'
  }
  else if (requestsCount > 1 && requestsCount < 5) {
    return 'заявки'
  }
  else {
    return 'заявок'
  }
}

const rejectRequestToTeam = async (requestId: number, teamId: number) => {
  try{
    await instance.patch(`team-request/${requestId}`, {status: 'rejected'})

    requestsToTeam.value = requestsToTeam.value.filter(req => req.id != requestId)

    if (requestsToTeam.value.filter(req => req.teamId === teamId).length === 0) {
      showRequestToTeam.value = false
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
      showRequestToTeam.value = false
    }

    toast.success('Заявка одобрена')
  }
  catch (error: any) {
    toast.error(error.message)
  }
}

 const deleteCreateTeamReq = async (requestId: number) => {
  try {
    await instance.delete(`create-team-request/${requestId}`)

    createTeamRequests.value = createTeamRequests.value.filter(req => req.id != requestId)
    toast.success('Заявка удалена')
  }
  catch (error: any) {
    console.log(error.message)
  }
 }

const clearTeamVariables = () => {
  teamTitle.value = ''
  teamDescription.value = ''
}

  onMounted(async () => {
     teamsByMemberId.value = (await instance.get(`teams/member/${user?.id}`)).data
     teamsByLeaderId.value = (await instance.get('teams')).data
     requestsToTeam.value = (await instance.get('team-request/leader')).data
     createTeamRequests.value = (await instance.get('create-team-request/my')).data

     teamsByMemberId.value.forEach(team => {
     loadMembersData(team.id, team.members).catch(error => console.error('Error loading members:', error));

     teamsByMemberId.value.forEach(team => {
      loadTeamLeaderData(team.id, team.teamLeaderId).catch(error => console.error('Error loading leaders:', error));
     })

     teamsByLeaderId.value.forEach(team => {
      loadMembersDataByLeaderId(team.id, team.members).catch(error => console.error('Error loading members:', error));

     requestsToTeam.value.forEach(request => {
      loadAvatar(request.userId).catch(error => console.error('Error loading request avatars:', error));
     })
  });
  })}
)

onUnmounted(() => {
  Object.entries(memberAvatars.value).forEach(([url]) => {
    if (url && typeof url === 'string') {
      URL.revokeObjectURL(url);
    }
  });
});
  </script>