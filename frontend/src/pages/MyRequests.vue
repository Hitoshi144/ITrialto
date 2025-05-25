<template>
<div class="container">
    <div class="current-requests-category beautiful-bg" @click="changeRequestCategory = true">
      <q-badge color="primary" text-color="secondary" class="requests-announcement">
        Заявки на
      </q-badge>
      <transition name="fade" mode="out-in">
        <p :key="tab" class="requests-title">
          {{ requestsCategoryInterpretation[tab as keyof typeof requestsCategoryInterpretation] }}
        </p>
      </transition>
    </div>
    <q-dialog v-model="changeRequestCategory" backdrop-filter="blur(4px)" transition-show="fade" transition-hide="fade">
      <q-card flat bordered class="change-category-card">
      
        <div style="display: flex; flex-direction: column; align-items: center;">
        <q-card-section>
          <p class="select-category-title">Выберите биржу</p>
        </q-card-section>

        <q-card-section v-for="category in tabs" :key="category">
          <q-btn outline color="primary" :label="requestsCategoryInterpretation[category as keyof typeof requestsCategoryInterpretation]" class="select-category-btn" @click="tab = category; changeRequestCategory = false" />
        </q-card-section>
        </div>

      </q-card>
    </q-dialog>

    <div class="requests-window beautiful-bg-2">

      <transition name="fade" mode="out-in">

        <div v-if="tab === 'create-team'">
          <div class="request-line invisible-scroll">
            <div style="display: flex; gap: 5px;">
            <p class="index text"></p>
            <p class="title text">Название</p>
            </div>
            <p class="description text">Описание команды</p>
            <p class="status text">статус заявки</p>
            <p class="btn-width"></p>
          </div>
          <q-separator color="primary" />

          <div class="intersection">
          <q-infinite-scroll >  
          <div  v-for="request in createTeamRequests" :key="request.id">
              <div class="request-line">
                <div style="display: flex; gap: 5px;">
                <p class="index text">{{ createTeamRequests.indexOf(request) + 1 }}</p>
                    <p class="title text">{{ request.title }}</p>
                    </div>
                    <p class="description text">{{ request.description }}</p>
                    <p class="status text">{{ statusInterpretation[request.status as keyof typeof statusInterpretation] }}</p>
                    <button v-if="request.status === 'pending'" class="btn btn-2 hover-opacity">
                      <span>к заявке <q-icon name="north_east" size="16px" /></span>
                    </button>
                    <div v-else class="btn-width-inner"></div>
            </div>
            <q-separator color="primary" />
            </div>
            </q-infinite-scroll>
            </div>
        </div>

        <div v-else-if="tab === 'to-team'">
          <div class="request-line invisible-scroll">
            <div style="display: flex; gap: 5px;">
            <p class="index text"></p>
            <p class="title text">Название</p>
            </div>
            <p class="description text">Описание команды</p>
            <p class="status text">статус заявки</p>
            <p class="btn-width"></p>
          </div>
          <q-separator color="primary" />

          <div class="intersection">
          <q-infinite-scroll >  
          <div  v-for="request in toTeamRequests" :key="request.id">
              <div class="request-line">
                <div style="display: flex; gap: 5px;">
                <p class="index text">{{ toTeamRequests.indexOf(request) + 1 }}</p>
                    <p class="title text">{{ teams.find(team => team.id === request.teamId)?.title }}</p>
                    </div>
                    <p class="description text">{{ teams.find(team => team.id === request.teamId)?.description }}</p>
                    <p class="status text">{{ statusInterpretation[request.status as keyof typeof statusInterpretation] }}</p>
                    <button v-if="request.status === 'pending'" class="btn btn-2 hover-opacity">
                      <span>удалить <q-icon name="cancel" size="16px" /></span>
                    </button>
                    <div v-else class="btn-width-inner"></div>
            </div>
            <q-separator color="primary" />
            </div>
            </q-infinite-scroll>
            </div>
        </div>

        <div v-else-if="tab === 'create-project'">
          <div class="request-line invisible-scroll">
            <div style="display: flex; gap: 5px;">
            <p class="index text"></p>
            <p class="title text">Название</p>
            </div>
            <p class="description text">Биржа</p>
            <p class="customer text">Заказчик</p>
            <p class="status text">статус заявки</p>
            <p class="btn-width"></p>
          </div>
          <q-separator color="primary" />

          <div class="intersection">
          <q-infinite-scroll >  
          <div  v-for="request in createProjectRequests" :key="request.id">
              <div class="request-line">
                <div style="display: flex; gap: 5px;">
                <p class="index text">{{ createProjectRequests.indexOf(request) + 1 }}</p>
                    <p class="title text">{{ request.title }}</p>
                    </div>
                    <p class="description text">{{ rialtos.find(rialto => rialto.id === request.rialtoId)?.title }}</p>
                    <p class="customer text">{{ request.customer }}</p>
                    <p class="status text">{{ statusInterpretation[request.status as keyof typeof statusInterpretation] }}</p>
                    <button v-if="request.status === 'pending'" class="btn btn-2 hover-opacity">
                      <span>К заявке <q-icon name="north_east" size="16px" /></span>
                    </button>
                    <div v-else class="btn-width-inner"></div>
            </div>
            <q-separator color="primary" />
            </div>
            </q-infinite-scroll>
            </div>
        </div>

        <div v-else-if="tab === 'to-project'">
          <div class="request-line invisible-scroll">
            <div style="display: flex; gap: 5px;">
            <p class="index text"></p>
            <p class="title text" style="min-width: 150px;">Команда</p>
            </div>
            <p class="description text">Проект</p>
            <p class="status text">статус заявки</p>
            <p class="btn-width"></p>
          </div>
          <q-separator color="primary" />

          <div class="intersection">
          <q-infinite-scroll >  
          <div  v-for="request in toProjectRequests" :key="request.id">
              <div class="request-line">
                <div style="display: flex; gap: 5px;">
                <p class="index text">{{ toProjectRequests.indexOf(request) + 1 }}</p>
                    <p class="title text" style="min-width: 150px;">{{ teams.find(team => team.id === request.teamId)?.title }}</p>
                    </div>
                    <p class="description text">{{ request.project.title }}</p>
                    <p class="status text">{{ statusInterpretation[request.status as keyof typeof statusInterpretation] }}</p>
                    <button v-if="request.status === 'pending'" class="btn btn-2 hover-opacity">
                      <span>Удалить <q-icon name="cancel" size="16px" /></span>
                    </button>
                    <div v-else class="btn-width-inner"></div>
            </div>
            <q-separator color="primary" />
            </div>
            </q-infinite-scroll>
            </div>
        </div>

        </transition>

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

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .btn {
  position: relative;
  display: inline-block;
  width: auto; height: auto;
  background-color: transparent;
  border: none;
  cursor: pointer;
  min-width: 145px;
  border-radius: 25px;
}
  .btn span {         
    position: relative;
    display: inline-block;
    font-size: 12px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: bold;
    letter-spacing: 1px;
    text-transform: uppercase;
    top: 0; left: 0;
    width: 75%;
    padding: 5px 5px;
    transition: 0.3s;
    border-radius: 25px;
  }

  .btn-2::before {
  background-color: rgb(28, 31, 30);
  transition: 0.1s ease-out;
}
.btn-2 span {
  color: #41789C;
  border: 1px solid #41789C;
  transition: 0.1s;
}  
.btn-2 span:hover {
  color: rgb(255,255,255);
  background-color: #41789C;
  transition: 0.2s;
}

.btn.hover-opacity::before {
  top:0; bottom: 0; right: 0;
  height: 100%; width: 100%;
  opacity: 0;
}
.btn.hover-opacity:hover::before {
  opacity: 1;
}

  .current-requests-category {
    display: flex;
    flex-direction: column;
    border: 2px solid rgba(65, 120, 156, 0.5);
    width: 70vw;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    border-radius: 10px;
    padding: 10px;
    transition: box-shadow 0.3s ease, background 0.3s ease, backdrop-filter 0.3s ease;
  }

  .current-requests-category:hover {
    box-shadow: 0 0 15px rgba(65, 120, 156, 0.3);
    background: rgba(224, 238, 248, 0.3);
    backdrop-filter: blur(5px);
  }

  .requests-title {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 28px;
    font-weight: 500;
    text-align: center;
    color: #41789C;
    margin: 0;
  }

  .beautiful-bg {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    backdrop-filter: blur(2px);
  }

  .beautiful-bg-2 {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    backdrop-filter: blur(5px);
    border: 1px solid rgba(141, 183, 202, 0.342);
  }

  .requests-announcement {
    width: 20vw;
    min-width: 150px;
    font-size: 16px;
    border-radius: 5px;
    justify-content: center;
  }

  .change-category-card {
    width: 75vw;
    border-radius: 15px;
  }

  .select-category-title {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #41789C;
    font-size: 28px;
    font-weight: 400;
  }

  .select-category-btn {
    font-size: 16px;
    width: 65vw;
    max-width: 525px;
    border-radius: 10px;
  }

  .requests-window {
    height: 75vh;
    width: 90vw;
    max-width: 1200px;
    border: 1px solid rgba(65, 120, 156, 0.5);
    margin-top: 20px;
    border-radius: 10px;
  }

  .request-line {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    p {
        margin: 0;
    }
  }

  .index {
    min-width: 30px;
    max-width: 30px;
    border-right: 1px solid #5093c0;
  }

  .title {
    min-width: 100px;
    max-width: 100px;
    border-right: 1px solid #5093c0;
  }

  .description {
    min-width: 100px;
    border-right: 1px solid #5093c0;
  }

  .customer {
    min-width: 100px;
    border-right: 1px solid #5093c0;
  }

  .status {
    min-width: 100px;
    border-right: 1px solid #5093c0;
  }

  .btn-width {
    min-width: 155px;
  }

  .btn-width-inner {
    min-width: 145px;
  }

  .text {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    color: #294a61;
    padding: 5px;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

.intersection {
  max-height: 70vh;
  overflow: scroll;
  overflow-x: hidden;
  scrollbar-width: thin; /* Для Firefox */
  scrollbar-color: #4a4a4a transparent; /* Цвет ползунка и трека */
}

/* Для Chrome, Safari, Edge */
.intersection::-webkit-scrollbar {
  width: 6px; /* Толщина скроллбара */
}

.intersection::-webkit-scrollbar-track {
  background: transparent; /* Прозрачный фон трека */
}

.intersection::-webkit-scrollbar-thumb {
  background: #4a4a4a; /* Цвет ползунка */
  border-radius: 3px; /* Скругление углов */
}

.intersection::-webkit-scrollbar-thumb:hover {
  background: #555; /* Цвет при наведении */
}

</style>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { requestsCategoryInterpretation, statusInterpretation } from 'src/services/interpritation.service';
import type { ICreateTeamRequest, IProjects, IRialto, ITeam, ITeamRequests, IToProjectRequest } from 'src/types/types';
import { instance } from 'src/api/axios.api';
import { useUserStore } from 'src/store';

const user = useUserStore().getUser

const leaderOfTeams = ref<ITeam[]>([])

const tabs = ['create-team', 'to-team', 'create-project', 'to-project']

const tab = ref<string>('create-team')

const changeRequestCategory = ref<boolean>(false)

const createTeamRequests = ref<ICreateTeamRequest[]>([])
const toTeamRequests = ref<ITeamRequests[]>([])
const teams = ref<ITeam[]>([])
const createProjectRequests = ref<IProjects[]>([])
const rialtos = ref<IRialto[]>([])
const toProjectRequests = ref<IToProjectRequest[]>([])

onMounted(async () => {
    createTeamRequests.value = (await instance.get('create-team-request/my/all')).data
    toTeamRequests.value = (await instance.get(`team-request/${user?.id}/all`)).data

    leaderOfTeams.value = (await instance.get('teams')).data

    await Promise.all(
      toTeamRequests.value.map(async request => {
        teams.value.push((await instance.get(`teams/${request.teamId}`)).data)
      })
    )

    createProjectRequests.value = (await instance.get('project/my')).data.filter((project: IProjects) => project.status === 'pending' || project.status === 'published' || project.status === 'rejected')

    await Promise.all(
      createProjectRequests.value.map(async request => {
        if (!rialtos.value.some(rialto => rialto.id === request.rialtoId)) {
          rialtos.value.push((await instance.get(`rialto/${request.rialtoId}`)).data)
        }
      })
    )

    await Promise.all(
      leaderOfTeams.value.map(async team => {
        toProjectRequests.value.push(...(await instance.get(`project-request/my-team/${team.id}`)).data)

        if (!teams.value.some(t => t.id === team.id)) {
          teams.value.push((await instance.get(`teams/${team.id}`)).data)
        }
      })
    )
})
</script>