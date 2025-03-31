<template>
    <div class="teams_container">
      <div v-if="loading">Загрузка...</div>
      <div v-else-if="error">Ошибка при загрузке данных</div>
      <div v-else-if="!teams">Нет данных о командах</div>
      <div v-else>
        <q-table
          flat
          bordered
          :rows="teams"
          :columns="columns"
          hide-pagination
          row-key="id"
          style="border-radius: 15px; background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    backdrop-filter: blur(5px);
    box-shadow: 0 0px 1px 0 rgba(0, 0, 0, 0.37);
    border: 1px solid rgba(141, 183, 202, 0.342);
    width: 75vw;"
        >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.label }}
            </q-th>
            <q-th auto-width></q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.value }}
            </q-td>
            <q-td auto-width class="text-right">
      <q-btn 
        size="sm" 
        color="accent" 
        round 
        dense 
        @click="props.expand = !props.expand" 
        :icon="props.expand ? 'remove' : 'add'"
      />
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left q-pa-md">
                <div class="team-data-container">
                <div class="block" style="width: 60%; margin-right: 50px;">
                <div class="panel" style="width: 100%;">
                <p class="teamTitle">{{ props.row.title }}</p>
                </div>
                <div class="panel" style="width: 100%;">
                    <p class="description-title"><strong>Описание</strong></p>
                <p class="description">{{ props.row.description }}</p>
                </div>
                <p><strong>Статус:</strong> {{ props.row.currentProjectId ? "В работе" : "В поисках" }}</p>
                <p><strong>Приватность:</strong> {{ statusInterpretation[props.row.status] || props.row.status }}</p>
                <p><strong>Дата создания:</strong> {{ dateInterpretation(props.row.createdAt) }}</p>
              </div>
                <div class="panel" style="width: 40%;">
                <p><strong>Тим-лидер:</strong> {{ leaderNames[props.row.teamLeaderId] || 'Загрузка...' }}</p>
                </div>
              </div>
              </div>
            </q-td>
            
          </q-tr>
        </template>
    </q-table>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { instance } from 'src/api/axios.api';
  import type { ITeam, IUser } from '../types/types';

  const teams = ref<ITeam[] | null>(null);
  const loading = ref(true);
  const error = ref(false);

  const statusInterpretation: Record<string, string> = {
    close: "Закрыта",
    open: "Открыта"
  }

  const dateInterpretation = (date: string) => {
    const tempCreatedAt = new Date(date)
    const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(tempCreatedAt.getDate())}.${pad(tempCreatedAt.getMonth() + 1)}.${tempCreatedAt.getFullYear()}, ${pad(tempCreatedAt.getHours())}:${pad(tempCreatedAt.getMinutes())}`
  }

  const leaderNames = ref<Record<number, string>>({})

  const getUser = async (userId: number): Promise<void> => {
  if (!leaderNames.value[userId]) {
    try {
      const response = await instance.get<IUser>(`user/${userId}`);
      leaderNames.value[userId] = `${response.data.firstname} ${response.data.lastname}`;
    } catch {
      leaderNames.value[userId] = "Неизвестно";
    }
  }
}

  const columns = [
    {
      name: 'title',
      required: true,
      label: 'Название',
      align: 'left' as const, // Явное указание типа
      field: (row: ITeam) => row.title,
      sortable: true
    },
    
    {
      name: 'private',
      label: 'Приватность',
      align: 'left' as const,
      field: (row: ITeam) => statusInterpretation[row.status] || row.status,
      sortable: true
    },
    {
        name: 'members',
        label: 'Участники',
        align: 'center' as const,
        field: (row: ITeam) => row.members.length + 1,
        sortable: true
    },
    {
      name: 'status',
      label: 'Статус',
      align: 'left' as const,
      field: (row: ITeam) => row.currentProjectId ? "В работе" : "В поисках",
      sortable: true
    },
    {
      name: 'createdAt',
      label: 'Дата создания',
      align: 'left' as const,
      field: (row: ITeam) => dateInterpretation(row.createdAt),
      sortable: true
    }
  ];
  
  onMounted(async () => {
    try {
      const response = await instance.get<ITeam[]>('/teams');
      teams.value = response.data;

      await Promise.all(
      teams.value.map(team => getUser(team.teamLeaderId)))
    } catch (e) {
      console.error('Ошибка при загрузке команд:', e);
      error.value = true;
    } finally {
      loading.value = false;
    }
  });
  </script>
  
  <style>
  .teams_container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 97.93vh;
    background: 
      radial-gradient(circle, transparent 20%, rgba(253, 254, 255, 0.7) 20%, rgba(245, 249, 252, 0.7) 80%, transparent 80%, transparent),
      radial-gradient(circle, transparent 20%, rgba(231, 237, 241, 0.7) 20%, rgba(224, 238, 248, 0.7) 80%, transparent 80%, transparent) 15px 15px,
      linear-gradient(rgba(147, 177, 197, 0.7) 1.2px, transparent 1.2px) 0 -0.6px,
      linear-gradient(90deg, rgba(138, 181, 209, 0.7) 1.2px, rgba(224, 238, 248, 0.7) 1.2px) -0.6px 0;
    background-size: 30px 30px, 30px 30px, 15px 15px, 15px 15px;
  }

  p {
    margin: 0px;
  }

  .panel {
    background-color: white;
    padding: 13px;
    border-radius: 10px;
    margin: 20px;
    display: block;
    width: fit-content;
    background-color: rgba(65, 120, 156, 0.4);
    backdrop-filter: blur(5px);
    box-shadow: 0 0px 1px 0 rgba(0, 0, 0, 0.37);
    border: 1px solid rgba(141, 183, 202, 0.342);
  }

  .teamTitle {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: rgb(22, 47, 65);
    font-size: 24px;
    font-weight: 600;
  }

  .description-title {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: rgb(22, 47, 65);
    font-size: 18px;
    font-weight: 600;
  }

  .description {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: rgb(22, 47, 65);
    font-size: 16px;
    font-weight: 500;
  }

  .block {
    display: inline-block;
    width: auto;
  }

  .team-data-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  </style>