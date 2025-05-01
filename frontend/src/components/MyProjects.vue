<template>
    <div class="container">
      <div class="title-panel">
        <p class="my-projects-title">Мои проекты</p>
      </div>

      <div class="tab-container">
        <q-tabs
          v-model="tab"
          vertical
          class="text-primary beautiful-bg"
          style="position:sticky; align-self: flex-start; top: 60px; height: fit-content;"
        >
          <q-tab name="published" icon="groups" label="Опубликованные" style="border-radius: 20px 0 0 0; border: 1px solid rgba(65, 120, 156, 0.5);" />
          <q-tab name="pending" icon="person" label="На рассмотрении" style="border: 1px solid rgba(65, 120, 156, 0.5); border-top: 0px;" />
          <q-tab name="in_progress" icon="person" label="В работе" style="border: 1px solid rgba(65, 120, 156, 0.5); border-top: 0px;" />
          <q-tab name="complete" icon="person" label="Выполненные" style="border: 1px solid rgba(65, 120, 156, 0.5); border-top: 0px;" />
          <q-tab name="revision" icon="more_time" label="На доработке" style="border-radius: 0 0 0 20px; border: 1px solid rgba(65, 120, 156, 0.5); border-top: 0px;" />
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

    <q-tab-panel name="published">
        <div class="projects-header">
        <p class="projects-lenght">Проектов: {{ publishedProjects?.length }}</p>
        <q-btn outline color="primary" label="Создать проект" style="height: 20px; border-radius: 10px;" icon="add" @click="projectIsCreating = true" />
        </div>
        <div v-for="project in publishedProjects" :key="project.id">
            <q-separator />
            <p>{{ project.title }}</p>
        </div>
    </q-tab-panel>

    <q-tab-panel name="pending">
        <div class="projects-header">
        <p class="projects-lenght">Проектов: {{ pendingProjects?.length }}</p>
        <q-btn outline color="primary" label="Создать проект" style="height: 20px; border-radius: 10px;" icon="add" @click="projectIsCreating = true" />
        </div>
    </q-tab-panel>

    <q-tab-panel name="in_progress">
        <div class="projects-header">
        <p class="projects-lenght">Проектов: {{ inProgressProjects?.length }}</p>
        <q-btn outline color="primary" label="Создать проект" style="height: 20px; border-radius: 10px;" icon="add" @click="projectIsCreating = true" />
        </div>
    </q-tab-panel>

    <q-tab-panel name="complete">
        <div class="projects-header">
        <p class="projects-lenght">Проектов: {{ completeProjects?.length }}</p>
        <q-btn outline color="primary" label="Создать проект" style="height: 20px; border-radius: 10px;" icon="add" @click="projectIsCreating = true" />
        </div>
    </q-tab-panel>

    <q-tab-panel name="revision">
        <div class="projects-header">
        <p class="projects-lenght">Проектов: {{ revisionProjects?.length }}</p>
        <q-btn outline color="primary" label="Создать проект" style="height: 20px; border-radius: 10px;" icon="add" @click="projectIsCreating = true" />
        </div>
    </q-tab-panel>

    </q-tab-panels>
    </div>

    <q-dialog maximized v-model="projectIsCreating" backdrop-filter="blur(4px)" transition-show="slide-up" transition-hide="slide-down">
        <q-card flat bordered class="edit-card beautiful-bg-2">

            <q-card-section>
                  <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
                  <p class="text-h5 bg-card" style="color: #41789C; margin: 0;">Создание проекта</p>
                  <q-btn flat color="primary" rounded icon="close" v-close-popup class="bg-card" />
                  </div>
                </q-card-section>

            <q-card-section>
                <q-stepper flat class="stepper-card" alternative-labels v-model="step" ref="stepper" animated color="primary">

                    <q-step :name="1" title="Заголовок" :done="step > 1">
                        <p class="stepper-description">Укажите название вашего проекта</p>
                        <q-input v-model="projectTitle" outlined autofocus autogrow />
                    </q-step>

                    <q-step :name="2" title="Проблема" :done="step > 2">
                        <p class="stepper-description">Опишите проблему, которую решает проект</p>
                        <q-input v-model="projectProblem" outlined autofocus autogrow />
                    </q-step>

                    <q-step :name="3" title="Решение" :done="step > 3">
                        <p class="stepper-description">Предложите способ решения этой проблемы</p>
                        <q-input v-model="projectSolution" outlined autofocus autogrow />
                    </q-step>

                    <q-step :name="4" title="Результат" :done="step > 4">
                        <p class="stepper-description">Какие результаты планируется достичь?</p>
                        <q-input v-model="projectExpectedResult" outlined autofocus autogrow />
                    </q-step>

                    <q-step :name="5" title="Стек" :done="step > 5">
                        <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
                        <p class="stepper-description">Какие технологии будут использоваться?</p>
                        <q-btn outline color="primary" label="сбросить" @click="clearStack()" style="border-radius: 10px;" />
                        </div>
                        <div class="stack-container">
                            <div class="technologies">
                                <div class="stack-list">
                              <p class="stack-category">ЯП</p>
                              <div v-for="lang in languages" :key="lang">
                                <q-checkbox v-model="selectedStack[lang]" :label="lang" />
                              </div>
                              </div>
                              <div class="stack-list">
                              <p class="stack-category">Фреймворки</p>
                              <div v-for="framework in frameworks" :key="framework">
                                <q-checkbox v-model="selectedStack[framework]" :label="framework" />
                              </div>
                              </div>
                              <div class="stack-list">
                                <p class="stack-category">Базы данных</p>
                                <div v-for="database in databases" :key="database">
                                  <q-checkbox v-model="selectedStack[database]" :label="database" />
                                </div>
                              </div>
                              <div class="stack-list">
                                <p class="stack-category">DevOps</p>
                                <div v-for="devop in devops" :key="devop">
                                  <q-checkbox v-model="selectedStack[devop]" :label="devop" />
                                </div>
                              </div>
                            </div>
                        </div>
                    </q-step>

                    <q-step :name="6" title="Завершение" :done="step > 6">
                        <p class="stepper-description">Укажите <u>заказчика</u> проекта, на какую <u>биржу</u> он будет опубликован, а также какое <u>максимальное количество человек</u> потребуется для реализации</p>
                        <q-input v-model="projectCustomer" outlined autofocus label="Заказчик" />
                        <q-select outlined clearable v-model="projectRialto" :options="rialtos" option-label="title" :rules="[val => !!val || '']" label="Биржа" style="margin-top: 20px;" />
                        <q-input v-model="projectMaxPeopleNumber" outlined autofocus label="Макс. кол-во человек" />

                    </q-step>

                    
                    <template v-slot:navigation>
                      <q-stepper-navigation :style="step > 1 ? 'display: flex; justify-content: space-between;' : 'display: flex; justify-content: flex-end;'">
                        <Transition name="fade" mode="out-in">
                        <q-btn v-if="step > 1" icon="chevron_left" outline color="primary" @click="stepper?.previous()" label="Назад" class="q-ml-sm" style="border-radius: 10px;" />
                            </Transition>
                        <Transition name="fade" mode="out-in">
                        <q-btn v-if="step != 6" @click="goNext" color="primary" label="Далее" icon-right="chevron_right" style="border-radius: 10px;" :disable="!isCurrentStepValid" />
                        <q-btn v-else-if="step === 6" filled color="primary" label="Подать заявку" style="border-radius: 10px;" :disable="!isCurrentStepValid" @click="submitProject" />
                    </Transition>
                      </q-stepper-navigation>
                    </template>
                </q-stepper>
            </q-card-section>

        </q-card>
    </q-dialog>

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

.fade-enter-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from {
    opacity: 0;
  }

.title-panel {
    margin-top: 10px;
    padding: 10px;
    border-radius: 15px;
    background-color: #E0EEF8;
  }

.my-projects-title {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 36px;
    font-weight: 600;
    margin: 0;
    color: #41789C;
}

.tab-container {
    display: flex;
    width: 90vw;
    max-width: 1200px;
    margin-top: 40px;
    margin-bottom: 20px;
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

  .projects-lenght {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #41789C;
    font-weight: 600;
    font-size: 24px;
  }

  .projects-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .edit-card {
    border-radius: 15px;
  }

  .stepper-card {
    min-height: 85vh;
    border-radius: 10px;
  }

  .bg-card {
    background-color: #E0EEF8;
    padding: 5px;
    border-radius: 10px;
  }

  .stepper-description {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #41789C;
    font-size: 20px;
    margin: 0;
  }

  .technologies {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 10px;
  }

  .stack-list {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.stack-category {
  text-align: center;
  color: #41789C;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px;
}
</style>

<script setup lang="ts">
  /* eslint-disable @typescript-eslint/no-explicit-any */
import { instance } from 'src/api/axios.api';
import type { IProjects, IRialto } from 'src/types/types';
import { computed, onMounted, ref } from 'vue';
import { languages, devops, databases, frameworks } from '../types/technologies'
import { toast } from 'vue3-toastify';
import { QStepper } from 'quasar';


const tab = ref<string>('published')
const step = ref<number>(1)
const stepper = ref<QStepper | null>(null)
const projectIsCreating = ref<boolean>(false)
const selectedStack = ref<Record<string, boolean>>({})

const myProjects = ref<IProjects[] | null>(null)
const rialtos = ref<IRialto[]>()

const publishedProjects = ref<IProjects[] | null>(null)
const pendingProjects = ref<IProjects[] | null>(null)
const inProgressProjects = ref<IProjects[] | null>(null)
const completeProjects = ref<IProjects[] | null>(null)
const revisionProjects = ref<IProjects[] | null>(null)

const projectTitle = ref<string>('')
const projectProblem = ref<string>('')
const projectSolution = ref<string>('')
const projectExpectedResult = ref<string>('')
const projectCustomer = ref<string>('')
const projectRialto = ref<IRialto>()
const projectMaxPeopleNumber = ref<string>('')
const projectStack = ref<string[]>([])

const concatStack = () => {
    projectStack.value = Object.keys(selectedStack.value).filter(el => selectedStack.value[el])
    return projectStack.value
}

const clearStack = () => {
    languages.forEach(lang => selectedStack.value[lang] = false)
    frameworks.forEach(framework => selectedStack.value[framework] = false)
    databases.forEach(db => selectedStack.value[db] = false)
    devops.forEach(devop => selectedStack.value[devop] = false)
}

const isCurrentStepValid = computed(() => {
  switch (step.value) {
    case 1: // Заголовок
      return projectTitle.value.trim().length > 0;
    case 2: // Проблема
      return projectProblem.value.trim().length > 0;
    case 3: // Решение
      return projectSolution.value.trim().length > 0;
    case 4: // Результат
      return projectExpectedResult.value.trim().length > 0;
    case 5: // Стек (может быть пустым)
      return true;
    case 6: // Завершение
      return (
        projectCustomer.value.trim().length > 0 &&
        projectRialto.value &&
        projectMaxPeopleNumber.value.trim().length > 0
      );
    default:
      return false;
  }
});

// Метод для перехода к следующему шагу с проверкой
const goNext = () => {
  if (isCurrentStepValid.value) {
    stepper.value?.next();
  } else {
    toast.error('Заполните все обязательные поля');
  }
};

const submitProject = async () => {
  if (!isCurrentStepValid.value) {
    toast.error('Заполните все обязательные поля');
    return;
  }
  
  await sendCreateProjectRequest(
    projectTitle.value,
    projectProblem.value,
    projectSolution.value,
    projectExpectedResult.value,
    projectCustomer.value,
    projectRialto.value!.id,
    projectMaxPeopleNumber.value
  );
};

const sendCreateProjectRequest = async (title: string, 
problem: string, 
solution: string, 
expectedResult: string, 
customer: string, 
rialtoId: number, 
maxPeopleNumber: string) => {
    try {
        const stack = concatStack()

        await instance.post('project', {title, 
            problem,
            solution,
            expectedResult,
            stack,
            customer,
            rialtoId,
            maxPeopleNumber
        })

        projectIsCreating.value = false
        toast.success('Заявка отправлена')
    }
    catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
        toast.error(errorMessage);
    }
}

onMounted(async () => {
    myProjects.value = (await instance.get('project/my')).data
    rialtos.value = (await instance.get('rialto')).data

    publishedProjects.value = myProjects.value?.filter(project => project.status === 'published') || null
    pendingProjects.value = myProjects.value?.filter(project => project.status === 'pending') || null
    inProgressProjects.value = myProjects.value?.filter(project => project.status === 'in_progress') || null
    completeProjects.value = myProjects.value?.filter(project => project.status === 'complete') || null
    revisionProjects.value = myProjects.value?.filter(project => project.status === 'revision') || null

    clearStack()
})
</script>