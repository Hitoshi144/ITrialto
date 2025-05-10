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
          <q-tab name="published" icon="publish" label="Опубликованные" style="border-radius: 20px 0 0 0; border: 1px solid rgba(65, 120, 156, 0.5);">
            <q-badge :label="publishedProjects?.length" />
          </q-tab>
          <q-tab name="pending" icon="schedule_send" label="На рассмотрении" style="border: 1px solid rgba(65, 120, 156, 0.5); border-top: 0px;">
            <q-badge :label="pendingProjects?.length" />
          </q-tab>
          <q-tab name="in_progress" icon="construction" label="В работе" style="border: 1px solid rgba(65, 120, 156, 0.5); border-top: 0px;">
            <q-badge :label="inProgressProjects?.length" />
          </q-tab>
          <q-tab name="complete" icon="verified" label="Выполненные" style="border: 1px solid rgba(65, 120, 156, 0.5); border-top: 0px;">
            <q-badge :label="completeProjects?.length" />
          </q-tab>
          <q-tab name="rejected" icon="do_not_disturb_on" label="Отклоненные" style="border: 1px solid rgba(65, 120, 156, 0.5); border-top: 0px;">
            <q-badge :label="rejectedProjects?.length" />
          </q-tab>
          <q-tab name="revision" icon="report" label="На доработке" style="border-radius: 0 0 0 20px; border: 1px solid rgba(65, 120, 156, 0.5); border-top: 0px;">
            <q-badge :label="revisionProjects?.length" />
          </q-tab>
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
        <p class="projects-lenght">Опубликованных проектов: {{ publishedProjects?.length }}</p>
        <q-btn outline color="primary" label="Создать проект" style="height: 20px; border-radius: 10px;" icon="add" @click="projectIsCreating = true; step = 1; projectIsResubmit = false" />
        </div>

        <div v-for="project in publishedProjects" :key="project.id">
          <q-separator />
          <div class="projects-header" style="align-items: center;">
            <p class="project-title">{{ project.title }}</p>
            <q-btn outline color="primary" :label="(toProjectRequests[project.id]?.length === undefined ? '0' : toProjectRequests[project.id]?.length) + ' ' + requestWord(toProjectRequests[project.id]?.length)" style="height: 20px; border-radius: 10px; min-width: 200px;" @click="openToProjectRequests = true; selectedProject = project" :disable="toProjectRequests[project.id]?.length === 0 || toProjectRequests[project.id]?.length === undefined ? true : false" />
          </div>

          <div class="project-info">
            <div style="display: flex; flex-direction: column;">
            <div class="project-title-panel" style="flex-direction: column; width: 100%;">
              <p class="project-description"><strong>Проблема:</strong></p>
              <p class="project-description">{{ project.problem }}</p>
            </div>
            <div class="project-title-panel" style="flex-direction: column; width: 100%;">
              <p class="project-description"><strong>Решение:</strong></p>
              <p class="project-description">{{ project.solution }}</p>
            </div>
            <div class="project-title-panel" style="flex-direction: column; width: 100%;">
              <p class="project-description"><strong>Ожидаемый результат:</strong></p>
              <p class="project-description">{{ project.expectedResult }}</p>
            </div>
            </div>

            <div class="project-title-panel about-project" style="flex-direction: column;">
              <p class="project-description"><strong>Заказчик:</strong> {{ project.customer }}</p>
              <p class="project-description"><strong>Биржа:</strong> {{ rialtos?.find(rialto => rialto.id === project.rialtoId)?.title }}</p>
              <p class="project-description"><strong>Макс. кол-во человек в команде:</strong> {{ project.maxPeopleNumber }}</p>
              <p class="project-description"><strong>Набор:</strong> {{ recruitmentInterp[project.recruitment as keyof typeof recruitmentInterp] }}</p>
              <q-btn filled unelevated color="primary" :label="project.recruitment === 'open' ? 'закрыть' : 'открыть'" size="xs" style="border-radius: 10px; max-width: 200px; font-size: 10px;" @click="changeRecruitment(project)" />
            </div>
          </div>

          <div class="project-title-panel" style="max-width: 100%;">
            <div v-if="projectStacks[project.id]!.length > 0" class="stack-panel">
              <p class="project-description" style="align-self: center;"><strong>Стек технологий: </strong></p>
              <div class="stack-card" v-for="tech in projectStacks[project.id]" :key="tech">
                <p style="margin: 0;">{{ tech }}</p>
              </div>
            </div>
            <div v-else>
              <p class="project-description" style="align-self: center;"><strong>Стек отсутствует</strong></p>
            </div>
          </div>

          <q-btn outline color="primary" label="удалить" icon="delete_forever" style="display: flex; justify-self: flex-end; border-radius: 10px; margin-bottom: 20px; margin-top: 20px;" @click="projectIsDeleting = true; selectedProject = project" />

        </div>
    </q-tab-panel>

    <q-tab-panel name="pending">

        <div class="projects-header">
        <p class="projects-lenght">Проектов на рассмотрении: {{ pendingProjects?.length }}</p>
        <q-btn outline color="primary" label="Создать проект" style="height: 20px; border-radius: 10px;" icon="add" @click="projectIsCreating = true; step = 1; projectIsResubmit = false" />
        </div>

        <div v-for="project in pendingProjects" :key="project.id">
          <q-separator />
          <div class="projects-header" style="align-items: center;">
            <p class="project-title">{{ project.title }}</p>
          </div>

          <div class="project-info">
            <div style="display: flex; flex-direction: column;">
            <div class="project-title-panel" style="flex-direction: column; width: 100%;">
              <p class="project-description"><strong>Проблема:</strong></p>
              <p class="project-description">{{ project.problem }}</p>
            </div>
            <div class="project-title-panel" style="flex-direction: column; width: 100%;">
              <p class="project-description"><strong>Решение:</strong></p>
              <p class="project-description">{{ project.solution }}</p>
            </div>
            <div class="project-title-panel" style="flex-direction: column; width: 100%;">
              <p class="project-description"><strong>Ожидаемый результат:</strong></p>
              <p class="project-description">{{ project.expectedResult }}</p>
            </div>
            </div>

            <div class="project-title-panel about-project" style="flex-direction: column;">
              <p class="project-description"><strong>Заказчик:</strong> {{ project.customer }}</p>
              <p class="project-description"><strong>Биржа:</strong> {{ rialtos?.find(rialto => rialto.id === project.rialtoId)?.title }}</p>
              <p class="project-description"><strong>Макс. кол-во человек в команде:</strong> {{ project.maxPeopleNumber }}</p>
              <p class="project-description"><strong>Набор:</strong> {{ recruitmentInterp[project.recruitment as keyof typeof recruitmentInterp] }}</p>
            </div>
          </div>

          <div class="project-title-panel" style="max-width: 100%;">
            <div v-if="projectStacks[project.id]!.length > 0" class="stack-panel">
              <p class="project-description" style="align-self: center;"><strong>Стек технологий: </strong></p>
              <div class="stack-card" v-for="tech in projectStacks[project.id]" :key="tech">
                <p style="margin: 0;">{{ tech }}</p>
              </div>
            </div>
            <div v-else>
              <p class="project-description" style="align-self: center;"><strong>Стек отсутствует</strong></p>
            </div>
          </div>

          <div style="margin-top: 20px; margin-bottom: 30px; display: flex; justify-content: space-between;">
            <q-btn filled color="primary" label="Изменить" style="border-radius: 10px;" @click="projectIsEditing(project)" />
            <q-btn outline color="primary" label="удалить" icon="delete_forever" style="border-radius: 10px;" @click="projectIsDeleting = true; selectedProject = project" />
          </div>

        </div>

    </q-tab-panel>

    <q-tab-panel name="in_progress">
        <div class="projects-header">
        <p class="projects-lenght">Проектов в работе: {{ inProgressProjects?.length }}</p>
        <q-btn outline color="primary" label="Создать проект" style="height: 20px; border-radius: 10px;" icon="add" @click="projectIsCreating = true; step = 1; projectIsResubmit = false" />
        </div>

        <div v-for="project in inProgressProjects" :key="project.id">
          <q-separator />
          <div class="projects-header" style="align-items: center;">
            <p class="project-title">{{ project.title }}</p>
          </div>

          <div class="project-info">
            <div style="display: flex; flex-direction: column;">
            <div class="project-title-panel" style="flex-direction: column; width: 100%;">
              <p class="project-description"><strong>Проблема:</strong></p>
              <p class="project-description">{{ project.problem }}</p>
            </div>
            <div class="project-title-panel" style="flex-direction: column; width: 100%;">
              <p class="project-description"><strong>Решение:</strong></p>
              <p class="project-description">{{ project.solution }}</p>
            </div>
            <div class="project-title-panel" style="flex-direction: column; width: 100%;">
              <p class="project-description"><strong>Ожидаемый результат:</strong></p>
              <p class="project-description">{{ project.expectedResult }}</p>
            </div>
            </div>

            <div class="project-title-panel about-project" style="flex-direction: column;">
              <p class="project-description"><strong>Заказчик:</strong> {{ project.customer }}</p>
              <p class="project-description"><strong>Биржа:</strong> {{ rialtos?.find(rialto => rialto.id === project.rialtoId)?.title }}</p>
              <p class="project-description"><strong>Макс. кол-во человек в команде:</strong> {{ project.maxPeopleNumber }}</p>
              <p class="project-description"><strong>Набор:</strong> {{ recruitmentInterp[project.recruitment as keyof typeof recruitmentInterp] }}</p>
            </div>
          </div>

          <div class="project-title-panel" style="max-width: 100%;">
            <div v-if="projectStacks[project.id]!.length > 0" class="stack-panel">
              <p class="project-description" style="align-self: center;"><strong>Стек технологий: </strong></p>
              <div class="stack-card" v-for="tech in projectStacks[project.id]" :key="tech">
                <p style="margin: 0;">{{ tech }}</p>
              </div>
            </div>
            <div v-else>
              <p class="project-description" style="align-self: center;"><strong>Стек отсутствует</strong></p>
            </div>
          </div>

          <p class="working-team">Назначен команде: <strong>{{ in_progressTeams.find(team => team.id === project.teamId)?.title }}</strong></p>

          <div style="display: flex; justify-content: space-between; margin-top: 30px;">
            <q-btn outline color="primary" label="Завершить" style="border-radius: 10px;" @click="completingProject = true" />
            <q-btn filled color="primary" label="Снять команду с проекта" style="border-radius: 10px;" @click="resignTeamFromProject(project)" />
          </div>

          <q-dialog v-model="completingProject" backdrop-filter="blur(4px)" transition-show="fade" transition-hide="fade" @before-hide="completingProject = false">
                    <q-card flat bordered class="team-edit-card" style="border-radius: 15px;">
                      <q-card-section>
                        <div style="display: flex; justify-content: space-between; flex-direction: row;">
                          <p class="text-h5" style="color: #41789C;">Завершение проекта</p>
                        <q-btn flat color="primary" rounded icon="close" v-close-popup />
                        </div>
                      </q-card-section>
                      <q-card-section>
                        <p class="text-h6" style="color: #41789C; margin-left: 30px;">Вы уверены, что хотите <span style="color: #eb6449;">завершить</span> проект "{{ project.title }}"? <u>(Данное действие необратимо!)</u></p>
                      </q-card-section>
                      <q-card-section>
                        <div style="display: flex; flex-direction: row; justify-content: space-between;">
                          <q-btn outline color="negative" style="border-radius: 10px; margin-left: 20px;" label="Завершить" @click="completeProject(project)" />
                          <q-btn filled color="primary" style="border-radius: 10px; margin-right: 20px;" label="Отмена" @click="completingProject = false" />
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-dialog>

        </div>
    </q-tab-panel>

    <q-tab-panel name="complete">
        <div class="projects-header">
        <p class="projects-lenght">Выполненных проектов: {{ completeProjects?.length }}</p>
        <q-btn outline color="primary" label="Создать проект" style="height: 20px; border-radius: 10px;" icon="add" @click="projectIsCreating = true; step = 1; projectIsResubmit = false" />
        </div>

        <div v-for="project in completeProjects" :key="project.id">
          <q-separator />
          <div class="projects-header" style="align-items: center;">
            <p class="project-title">{{ project.title }}</p>
          </div>

          <div class="project-info">
            <div style="display: flex; flex-direction: column;">
            <div class="project-title-panel" style="flex-direction: column; width: 100%;">
              <p class="project-description"><strong>Проблема:</strong></p>
              <p class="project-description">{{ project.problem }}</p>
            </div>
            <div class="project-title-panel" style="flex-direction: column; width: 100%;">
              <p class="project-description"><strong>Решение:</strong></p>
              <p class="project-description">{{ project.solution }}</p>
            </div>
            <div class="project-title-panel" style="flex-direction: column; width: 100%;">
              <p class="project-description"><strong>Ожидаемый результат:</strong></p>
              <p class="project-description">{{ project.expectedResult }}</p>
            </div>
            </div>

            <div class="project-title-panel about-project" style="flex-direction: column;">
              <p class="project-description"><strong>Заказчик:</strong> {{ project.customer }}</p>
              <p class="project-description"><strong>Биржа:</strong> {{ rialtos?.find(rialto => rialto.id === project.rialtoId)?.title }}</p>
              <p class="project-description"><strong>Макс. кол-во человек в команде:</strong> {{ project.maxPeopleNumber }}</p>
              <p class="project-description"><strong>Набор:</strong> {{ recruitmentInterp[project.recruitment as keyof typeof recruitmentInterp] }}</p>
            </div>
          </div>

          <div class="project-title-panel" style="max-width: 100%;">
            <div v-if="projectStacks[project.id]!.length > 0" class="stack-panel">
              <p class="project-description" style="align-self: center;"><strong>Стек технологий: </strong></p>
              <div class="stack-card" v-for="tech in projectStacks[project.id]" :key="tech">
                <p style="margin: 0;">{{ tech }}</p>
              </div>
            </div>
            <div v-else>
              <p class="project-description" style="align-self: center;"><strong>Стек отсутствует</strong></p>
            </div>
          </div>

        </div>
    </q-tab-panel>

    <q-tab-panel name="rejected">
        <div class="projects-header">
        <p class="projects-lenght">Отклоненных проектов: {{ rejectedProjects?.length }}</p>
        <q-btn outline color="primary" label="Создать проект" style="height: 20px; border-radius: 10px;" icon="add" @click="projectIsCreating = true; step = 1; projectIsResubmit = false" />
        </div>

        <div v-for="project in rejectedProjects" :key="project.id">
          <q-separator />
          <div class="projects-header" style="align-items: center;">
            <p class="project-title">{{ project.title }}</p>
          </div>

          <div class="project-info">
            <div style="display: flex; flex-direction: column;">
            <div class="project-title-panel" style="flex-direction: column; width: 100%;">
              <p class="project-description"><strong>Проблема:</strong></p>
              <p class="project-description">{{ project.problem }}</p>
            </div>
            <div class="project-title-panel" style="flex-direction: column; width: 100%;">
              <p class="project-description"><strong>Решение:</strong></p>
              <p class="project-description">{{ project.solution }}</p>
            </div>
            <div class="project-title-panel" style="flex-direction: column; width: 100%;">
              <p class="project-description"><strong>Ожидаемый результат:</strong></p>
              <p class="project-description">{{ project.expectedResult }}</p>
            </div>
            </div>

            <div class="project-title-panel about-project" style="flex-direction: column;">
              <p class="project-description"><strong>Заказчик:</strong> {{ project.customer }}</p>
              <p class="project-description"><strong>Биржа:</strong> {{ rialtos?.find(rialto => rialto.id === project.rialtoId)?.title }}</p>
              <p class="project-description"><strong>Макс. кол-во человек в команде:</strong> {{ project.maxPeopleNumber }}</p>
              <p class="project-description"><strong>Набор:</strong> {{ recruitmentInterp[project.recruitment as keyof typeof recruitmentInterp] }}</p>
            </div>
          </div>

          <div class="project-title-panel" style="max-width: 100%;">
            <div v-if="projectStacks[project.id]!.length > 0" class="stack-panel">
              <p class="project-description" style="align-self: center;"><strong>Стек технологий: </strong></p>
              <div class="stack-card" v-for="tech in projectStacks[project.id]" :key="tech">
                <p style="margin: 0;">{{ tech }}</p>
              </div>
            </div>
            <div v-else>
              <p class="project-description" style="align-self: center;"><strong>Стек отсутствует</strong></p>
            </div>
          </div>

        </div>
    </q-tab-panel>

    <q-tab-panel name="revision">
        <div class="projects-header">
        <p class="projects-lenght">Проектов на доработке: {{ revisionProjects?.length }}</p>
        <q-btn outline color="primary" label="Создать проект" style="height: 20px; border-radius: 10px;" icon="add" @click="projectIsCreating = true; step = 1; projectIsResubmit = false" />
        </div>

        <div v-for="project in revisionProjects" :key="project.id">
          <q-separator />
          <div class="projects-header" style="align-items: center;">
            <p class="project-title">{{ project.title }}</p>
          </div>

          <div class="project-info">
            <div style="display: flex; flex-direction: column;">
            <div class="project-title-panel" style="flex-direction: column; width: 100%;">
              <p class="project-description"><strong>Проблема:</strong></p>
              <p class="project-description">{{ project.problem }}</p>
            </div>
            <div class="project-title-panel" style="flex-direction: column; width: 100%;">
              <p class="project-description"><strong>Решение:</strong></p>
              <p class="project-description">{{ project.solution }}</p>
            </div>
            <div class="project-title-panel" style="flex-direction: column; width: 100%;">
              <p class="project-description"><strong>Ожидаемый результат:</strong></p>
              <p class="project-description">{{ project.expectedResult }}</p>
            </div>
            </div>

            <div class="project-title-panel about-project" style="flex-direction: column;">
              <p class="project-description"><strong>Заказчик:</strong> {{ project.customer }}</p>
              <p class="project-description"><strong>Биржа:</strong> {{ rialtos?.find(rialto => rialto.id === project.rialtoId)?.title }}</p>
              <p class="project-description"><strong>Макс. кол-во человек в команде:</strong> {{ project.maxPeopleNumber }}</p>
              <p class="project-description"><strong>Набор:</strong> {{ recruitmentInterp[project.recruitment as keyof typeof recruitmentInterp] }}</p>
            </div>
          </div>

          <div class="project-title-panel" style="max-width: 100%;">
            <div v-if="projectStacks[project.id]!.length > 0" class="stack-panel">
              <p class="project-description" style="align-self: center;"><strong>Стек технологий: </strong></p>
              <div class="stack-card" v-for="tech in projectStacks[project.id]" :key="tech">
                <p style="margin: 0;">{{ tech }}</p>
              </div>
            </div>
            <div v-else>
              <p class="project-description" style="align-self: center;"><strong>Стек отсутствует</strong></p>
            </div>
          </div>

          <p class="revisionComment"><strong>Причина:</strong> {{ project.comment }}</p>

          <div style="margin-top: 20px; margin-bottom: 30px; display: flex; justify-content: space-between;">
            <q-btn filled color="primary" label="Изменить" style="border-radius: 10px;" @click="projectIsEditing(project)" />
            <q-btn outline color="primary" label="удалить" icon="delete_forever" style="border-radius: 10px;" @click="projectIsDeleting = true; selectedProject = project" />
          </div>

        </div>
    </q-tab-panel>

    </q-tab-panels>
    </div>

    <q-dialog maximized v-model="projectIsCreating" backdrop-filter="blur(4px)" transition-show="slide-up" transition-hide="slide-down">
        <q-card flat bordered class="edit-card beautiful-bg-2">

            <q-card-section>
                  <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;" class="bg-card">
                  <p v-if="projectIsResubmit === false" class="text-h5" style="color: #41789C; margin: 0;">Создание проекта</p>
                  <p v-else class="text-h5" style="color: #41789C; margin: 0;">Редактирование проекта</p>
                  <q-btn flat color="primary" rounded icon="close" v-close-popup class="bg-card" @click="clearVariables" />
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
                        <q-input v-model="projectMaxPeopleNumber" outlined label="Макс. кол-во человек" type="number" />

                    </q-step>

                    
                    <template v-slot:navigation>
                      <q-stepper-navigation :style="step > 1 ? 'display: flex; justify-content: space-between;' : 'display: flex; justify-content: flex-end;'">
                        <Transition name="fade" mode="out-in">
                        <q-btn v-if="step > 1" icon="chevron_left" outline color="primary" @click="stepper?.previous()" label="Назад" class="q-ml-sm" style="border-radius: 10px;" />
                            </Transition>
                        <Transition name="fade" mode="out-in">
                        <q-btn v-if="step != 6" @click="goNext" color="primary" label="Далее" icon-right="chevron_right" style="border-radius: 10px;" :disable="!isCurrentStepValid" />
                        <q-btn v-else-if="step === 6" filled color="primary" :label="projectIsResubmit ? 'Отправить повторно' : 'Подать заявку'" style="border-radius: 10px;" :disable="!isCurrentStepValid" @click="projectIsResubmit === true ? submitProject(selectedProject?.id) : submitProject()" />
                    </Transition>
                      </q-stepper-navigation>
                    </template>
                </q-stepper>
            </q-card-section>

        </q-card>
    </q-dialog>

    <q-dialog v-model="projectIsDeleting" backdrop-filter="blur(4px)" transition-show="fade" transition-hide="fade" @before-hide="clearVariables()">
                    <q-card flat bordered class="team-edit-card" style="border-radius: 15px;">
                      <q-card-section>
                        <div style="display: flex; justify-content: space-between; flex-direction: row;">
                          <p class="text-h5" style="color: #41789C;">Удаление проекта</p>
                        <q-btn flat color="primary" rounded icon="close" v-close-popup />
                        </div>
                      </q-card-section>
                      <q-card-section>
                        <p class="text-h6" style="color: #41789C; margin-left: 30px;">Вы уверены, что хотите <span style="color: #eb6449;">удалить</span> проект "{{ selectedProject?.title }}"?</p>
                      </q-card-section>
                      <q-card-section>
                        <div style="display: flex; flex-direction: row; justify-content: space-between;">
                          <q-btn outline color="negative" style="border-radius: 10px; margin-left: 20px;" label="Да, удалить" @click="deleteProject(selectedProject!.id)" />
                          <q-btn filled color="primary" style="border-radius: 10px; margin-right: 20px;" label="Нет, оставить" @click="projectIsDeleting = false" />
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-dialog>

    <q-dialog maximized v-model="openToProjectRequests" backdrop-filter="blur(4px)" transition-show="slide-up" transition-hide="slide-down" @before-hide="selectedProject = null">
      <q-card flat bordered class="edit-card beautiful-bg-2">
        <q-card-section>
          <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;" class="bg-card">
          <p class="text-h5" style="color: #41789C; margin: 0;">Заявки на проект "{{ selectedProject?.title }}"</p>
          <q-btn flat color="primary" rounded icon="close" v-close-popup class="bg-card" @click="clearVariables" />
        </div>
        </q-card-section>
        <q-card-section>

      <q-carousel
      v-if="selectedProject"
      v-model="teamSlide"
      transition-prev="slide-right"
      transition-next="slide-left"
      swipeable
      animated
      control-color="primary"
      navigation
      arrows
      style="border-radius: 10px; height: 85vh;"
      >
      <q-carousel-slide
      v-for="request in toProjectRequests[selectedProject!.id]"
      :key="request.id"
      :name="'request-' + request.id"
      >
      <div class="team-title">
        <p>{{ request.team.title }}</p>
      </div>
      <div class="request-container">
      <div class="team-info">
        <div class="description-panel">
          <p>{{ request.team.description }}</p>
        </div>
        <div class="team-info-panel">
          <p><strong>Тим-лидер:</strong> {{ teamMembers[request.team.teamLeaderId]?.firstname}} {{ teamMembers[request.team.teamLeaderId]?.lastname }}</p>
          <p><strong>Дата создания:</strong> {{ formatDateToDDMMYYYY(request.team.createdAt) }}</p>
          <p><strong>Статус:</strong> {{ request.team.currentProjectId ? 'В работе' : 'В поисках' }}</p>
          <p><strong>Приватность:</strong> {{ teamStatusinterp[request.team.status as keyof typeof teamStatusinterp] }}</p>
          <p><strong>Кол-во участников:</strong> {{ request.team.members.length + 1 }}</p>
        </div>
      </div>
      <div class="stack-panel">
        <p style="color: #41789C; align-self: center; margin: 0; font-size: 18px; 
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-weight: 500;
        ">Стек:</p>
        <div class="stack-card" v-for="tech in teamStacks[request.teamId]" :key="tech">
          <p style="margin: 0;">{{ tech }}</p>
        </div>
      </div>
      <div class="team-members-title">
        <p>Участники</p>
      </div>
      <div class="team-members">
        <div class="member-panel">
          <img class="user-avatar" :src="avatarUrls[request.team.teamLeaderId] || avatarAlt" />
          <div class="member-info">
            <q-badge color="primary">тим-лидер</q-badge>
          <p>{{ teamMembers[request.team.teamLeaderId]?.firstname }} {{ teamMembers[request.team.teamLeaderId]?.lastname }}</p>
          <p>{{ teamMembers[request.team.teamLeaderId]?.mail }}</p>
          </div>
        </div>
        <div class="member-panel" v-for="member in request.team.members" :key="member">
          <img class="user-avatar" :src="avatarUrls[Number(member)] || avatarAlt" />
          <div class="member-info">
          <p>{{ teamMembers[Number(member)]?.firstname }} {{ teamMembers[Number(member)]?.lastname }}</p>
          <p>{{ teamMembers[Number(member)]?.mail }}</p>
          </div>
        </div>
      </div>
      <div class="requests-controls">
          <q-btn filled color="primary" style="border-radius: 10px;" label="Назначить на проект" @click="approveRequest(selectedProject.id, request.id)" />
          <q-btn outline color="primary" style="border-radius: 10px;" label="Отказать" @click="rejectRequest(selectedProject.id, request.id)" />
        </div>
        </div>
    </q-carousel-slide>

    </q-carousel>
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

.request-container {
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 100px;
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

  .team-members {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
  }

  .bg-card {
    background-color: white;
    padding: 5px;
    border-radius: 10px;
  }

  .requests-controls {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 50px;
  }

  .team-title {
    display: flex;
    justify-content: center;

    p {
      color: #41789C;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      font-size: 24px;
      font-weight: 500;
      text-align: center;
    }
  }

  .user-avatar {
    width: auto;
    height: 50px;
    margin-right: 10px;
    border-radius: 100%;
  }

  .description-panel {
    background-color: #E0EEF8;
    padding: 10px;
    min-width: 60vw;
    border-radius: 10px;

    p {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      font-size: 15px;
      color: #41789C;
      font-weight: 500;
    }
  }

  .member-info {
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
      margin: 5px;
      color: #41789C;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      font-size: 16px;
    }
  }

  .team-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 10px;
  }

  .team-members-title {
    display: flex;
    justify-content: center;
    margin-top: 10px;

    p {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      font-size: 20px;
      color: #41789C;
    }
  }

  .member-panel {
    display: flex;
    flex-direction: row;
    background-color: #E0EEF8;
    max-width: max-content;
    padding: 7px;
    align-items: center;
    border-radius: 5px;
  }

  .team-info-panel {
    background-color: #E0EEF8;
    padding: 10px;
    min-width: 20vw;
    border-radius: 10px;

    p {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      font-size: 15px;
      color: #41789C;
      font-weight: 500;
    }
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

.project-title {
  margin: 15px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 24px;
    font-weight: 500;
    color: #41789C;
}

.working-team {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #41789C;
  font-size: 18px;
  margin: 0;
  border: 1px solid #41789C;
  border-radius: 10px;
  padding: 5px  ;
}

.project-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.project-title-panel {
  display: flex;
  justify-self: flex-start;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #E0EEF8;
  max-width: 100%;
  padding: 15px;
  border-radius: 15px;
  border: 1px solid rgba(141, 183, 202, 0.342);
}

.about-project {
  margin-left: 20px;
}

.project-description {
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

.revisionComment {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #eb6449;
  font-size: 16px;
  border: 1px solid #eb6449;
  padding: 7px;
  border-radius: 10px;
}

@media screen and (max-width: 800px) {
  .projects-header {
    flex-direction: column;
  }

  .project-info {
    flex-direction: column-reverse;
  }

  .about-project {
    margin-left: 0;
  }

  .team-info {
    flex-direction: column-reverse;
  }

  .team-info-panel {
    min-width: 80vw;
  }

  .description-panel {
    min-width: 80vw;
  }
}
</style>

<script setup lang="ts">
  /* eslint-disable @typescript-eslint/no-explicit-any */
import { instance } from 'src/api/axios.api';
import type { IProjects, IRialto, ITeam, IToProjectRequest, IUser } from 'src/types/types';
import { computed, onMounted, ref, watch } from 'vue';
import { languages, devops, databases, frameworks } from '../types/technologies'
import { toast } from 'vue3-toastify';
import { QStepper } from 'quasar';
import { AuthService } from '../services/auth.service'
import avatarAlt from '../assets/avatar_alt.png'


const tab = ref<string>('published')
const step = ref<number>(1)
const stepper = ref<QStepper | null>(null)
const projectIsCreating = ref<boolean>(false)
const projectIsResubmit = ref<boolean>(false)
const projectIsDeleting = ref<boolean>(false)
const selectedStack = ref<Record<string, boolean>>({})

const selectedProject = ref<IProjects | null>()

const toProjectRequests = ref<Record<number, IToProjectRequest[] | null>>({})

const teamMembers = ref<Record<number, IUser>>({})

const openToProjectRequests = ref<boolean>(false)

const myProjects = ref<IProjects[] | null>(null)
const rialtos = ref<IRialto[]>()

const teamStacks = ref<Record<number, string[]>>({})

const in_progressTeams = ref<ITeam[]>([])

const publishedProjects = ref<IProjects[] | null>(null)
const pendingProjects = ref<IProjects[] | null>(null)
const inProgressProjects = ref<IProjects[] | null>(null)
const completeProjects = ref<IProjects[] | null>(null)
const revisionProjects = ref<IProjects[] | null>(null)
const rejectedProjects = ref<IProjects[] | null>(null)

const projectTitle = ref<string>('')
const projectProblem = ref<string>('')
const projectSolution = ref<string>('')
const projectExpectedResult = ref<string>('')
const projectCustomer = ref<string>('')
const projectRialto = ref<IRialto | null>()
const projectMaxPeopleNumber = ref<string>('')
const projectStack = ref<string[]>([])

const avatarUrls = ref<Record<number, string>>({});

const completingProject = ref<boolean>(false)

const projectStacks = ref<Record<number, string[]>>({})

const projectIsEditing = (project: IProjects) => {
  step.value = 1
  Object.keys(selectedStack.value).forEach((tech: string) => {selectedStack.value[tech] = false})
  projectIsCreating.value = true
  projectIsResubmit.value = true

  selectedProject.value = project

  projectTitle.value = project.title
  projectProblem.value = project.problem
  projectSolution.value = project.solution
  projectExpectedResult.value = project.expectedResult
  projectCustomer.value = project.customer
  projectRialto.value = rialtos.value?.find(rialto => rialto.id === project.rialtoId)
  projectMaxPeopleNumber.value = project.maxPeopleNumber

  project.stack.replace('{', '').replace('}', '').split(',').forEach(tech => selectedStack.value[tech] = true)
}

const concatStack = () => {
    projectStack.value = Object.keys(selectedStack.value).filter(el => selectedStack.value[el])
    return projectStack.value
}

const clearVariables = () => {
  projectIsCreating.value = false
  projectIsResubmit.value = false
  clearStack()
  selectedProject.value = null

  projectTitle.value = ''
  projectProblem.value = ''
  projectSolution.value = ''
  projectExpectedResult.value = ''
  projectCustomer.value = ''
  projectMaxPeopleNumber.value = ''
  projectRialto.value = null
}

const clearStack = () => {
    languages.forEach(lang => selectedStack.value[lang] = false)
    frameworks.forEach(framework => selectedStack.value[framework] = false)
    databases.forEach(db => selectedStack.value[db] = false)
    devops.forEach(devop => selectedStack.value[devop] = false)
}

const recruitmentInterp = {
  'open': 'открыт',
  'close': 'закрыт'
}

const teamStatusinterp = {
  'open': 'открыта',
  'close': 'закрыта'
}

function formatDateToDDMMYYYY(isoDateString: string): string {
  const date = new Date(isoDateString);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}.${month}.${year}`;
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

const submitProject = async (id?: number) => {
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
    projectMaxPeopleNumber.value,
    id
  );
};

const sendCreateProjectRequest = async (title: string, 
problem: string, 
solution: string, 
expectedResult: string, 
customer: string, 
rialtoId: number, 
maxPeopleNumber: string,
id?: number) => {
    try {
        const stack = concatStack()
        let project: IProjects

        if (projectIsResubmit.value === true) {
          project = (await instance.patch(`project/${id}/resubmit`, {
            title, 
            problem,
            solution,
            expectedResult,
            stack,
            customer,
            rialtoId,
            maxPeopleNumber
          })).data

          revisionProjects.value = revisionProjects.value!.filter(projects => projects.id !== project!.id)
          pendingProjects.value = pendingProjects.value!.filter(projects => projects.id !== project!.id)
        } 
        
        else {
          project = (await instance.post('project', {title, 
              problem,
              solution,
              expectedResult,
              stack,
              customer,
              rialtoId,
              maxPeopleNumber
          })).data
      }

        projectIsCreating.value = false
        projectIsResubmit.value = false
        clearVariables()
        toast.success('Заявка отправлена')
        projectStacks.value[project!.id] = stack
        pendingProjects.value = [...(pendingProjects.value || []), project]

    }
    catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
        toast.error(errorMessage);
    }
}

const requestWord = (count: number | undefined) => {
  if (count === undefined) {
    return 'заявок'
  }
  else if (count  % 10 === 1 && Math.floor(count / 10) % 10 !== 1) {
    return 'заявка'
  }
  else if (count % 10 > 1 && count % 10 < 5 && Math.floor(count / 10) % 10 !== 1) {
    return 'заявки'
  }
  else {
    return 'заявок'
  }
}

const deleteProject = async (projectId: number) => {
  try {
    await instance.delete(`project/${projectId}/delete`)

    pendingProjects.value = pendingProjects.value!.filter(projects => projects.id !== projectId)
    revisionProjects.value = revisionProjects.value!.filter(projects => projects.id !== projectId)
    publishedProjects.value = publishedProjects.value!.filter(projects => projects.id !== projectId)

    toast.success('Проект удален')
    projectIsDeleting.value = false
  }
  catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
        toast.error(errorMessage);
    }
}

const teamSlide = ref('');

watch(openToProjectRequests, (isOpen) => {
  if (isOpen && selectedProject.value && toProjectRequests.value[selectedProject.value.id]?.length) {
    teamSlide.value = 'request-' + toProjectRequests.value[selectedProject.value.id]![0]!.id;
  }
});

const getAvatarUrl = async (userId: number): Promise<string | null> => {
  try {
    const avatarBlob = await AuthService.getAvatar(userId);
    if (!avatarBlob || avatarBlob?.size === 0) return null; // Явно возвращаем null при отсутствии аватара
    return URL.createObjectURL(avatarBlob);
  } catch (error) {
    console.error('Ошибка загрузки аватара:', error);
    return null;
  }
};

const rejectRequest = async (projectId: number, requestId: number) => {
  try {
    await instance.patch(`project-request/${requestId}/reject`)
    toProjectRequests.value[projectId] = toProjectRequests.value[projectId]!.filter(request => request.id !== requestId)

    if (toProjectRequests.value[projectId].length === 0) {
      openToProjectRequests.value = false
    }
    else {
      teamSlide.value = 'request-' + toProjectRequests.value[selectedProject.value!.id]![0]!.id;
    }

    toast.success('Заявка отклонена')
  }
  catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
        toast.error(errorMessage);
  }
}

const approveRequest = async (projectId: number, requestId: number) => {
  try {
    const response = (await instance.patch(`project-request/${requestId}/approve`)).data
    const project = response.project
    in_progressTeams.value.push(response.team)
    toProjectRequests.value[projectId] = null
    console.log(project)
    console.log(projectStacks.value[project.id])

    if (publishedProjects.value) {
      if (project && inProgressProjects.value) {
        // Проверяем, нет ли уже этого проекта в списке
        if (!inProgressProjects.value.some(p => p.id === projectId)) {
          inProgressProjects.value.push(project);
          // Удаляем проект из опубликованных
          publishedProjects.value = publishedProjects.value.filter(p => p.id !== projectId);
        }
      }
    }

    openToProjectRequests.value = false

    toast.success('Команда назначена на проект')
  }
  catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
        toast.error(errorMessage);
  }
}

const changeRecruitment = async (project: IProjects) => {
  try {
    if (project.recruitment === 'open') {
      project.recruitment = (await instance.patch(`project/${project.id}/close`)).data.recruitment
      toast.success('Набор закрыт')
    }

    else if (project.recruitment === 'close') {
      project.recruitment = (await instance.patch(`project/${project.id}/open`)).data.recruitment
      toast.success('Набор открыт')
    }
  }
  catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
        toast.error(errorMessage);
  }
}

const completeProject = async (project: IProjects) => {
  try {
    const completedProject = (await instance.patch(`project/${project.id}/complete`)).data

    inProgressProjects.value = inProgressProjects.value!.filter(pr => pr.id !== project.id)

    completeProjects.value?.push(completedProject)

    toast.success('Проект завершен')
  }
  catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
        toast.error(errorMessage);
  }
}

const resignTeamFromProject = async (project: IProjects) => {
  try {
    const resignedProject = (await instance.patch(`project/${project.id}/resign-team`)).data

    inProgressProjects.value = inProgressProjects.value!.filter(pr => pr.id !== project.id)

    publishedProjects.value?.push(resignedProject)

    toast.success('Команда снята с проекта')
  }
  catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
        toast.error(errorMessage);
  }
}

onMounted(async () => {
    myProjects.value = (await instance.get('project/my')).data
    rialtos.value = (await instance.get('rialto')).data

    myProjects.value?.forEach(project => {
      projectStacks.value[project.id] = project.stack.replace('{', '').replace('}', '').split(',')
      toProjectRequests.value[project.id] = []
    })

    publishedProjects.value = myProjects.value?.filter(project => project.status === 'published') || null
    pendingProjects.value = myProjects.value?.filter(project => project.status === 'pending') || null
    inProgressProjects.value = myProjects.value?.filter(project => project.status === 'in_progress') || null
    completeProjects.value = myProjects.value?.filter(project => project.status === 'completed') || null
    revisionProjects.value = myProjects.value?.filter(project => project.status === 'revision') || null
    rejectedProjects.value = myProjects.value?.filter(project => project.status === 'rejected') || null

    if (publishedProjects.value?.length) {
      await Promise.all(
        publishedProjects.value.map(async (project) => {
          try {
            const requests = (await instance.get(`project-request/project/${project.id}`)).data;
            if (requests?.length) {
              toProjectRequests.value[project.id] = requests;
            }
          } catch (error) {
            console.error(`Ошибка при загрузке заявок для проекта ${project.id}:`, error);
          }
        })
      );
    }

    if (publishedProjects.value) {
  await Promise.all(
    publishedProjects.value.map(async (project) => {
      const requests = toProjectRequests.value[project.id];
      if (requests?.length) {
        await Promise.all(
          requests.map(async (request) => {
            try {
              const response = await instance.get(`teams/stack/${request.teamId}`);
              teamStacks.value[request.teamId] = response.data;
              teamMembers.value[request.team.teamLeaderId] = (await instance.get(`user/${request.team.teamLeaderId}`)).data
              const leaderAvatarUrl = await getAvatarUrl(request.team.teamLeaderId);
              avatarUrls.value[request.team.teamLeaderId] = leaderAvatarUrl ?? avatarAlt;

              await Promise.all(
                request.team.members.map(async member => {
                  teamMembers.value[Number(member)] = (await instance.get(`user/${member}`)).data
                  const memberAvatarUrl = await getAvatarUrl(Number(member));
                  avatarUrls.value[Number(member)] = memberAvatarUrl ?? avatarAlt;
                })
              )
            } catch (error) {
              console.error(`Ошибка при загрузке стека команды ${request.teamId}:`, error);
            }
          })
        );
      }
    })
  );

  await Promise.all(
    inProgressProjects.value!.map(async (project) => {
      try {
        in_progressTeams.value.push(((await instance.get(`teams/${project.teamId}`)).data))
      }
      catch (error) {
      console.error(`Ошибка при загрузке команды ${project.teamId}:`, error);
    }})
  )
}


    clearStack()
})
</script>