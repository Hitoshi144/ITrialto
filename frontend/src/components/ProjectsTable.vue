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
    <pre>{{ projects }}</pre>
    <pre>{{ rialtos }}</pre>
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
</style>

<script setup lang="ts">
  /* eslint-disable @typescript-eslint/no-explicit-any */
import { instance } from 'src/api/axios.api';
import type { IProjects, IRialto } from 'src/types/types';
import { computed, onMounted, ref } from 'vue';


 const projects = ref<IProjects[]>([])
 const rialtos = ref<IRialto[]>([])

 const currentRialtoId = ref<number>(2)

 const changeRialto = ref<boolean>(false)

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

 onMounted (async () => {
  try {
    const [projectsResponse, rialtosResponse] = await Promise.all([
      instance.get<IProjects[]>('project'),
      instance.get<IRialto[]>('rialto')
    ]);
    
    projects.value = projectsResponse.data;
    rialtos.value = rialtosResponse.data;
  }
  catch (error: any) {
    console.error(error.message)
  }
 })

</script>