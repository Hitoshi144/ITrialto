<template>
    <div class="container">
    <div class="current-rialto beautiful-bg" @click="changeRialto = true">
      <q-badge color="primary" text-color="secondary" class="rialto-announcement">
        текущая биржа
      </q-badge>
      <transition name="fade" mode="out-in">
        <p :key="currentRialtoKey" class="rialto-title">
          {{ currentRialto?.title || 'биржа не найдена' }}
        </p>
      </transition>
    </div>
    <q-dialog v-model="changeRialto" backdrop-filter="blur(4px)" transition-show="fade" transition-hide="fade">
      <q-card flat bordered class="change-rialto-card">
      
        <div style="display: flex; flex-direction: column; align-items: center;">
        <q-card-section>
          <p class="select-rialto-title">Выберите биржу</p>
        </q-card-section>

        <q-card-section v-for="rialto in rialtos" :key="rialto.id">
          <q-btn outline color="primary" :label="rialto.title" class="select-rialto-btn" @click="selectRialto(rialto.id)" />
        </q-card-section>
        </div>

      </q-card>
    </q-dialog>
    
    <div class="projects">
      <q-intersection once v-for="project in filteredProjects" :key="project.id" transition="scale">

        <q-card flat bordered class="project-card">

          <q-card-section>
          <p class="project-title" @click="openProjectPanel(project)">{{ project.title }}</p>
          <p class="project-description">{{ project.solution }}</p>
          <p class="project-initiator">Инициатор: {{ initiators[project.id]?.firstname }} {{ initiators[project.id]?.lastname }}</p>

          <div class="project-stack">
          <div class="stack-card" v-for="stack in AuthService.parseStack(project.stack)" :key="stack">
            <p>{{ stack }}</p>
          </div>
          </div>

          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="project-footer">
          <div class="status-border" :style="{ borderColor: statusColors[project.status as keyof typeof statusColors]}">
            <div class="dot"
            :style="{ backgroundColor: statusColors[project.status as keyof typeof statusColors]}"
            ></div>
            <p :style="{ color: statusColors[project.status as keyof typeof statusColors]}">{{ statusInterp[project.status as keyof typeof statusInterp] }}</p>
          </div>
          <div v-if="project.maxPeopleNumber" style="display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center; gap: 5px;">
            <q-icon name="groups" color="primary" size="18px" />
            <p class="project-footer-description">Команда до {{ project.maxPeopleNumber }} {{ maxPeopleNumberWord(project.maxPeopleNumber) }}</p>
            </div>
          <div style="display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center; gap: 5px;">
            <q-icon name="mail" color="primary" size="18px" />
            <p class="project-footer-description">Подано заявок: {{ projectRequests[project.id] }}</p>
            </div>
          </div>
          </q-card-section>

        </q-card>

      </q-intersection>
    </div>

    <div class="project-panel" :class="{ 'panel-open': isProjectPanelOpen }">
      <div class="panel-content">
        <transition name="fade" mode="out-in">
      <div v-if="selectedProject" :key="selectedProject.id">

      <div style="display: flex; flex-direction: row; align-items: center;">
        <q-btn 
          round 
          flat 
          icon="chevron_right" 
          class="close-btn" 
          color="secondary"
          @click="closeProjectPanel"
        />
          <h2 class="project-title-panel">{{ selectedProject.title }}</h2>
        </div>

        <div class="status-border side-panel-status-border" :style="{ borderColor: statusColors[selectedProject.status as keyof typeof statusColors]}">
            <div class="dot"
            :style="{ backgroundColor: statusColors[selectedProject.status as keyof typeof statusColors]}"
            ></div>
            <p :style="{ color: statusColors[selectedProject.status as keyof typeof statusColors]}">{{ statusInterp[selectedProject.status as keyof typeof statusInterp] }}</p>
          </div>

        <q-card flat class="project-info">
          <q-card-section>
            <p class="info-text"><span>Заказчик:</span> {{ selectedProject.customer }}</p>
            <p class="info-text"><span>Инициатор:</span> {{ initiators[selectedProject.id]?.firstname }} {{ initiators[selectedProject.id]?.lastname }}</p>
            <p class="info-text"><span>Статус:</span> Набор {{ recruitmentInterp[selectedProject.recruitment as keyof typeof recruitmentInterp] }}</p>
            <p class="info-text"><span>Дата создания:</span> {{ formatDateToRussianShort(selectedProject.createdAt) }}</p>
          </q-card-section>
        </q-card>

        <q-card flat class="project-info">
          <q-card-section class="info-text-2" style="font-size: 16px;">
            <span>Проблема</span>
            <p>{{ selectedProject.problem }}</p>
          </q-card-section>
          <q-separator color="secondary" />
          <q-card-section class="info-text-2" style="font-size: 16px;">
            <span>Предлагаемое решение</span>
            <p>{{ selectedProject.solution }}</p>
          </q-card-section>
          <q-separator color="secondary" />
          <q-card-section class="info-text-2" style="font-size: 16px;">
            <span>Ожидаемый результат</span>
            <p>{{ selectedProject.expectedResult }}</p>
          </q-card-section>
          <q-separator color="secondary" />
          <q-card-section class="info-text-2" style="font-size: 16px;">
            <span>Стек</span>
            <div class="project-stack">
            <p v-for="stack in AuthService.parseStack(selectedProject.stack)" :key="stack" class="stack-card" style="color: #E0EEF8;">{{ stack }}</p>
            </div>
          </q-card-section>
        </q-card>

        <transition name="slide-down" mode="out-in">
        <div v-if="teamSelecting">
          <p class="info-text" style="margin-top: 10px;">Выберите команду</p>
          <q-select filled clearable v-model="selectedTeam" :options="userTeams" option-label="title" :rules="[val => !!val || '']" />
        </div>
        </transition>
        <q-btn v-if="selectedProject.status === 'published'" :filled="teamSelecting ? false: true" :outline="teamSelecting ? true : false" color="primary" label="Подать заявку" class="send-request" @click="teamSelecting ? sendRequest(selectedProject.id, selectedTeam!.id) : teamSelecting = true" :disable="teamSelecting === true && selectedTeam === null" />
        <transition name="fade" mode="out-in">
        <q-btn filled label="отмена" color="primary" class="send-request" @click="teamSelecting = false" v-if="teamSelecting" />
        </transition>

        </div>
        </transition>
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

  /* Анимация slide-down */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

  .current-rialto {
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

  .current-rialto:hover {
    box-shadow: 0 0 15px rgba(65, 120, 156, 0.3);
    background: rgba(224, 238, 248, 0.3);
    backdrop-filter: blur(5px);
  }

  .rialto-announcement {
    width: 20vw;
    min-width: 150px;
    font-size: 16px;
    border-radius: 5px;
    justify-content: center;
  }

  .rialto-title {
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

  .change-rialto-card {
    width: 75vw;
    border-radius: 15px;
  }

  .select-rialto-btn {
    font-size: 16px;
    width: 65vw;
    max-width: 525px;
    border-radius: 10px;
  }

  .info-text {
    color: #41789C;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    margin-bottom: 5px;

    span {
      opacity: 70%;
    }
  }

  .info-text-2 {
    color: #41789C;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    margin-bottom: 5px;

    span {
      opacity: 70%;
      margin-left: 10px;
    }
  }

  .select-rialto-title {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #41789C;
    font-size: 28px;
    font-weight: 400;
  }

  .send-request {
    border-radius: 10px;
    margin-top: 20px;
    margin-left: 5px;
  }

  .projects {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Минимум 300px, максимум 1fr */
    gap: 20px; /* Отступ между карточками */
    width: 80vw;
    max-width: 1200px; /* Ограничиваем максимальную ширину */
    margin-top: 20px;
    padding: 10px;
    justify-content: center;
  }

  .project-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    border-radius: 10px;
  }

  .project-title {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 24px;
    font-weight: 500;
    color: #41789C;
  }

  .project-title:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  .project-description {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    opacity: 70%;
    font-size: 16px;
    display: -webkit-box;
    line-clamp: 3;
    -webkit-line-clamp: 3;    /* Макс. количество строк */
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .project-stack {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .project-initiator {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
  }

  .stack-card {
    margin-right: 5px;
    padding: 4px;
    background-color: #41789C;
    border-radius: 10px;
    margin-bottom: 5px;

    p {
      margin: 0;
      color: #E0EEF8;
    }
  }

  .project-footer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
  }

  .project-footer-description {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #41789C;
    margin: 0;
    font-size: 15px;
  }

  .dot {
    width: 9px;
    height: 9px;
    margin: 5px;
    border-radius: 100%;
  }

  .status-border {
    display: flex;
    align-items: center;
    width:fit-content;
    padding: 2px;
    border: 1px solid;
    border-radius: 15px;

    p {
      margin: 0;
      margin-right: 5px;
    }
  }

  .side-panel-status-border {
    justify-self: center;
    margin: 10px;
  }

  .project-panel {
  position: fixed;
  top: 0;
  right: -45%;
  width: 45%;
  height: 100vh;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  backdrop-filter: blur(7px);
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  border: 1px solid rgba(65, 120, 156, 0.5);
  z-index: 1000;
  border-radius: 10px 0 0 10px;
  overflow-y: auto;
}

.project-info {
  margin-top: 10px;
}

 @media screen and (max-width: 767px) {
  .project-panel {
    width: 75%;
  }
 }

.panel-open {
  right: 0;
}

.panel-content {
  padding: 10px;
  position: relative;
}

.close-btn {
  background-color: rgba(65, 120, 156, 0.7);
  z-index: 1010;
  height: 20px;
  border-radius: 10px;
}

.project-title-panel {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 32px;
  margin: 0;
  margin-left: 10px;
  background-color: rgba(224, 238, 248, 0.8);
  padding: 5px;
  border-radius: 7px;
  color: #41789C;
  font-weight: 400;
  width: 100%;
  text-align: center;
}

/* Затемнение основного контента при открытой панели */
.container::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 999;
}

.panel-open + .container::after {
  opacity: 1;
  pointer-events: auto;
}
</style>

<script setup lang="ts">
  /* eslint-disable @typescript-eslint/no-explicit-any */
import { instance } from 'src/api/axios.api';
import { AuthService } from 'src/services/auth.service';
import type { IProjects, IRialto, ITeam, IUser } from 'src/types/types';
import { computed, onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';


 const projects = ref<IProjects[]>([])
 const rialtos = ref<IRialto[]>([])


 const currentRialtoId = ref<number>(2)

 const selectedTeam = ref<ITeam | null>(null)

 const userTeams = ref<ITeam[]>([])

 const isProjectPanelOpen = ref(false)
 const selectedProject = ref<IProjects | null>(null)

 const teamSelecting = ref<boolean>(false)

 const openProjectPanel = (project: IProjects) => {
  selectedProject.value = project;
  isProjectPanelOpen.value = true;
};

const closeProjectPanel = () => {
  isProjectPanelOpen.value = false;
  // Небольшая задержка перед очисткой, чтобы анимация закрытия завершилась
  setTimeout(() => {
    selectedProject.value = null;
  }, 300);
};

function formatDateToRussianShort(isoDateString: string): string {
  const date = new Date(isoDateString);
  
  const day = date.getDate();
  const month = date.getMonth() + 1; // Месяцы начинаются с 0
  const year = date.getFullYear();
  
  // Добавляем ведущий ноль для дней и месяцев меньше 10
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;
  
  return `${formattedDay}.${formattedMonth}.${year}`;
}

// Пример использования:
const isoDate = "2025-04-22T11:38:42.410Z";
console.log(formatDateToRussianShort(isoDate));

 const changeRialto = ref<boolean>(false)

 const initiators = ref<Record<string, IUser>>({})

 const projectRequests = ref<Record<number, number | null>>({})

 const statusColors = {
  'pending': '#5C6BC0',
  'published': '#43A047',
  'in_progress': '#FB8C00',
  'revision': '#8E24AA',
  'completed': '#039BE5'
 }

 const maxPeopleNumberWord = (peopleNumber: string) => {
  const peopleNumberInt = Number(peopleNumber)
  if (peopleNumberInt % 10 === 1) {
    return 'человека'
  }
  else {
    return 'человек'
  }
 }

 const currentRialtoKey = computed(() => {
  return currentRialto.value?.id || 'not-found';
})

 const currentRialto = computed<IRialto | undefined>(() => {
  return rialtos.value.find(rialto => rialto.id === currentRialtoId.value)
 })

 const selectRialto = (rialtoId: number) => {
  currentRialtoId.value = rialtoId
  changeRialto.value = false
 }

 const recruitmentInterp = {
  'open': 'открыт',
  'close': 'закрыт'
 }

 const statusInterp = {
  'pending': 'На рассмотрении',
  'published': 'Опубликован',
  'in_progress': 'В работе',
  'revision': 'На доработке',
  'completed': 'Выполнен',
 }

 const filteredProjects = computed(() => {
  return projects.value.filter(project => project.rialtoId === currentRialtoId.value);
});

 const loadInitiatorData = async (projectId: number, initiatorId: number) => {
  try {
    const response = await instance.get<IUser>(`user/${initiatorId}`)
    initiators.value[projectId] = response.data
  }
  catch (error: any) {
    console.log(error)
  }
 }

 const loadRequestsCount = async (projectId: number) => {
  try {
    const response = await instance.get(`project-request/project/${projectId}`)

    projectRequests.value[projectId] = response.data.length
  }
  catch (error) {
    console.log(error)
  }
 }

 const sendRequest = async (projectId: number, teamId: number) => {
  try {
    await instance.post('project-request', {projectId, teamId})
    teamSelecting.value = false
    projectRequests.value[projectId] = (projectRequests.value[projectId] || 0) + 1
    toast.success('Заявка подана')
  }
  catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
    toast.error(errorMessage);
  }
 }

 onMounted (async () => {
  try {
    const [projectsResponse, rialtosResponse, teamsResponse] = await Promise.all([
      instance.get<IProjects[]>('project'),
      instance.get<IRialto[]>('rialto'),
      instance.get<ITeam[]>('teams')
    ]);
    
    projects.value = projectsResponse.data;
    rialtos.value = rialtosResponse.data;
    userTeams.value = teamsResponse.data

    projects.value.forEach(project => {
      loadInitiatorData(project.id, project.userId).catch(error => console.error(error))
    })

    projects.value.forEach(project => {
      loadRequestsCount(project.id).catch(error => console.error(error))
    })
  }
  catch (error: any) {
    console.error(error.message)
  }
 })

</script>