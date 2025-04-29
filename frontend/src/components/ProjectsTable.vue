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
          <p class="project-title">{{ project.title }}</p>
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

  .select-rialto-title {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #41789C;
    font-size: 28px;
    font-weight: 400;
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
</style>

<script setup lang="ts">
  /* eslint-disable @typescript-eslint/no-explicit-any */
import { instance } from 'src/api/axios.api';
import { AuthService } from 'src/services/auth.service';
import type { IProjects, IRialto, IUser } from 'src/types/types';
import { computed, onMounted, ref } from 'vue';


 const projects = ref<IProjects[]>([])
 const rialtos = ref<IRialto[]>([])

 const currentRialtoId = ref<number>(2)

 const changeRialto = ref<boolean>(false)

 const initiators = ref<Record<string, IUser>>({})

 const projectRequests = ref<Record<string, string | null>>({})

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

 onMounted (async () => {
  try {
    const [projectsResponse, rialtosResponse] = await Promise.all([
      instance.get<IProjects[]>('project'),
      instance.get<IRialto[]>('rialto')
    ]);
    
    projects.value = projectsResponse.data;
    rialtos.value = rialtosResponse.data;

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