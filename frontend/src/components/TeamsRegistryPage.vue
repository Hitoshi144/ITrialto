<template>
  <div class="teams_container">
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error">Ошибка при загрузке данных</div>
    <div v-else-if="!teams">Нет данных о командах</div>
    <div v-else style="width: 90vw; display: flex; justify-content: flex-start; flex-direction: column; align-items: center;">
      <q-input rounded outlined bg-color="grey-1" placeholder="Поиск" v-model="searchRequest" style="margin-top: 50px; width: 80%;">
      <template v-slot:append>
          <q-icon name="close" @click="searchRequest = ''" class="cursor-pointer" />
        </template>
        </q-input>
        <div class="panel description" >
        <p>Найденно команд: {{ filteredTeams.length }}</p>
        </div>
      <div class="content-wrapper">
      <div class="filters-container">
        <div class="filters">
          <p class="filters-title" style="text-align: center;">Фильтры</p>
          <q-separator />
          <p class="filters-part" style="text-align: center;"><strong>Приватность</strong></p>
          <div>
          <q-checkbox v-model="isOpen" label="Открыта" class="filters-part" />
          </div>
          <q-checkbox v-model="isClose" label="Закрыта" class="filters-part" />
          <q-separator />
          <p class="filters-part" style="text-align: center;"><strong>Статус</strong></p>
          <div>
          <q-checkbox v-model="inSearch" label="В поисках" class="filters-part" />
          </div>
          <q-checkbox v-model="inWork" label="В работе" class="filters-part" />
          <q-separator />
          <p class="filters-part" style="text-align: center;"><strong>Стек</strong></p>
          <div style="width: 90%; display: flex; justify-content: center; margin: 0; justify-self: center;">
          <q-btn 
            :filled="filteredStackCount() === 0 ? true : false" 
            :outline="filteredStackCount() === 0 ? false : true"
            dense 
            color="primary" 
            :label="filteredStackCount() === 0 ? 'Выбрать стек' : filteredStackCount() + ' ' + parametrWord(filteredStackCount())" 
            class="stack-btn"
            @click="chooseStack = true"
            style="border-radius: 10px;"
          />
          </div>
          <q-separator />
          <div style="width: 90%; display: flex; justify-content: center; margin: 0; justify-self: center;">
          <q-btn 
            outline 
            dense 
            color="primary" 
            label="Сбросить" 
            @click="resetFilters" 
            class="reset-btn"
            style="border-radius: 10px;"
          />
          </div>
        </div>
      </div>
      
      <div class="table-container">
        <q-table
          flat
          bordered
          :rows="filteredTeams"
          :columns="columns"
          :pagination="pagination"
          hide-pagination
          virtual-scroll
          :virtual-scroll-item-size="48"
          row-key="id"
          @row-click="onRowClick"
          style="border-radius: 15px; background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    backdrop-filter: blur(5px);
    box-shadow: 0 0px 1px 0 rgba(0, 0, 0, 0.37);
    border: 1px solid rgba(141, 183, 202, 0.342); width: 100%; height: auto; max-height: none;"
        >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              style="padding: 0; padding-left: 10px;"
            >
              {{ col.label }}
            </q-th>
            <q-th auto-width></q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props"
          @click="onRowClick($event, props.row)"
          :data-team-id="props.row.id"
          :class="{ 'selecet-row': expandedTeamId === props.row.id }"
          >
            
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              style="padding: 0; padding-left: 10px;"
            >
              {{ col.value }}
            </q-td>
            <q-td auto-width class="text-right">
      <q-btn 
        size="sm" 
        color="accent" 
        round 
        dense 
        @click.stop="toggleExpand(props.row.id)" 
        :icon="props.expand || expandedTeamId === props.row.id ? 'remove' : 'add'"
      />
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand || expandedTeamId === props.row.id" :props="props" class="expand-content">
            <q-td colspan="100%">
              <div class="text-left q-pa-md">
                <div class="team-data-container">
                <div class="block" style=" margin-right: 50px;">
                <div class="panel" style="width: 100%;">
                <p class="teamTitle">{{ props.row.title }}</p>
                </div>
                <div class="panel" style="width: 100%;">
                    <p class="description-title"><strong>Описание</strong></p>
                <p class="description">{{ props.row.description }}</p>
                </div>
              </div>
                <div class="panel team-info" >
                <p><strong>Тим-лидер:</strong> {{ leaderNames[props.row.teamLeaderId] || 'Загрузка...' }}</p>
                <p><strong>Дата создания:</strong> {{ dateInterpretation(props.row.createdAt) }}</p>
                <p><strong>Статус:</strong> {{ props.row.currentProjectId ? "В работе" : "В поисках" }}</p>
                <p><strong>Приватность:</strong> {{ statusInterpretation[props.row.status] || props.row.status }}</p>
                <p><strong>Количество участников:</strong> {{ props.row.members.length + 1 }}</p>
                </div>
              </div>

              <div v-if="teamStacks[props.row.id] != undefined && teamStacks[props.row.id]!.length > 0">
              <div class="stack-panel">
                <p class="description" style="align-self: center;">Стек технологий: </p>
                <div v-for="tech in teamStacks[props.row.id]" :key="tech">
                  <div class="stack-card">
                  <p>{{ tech }}</p>
                  </div>
                </div>
                </div>
              </div>
              <div v-else>
                <div class="stack-panel">
                <p class="description">Стек отсутствует</p>
                </div>
              </div>

              <div class="panel members-panel">
          <p class="members-title" style="text-align: center;">Участники</p>
          <div class="members-list">
            <!-- Панель тим-лидера -->
            <div class="panel member-item" v-if="leaderNames[props.row.teamLeaderId]">
            <q-badge color="accent" style="align-self: center; margin-bottom: 10px;" class="leader-badge">Тим-лидер</q-badge>
              <div class="member-info">
                <div class="member-avatar">
                  <img :src="avatarUrls[props.row.teamLeaderId] || defaultAvatar" @error="avatarUrls[props.row.teamLeaderId] = defaultAvatar" class="avatar-img">
                </div>
                <div class="member-details">
                  <p class="member-name">{{ leaderNames[props.row.teamLeaderId] }}</p>
                  <p class="member-email">{{ userEmails[props.row.teamLeaderId] || 'Загрузка...' }}</p>
                </div>
              </div>
            </div>
            
            <!-- Панели обычных участников -->
            <div class="panel member-item" v-for="memberId in props.row.members" :key="memberId">
              <div class="member-info">
                <div class="member-avatar">
                  <img :src="avatarUrls[memberId] || defaultAvatar" @error="avatarUrls[memberId] = defaultAvatar" class="avatar-img">
                </div>
                <div class="member-details">
                  <p class="member-name">{{ memberNames[memberId] || 'Загрузка...' }}</p>
                  <p class="member-email">{{ userEmails[memberId] || 'Загрузка...' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <q-btn v-if="!(props.row.members.includes(user!.id)) && user?.id != props.row.teamLeaderId && !isPendingRequest(props.row.id, props.row.teamLeaderId) && props.row.status === 'open'"
        filled
        color="primary"
        label="Подать заявку"
        @click="sendRequestToTeam(props.row.id)"
        style="border-radius: 10px; margin-left: 20px;"
        />
        <q-btn outline disable color="primary" v-else-if="isPendingRequest(props.row.id, props.row.teamLeaderId)" :label="user!.id === props.row.teamLeaderId ? 'Вы тим-лидер' : 'Заявка подана'" style="border-radius: 10px; margin-left: 20px;" />
        <q-btn outline disable color="primary" v-else-if="props.row.members.includes(user!.id)" label="Вы участник" style="border-radius: 10px; margin-left: 20px;" />

      </div>
                
            </q-td>
            
          </q-tr>
        </template>
    </q-table>
      </div>
    </div>

    <q-dialog v-model="chooseStack" maximized backdrop-filter="blur(4px)" transition-show="fade" transition-hide="fade">
      <q-card flat bordered class="team-edit-card" style="border-radius: 15px;">
        <q-card-section>
          <div style="display: flex; justify-content: space-between; flex-direction: row;">
            <p class="text-h5" style="color: #41789C;">Выберите стек</p>
            <q-btn flat color="primary" rounded icon="close" v-close-popup />
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
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
  </div>
</template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
  import { instance } from 'src/api/axios.api';
  import type { ITeam, ITeamRequests, IUser } from '../types/types';
import { useUserStore } from 'src/store';
import { toast } from 'vue3-toastify';
import { languages, devops, databases, frameworks } from '../types/technologies'
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()

const expandedTeamId = ref<number | null>(null)

const teams = ref<ITeam[] | null>(null);
  const loading = ref(true);
  const error = ref(false);

  const user = useUserStore().getUser

  const myPendingRequests = ref<ITeamRequests[]>([])

  const statusInterpretation: Record<string, string> = {
    close: "Закрыта",
    open: "Открыта"
  }

  const isOpen = ref<boolean>(false)
  const isClose = ref<boolean>(false)
  const inSearch = ref<boolean>(false)
  const inWork = ref<boolean>(false)

  const searchRequest = ref<string>('')

 const chooseStack = ref<boolean>(false)
const selectedStack = ref<Record<string, boolean>>({})


  const teamStacks = ref<Record<number, string[]>>({})


  const dateInterpretation = (date: string) => {
    const tempCreatedAt = new Date(date)
    const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(tempCreatedAt.getDate())}.${pad(tempCreatedAt.getMonth() + 1)}.${tempCreatedAt.getFullYear()}, ${pad(tempCreatedAt.getHours())}:${pad(tempCreatedAt.getMinutes())}`
  }

  const memberNames = ref<Record<number, string>>({});
  const userEmails = ref<Record<number, string>>({});
  const leaderNames = ref<Record<number, string>>({});

  const getImageUrl = (name: string) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

const toggleExpand = async (teamId: number) => {
  if (expandedTeamId.value === teamId) {
    await router.push({ name: 'teams-registry' })
    expandedTeamId.value = null;
  } else {
    await router.push({ name: 'team-detail', params: { teamId } });
    expandedTeamId.value = teamId;
  }
};

const scrollToExpandedTeam = async () => {
  await nextTick();
  if (expandedTeamId.value) {
    // Ищем конкретную строку по ID команды
    const rowElement = document.querySelector(`[data-team-id="${expandedTeamId.value}"]`);
    if (rowElement) {
      // Плавный скролл с небольшим отступом сверху
      rowElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Дополнительный скролл через 100мс для Q-Table
      setTimeout(() => {
        rowElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }
};

const avatarUrls = ref<Record<number, string>>({});
const avatarCache = ref<Record<number, string>>({});
const defaultAvatar = ref(getImageUrl('avatar_alt.png'));


const fetchAvatar = async (userId: number): Promise<void> => {
  try {
    const response = await instance.get(`user/avatar/${userId}`, {
      responseType: 'blob'
    });
    
    const avatarUrl = URL.createObjectURL(response.data);
    avatarCache.value[userId] = avatarUrl;
    avatarUrls.value[userId] = avatarUrl;
  } catch (error) {
    console.error(`Ошибка загрузки аватара для пользователя ${userId}:`, error);
    avatarUrls.value[userId] = defaultAvatar.value;
  }
};

const parametrWord = (count: number) => {
  if (count > 9) {
    if (count % 10 === 1 && Math.floor(count / 10) % 10 !== 1) {
      return 'параметр'
    }
    else if (count % 10 >= 2 && count % 10 <= 4 && Math.floor(count / 10) % 10 !== 1) {
      return 'параметра'
    }
    else {
      return 'параметров'
    }
  }
  else {
    if (count % 10 === 1) {
      return 'параметр'
    }
    else if (count % 10 >= 2 && count % 10 <= 4) {
      return 'параметра'
    }
    else {
      return 'параметров'
    }
  }
}

const clearStack = () => {
    languages.forEach(lang => selectedStack.value[lang] = false)
    frameworks.forEach(framework => selectedStack.value[framework] = false)
    databases.forEach(db => selectedStack.value[db] = false)
    devops.forEach(devop => selectedStack.value[devop] = false)
}

const fetchUserData = async (userId: number): Promise<void> => {
  if (!memberNames.value[userId] && !userEmails.value[userId] && !leaderNames.value[userId]) {
    try {
      const response = await instance.get<IUser>(`user/${userId}`);
      const fullName = `${response.data.firstname} ${response.data.lastname}`;
      memberNames.value[userId] = fullName;
      leaderNames.value[userId] = fullName;
      userEmails.value[userId] = response.data.mail;
    } catch {
      const unknown = "Неизвестно";
      memberNames.value[userId] = unknown;
      leaderNames.value[userId] = unknown;
      userEmails.value[userId] = unknown;
    }
  }
};

const isPendingRequest = (teamId: number, teamLeaderId: number) => {
  return myPendingRequests.value.some(req => req.teamId === teamId) || teamLeaderId === user!.id
}

const cutTextLength = (text: string) => {
  const maxLength = 20
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
}

const pagination = ref({
  rowsPerPage: 0 // 0 означает "показать все строки"
});

  const columns = [
    {
      name: 'title',
      required: true,
      label: 'Название',
      align: 'left' as const, // Явное указание типа
      field: (row: ITeam) => cutTextLength(row.title),
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
        sortable: true,
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

  const filteredTeams = computed(() => {
  if (!teams.value) return [];
  
  return teams.value.filter(team => {
    // Фильтрация по поисковому запросу
    const matchesSearch = searchRequest.value === '' || 
      team.title.toLowerCase().includes(searchRequest.value.toLowerCase()) || 
      team.description.toLowerCase().includes(searchRequest.value.toLowerCase());
    
    // Фильтрация по приватности
    const matchesPrivacy = 
      (!isOpen.value && !isClose.value) || // если ничего не выбрано - пропускаем все
      (isOpen.value && team.status === 'open') || 
      (isClose.value && team.status === 'close');

    const matchedStack = filteredStackCount() === 0 || stackFilter(team.id)
    
    // Фильтрация по статусу
    const matchesStatus = 
      (!inSearch.value && !inWork.value) || // если ничего не выбрано - пропускаем все
      (inSearch.value && !team.currentProjectId) || 
      (inWork.value && team.currentProjectId);
    
    return matchesSearch && matchesPrivacy && matchesStatus && matchedStack;
  });
});

const resetFilters = () => {
  isOpen.value = false;
  isClose.value = false;
  inSearch.value = false;
  inWork.value = false;
  searchRequest.value = '';

  clearStack()
};

const sendRequestToTeam = async (teamId: number) => {
  const userId = useUserStore().getUser?.id
  try {
    await instance.post('/team-request', {userId: userId, teamId: teamId})

    myPendingRequests.value = (await instance.get<ITeamRequests[]>(`team-request/${user?.id}`)).data

    toast.success('Заявка подана')
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  catch(err: any) {
      const error = err.response?.data.message
      toast.error(error)
    }
}

  const loadStack = async (teamId: number): Promise<string[]> => {
    try {
    const response = await instance.get(`/teams/stack/${teamId}`);
    return response.data; // Предполагаем, что сервер возвращает string[]
  } catch (error) {
    console.error(`Ошибка загрузки стека для команды ${teamId}:`, error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
  } 

  const filteredStackCount = () => {
  let count = 0

  languages.forEach(lang => {
    if (selectedStack.value[lang] === true) {
      count += 1
    }
  })

  databases.forEach(db => {
    if (selectedStack.value[db] === true) {
      count += 1
    }
  })

  devops.forEach(devop => {
    if (selectedStack.value[devop] === true) {
      count += 1
    }
  })

  frameworks.forEach(framework => {
    if (selectedStack.value[framework] === true) {
      count += 1
    }
  })
  
  return count
 }

 const stackFilter = (teamId: number) => {
  let flag = true
  
  languages.forEach(lang => {
    if (selectedStack.value[lang] === true && teamStacks.value[teamId]?.includes(lang) === false) {
      flag = false
    }
  })

  databases.forEach(db => {
    if (selectedStack.value[db] === true && teamStacks.value[teamId]?.includes(db) === false) {
      flag = false
    }
  })

  frameworks.forEach(framework => {
    if (selectedStack.value[framework] === true && teamStacks.value[teamId]?.includes(framework) === false) {
      flag = false
    }
  })

  devops.forEach(devop => {
    if (selectedStack.value[devop] === true && teamStacks.value[teamId]?.includes(devop) === false) {
      flag = false
    }
  })

  return flag
 }

 const onRowClick = async (event: Event, row: ITeam) => {
  if (expandedTeamId.value === row.id) {
    await router.push({ name: 'teams-registry' });
    expandedTeamId.value = null;
  } else {
    await router.push({ name: 'team-detail', params: { teamId: row.id } });
    expandedTeamId.value = row.id;
    await scrollToExpandedTeam();
  }
};

watch(() => route.params.teamId, async (newTeamId) => {
  if (newTeamId) {
    const teamId = Number(newTeamId);
    if (teams.value?.some(team => team.id === teamId)) {
      expandedTeamId.value = teamId;
      await nextTick();
      await scrollToExpandedTeam();
    }
  }
}, { immediate: true });
  
 const handleBackButton = () => {
  if (route.params.teamId) {
    expandedTeamId.value = Number(route.params.teamId);
  } else {
    expandedTeamId.value = null;
  }
};

  onMounted(async () => {
  try {
    window.addEventListener('popstate', handleBackButton);

    const response = await instance.get<ITeam[]>('/teams/all');
    teams.value = response.data;

    clearStack()

    myPendingRequests.value = (await instance.get<ITeamRequests[]>(`team-request/${user?.id}`)).data

    const allUserIds = new Set<number>();
    teams.value.forEach(team => {
      allUserIds.add(team.teamLeaderId);
      team.members.forEach(memberId => allUserIds.add(Number(memberId)));
    });

    await Promise.all(
      teams.value.map(async team => {
        teamStacks.value[team.id] = await loadStack(team.id)
      })
    )

    await Promise.all([
      ...Array.from(allUserIds).map(id => fetchUserData(id)),
      ...Array.from(allUserIds).map(id => fetchAvatar(id))
    ]);

    if (route.params.teamId) {
      const teamId = Number(route.params.teamId)
      if (teams.value.some(team => team.id === teamId)) {
        expandedTeamId.value = teamId
        await nextTick()
        setTimeout(() => {
  scrollToExpandedTeam().catch(e => console.error('Scroll error:', e));
}, 300);
      }
    }
  } catch (e) {
    console.error('Ошибка при загрузке команд:', e);
    error.value = true;
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  // Освобождаем объектные URL для избежания утечек памяти
  Object.values(avatarCache.value).forEach(url => {
    URL.revokeObjectURL(url);
  });

  window.removeEventListener('popstate', handleBackButton);
});
  </script>
  
  <style scoped>
html {
  scroll-behavior: smooth;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.selected-row {
  background-color: rgba(65, 120, 156, 0.1);
}

.q-table__container {
  scroll-behavior: smooth;
}

[data-team-id] {
  scroll-margin-top: 20px;
}

  .teams_container {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100dvh;
  padding: 20px;
  padding-bottom: 0;
  box-sizing: border-box;
  background: 
    radial-gradient(circle, transparent 20%, rgba(253, 254, 255, 0.7) 20%, rgba(245, 249, 252, 0.7) 80%, transparent 80%, transparent),
    radial-gradient(circle, transparent 20%, rgba(231, 237, 241, 0.7) 20%, rgba(224, 238, 248, 0.7) 80%, transparent 80%, transparent) 15px 15px,
    linear-gradient(rgba(147, 177, 197, 0.7) 1.2px, transparent 1.2px) 0 -0.6px,
    linear-gradient(90deg, rgba(138, 181, 209, 0.7) 1.2px, rgba(224, 238, 248, 0.7) 1.2px) -0.6px 0;
  background-size: 30px 30px, 30px 30px, 15px 15px, 15px 15px;
  background-attachment: local;
}

.content-wrapper {
  display: flex;
  margin-top: 20px;
  width: 100%;
  max-width: 1400px;
  gap: 20px;
}



.filters-container {
  position: sticky;
  top: 80px;
  height: fit-content;
  align-self: flex-start;
}



.filters {
  width: 200px;
  padding: 15px;
  border-radius: 15px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  backdrop-filter: blur(5px);
  box-shadow: 0 0px 1px 0 rgba(0, 0, 0, 0.37);
  border: 1px solid rgba(141, 183, 202, 0.342);
}

@media (max-width: 700px) {
  .content-wrapper{
  flex-direction: column;
  min-height: fit-content;
  }

  .filters-container {
    position: static;
    width: 100%;
    margin-bottom: 20px;
    order: -1;
  }

  .filters {
    width: 100%;
  }
}

.table-container {
  height: auto !important;
  flex: 1;
  min-width: 0;
  overflow: visible !important;
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
    max-width: 100%;
    box-sizing: border-box;
    background-color: rgba(65, 120, 156, 0.4);
    backdrop-filter: blur(5px);
    box-shadow: 0 0px 1px 0 rgba(0, 0, 0, 0.37);
    border: 1px solid rgba(141, 183, 202, 0.342);
  }

  .stack-panel {
    background-color: white;
    padding: 13px;
    border-radius: 10px;
    margin: 20px;
    display: flex;
    width: fit-content;
    flex-direction: row;
    flex-wrap: wrap;
    max-width: 100%;
    box-sizing: border-box;
    background-color: rgba(65, 120, 156, 0.4);
    backdrop-filter: blur(5px);
    box-shadow: 0 0px 1px 0 rgba(0, 0, 0, 0.37);
    border: 1px solid rgba(141, 183, 202, 0.342);
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

  .teamTitle, .filters-title {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: rgb(22, 47, 65);
    font-size: 24px;
    font-weight: 600;
  }

  .description-title, .members-title {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: rgb(22, 47, 65);
    font-size: 18px;
    font-weight: 500;
  }

  .stack-btn {
  margin: 0px auto 20px auto !important;
  justify-content: center !important;
  align-items: center !important;
  display: flex !important;
  padding: 0 16px; /* или любые другие значения по вашему вкусу */
  width: 100%;
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


.technologies {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 50px;
  }

  .stack-container {
    display: flex;
    justify-self: center;
    max-width: 1200px;
  }

  .description, .filters-part {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: rgb(22, 47, 65);
    font-size: 16px;
    font-weight: 500;
  }

  .teamTitle, .description {
    word-wrap: break-word;
    word-break: break-word; /* Более агрессивный перенос для длинных слов */
    overflow-wrap: break-word;
    max-width: 100%;
    white-space: normal;
  }

  .block {
    display: inline-block;
    flex: 1;
    min-width: 300px;
    max-width: calc(60% - 20px);
    margin-right: 20px;
  }

  .team-data-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .team-info {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: rgb(22, 47, 65);
    font-size: 1rem;
    flex: 1 1 30%;
    min-width: 300px;
  }

  .member-name, .member-email {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: rgb(22, 47, 65);
    font-size: 0.9rem;
    font-weight: 500;
  }

  .member-info {
    display: flex;
    flex-direction: row;
    text-align: center;
  }

  .member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
  background-color: #eee;
  position: relative;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
  z-index: 1;
}

/* Фолбэк аватар (показывается только если основное изображение не загрузилось) */
.member-avatar::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../assets/avatar_alt.png');
  background-size: cover;
  z-index: 0;
}

.member-item {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.members-list {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  gap: 15px;
}

.reset-btn, .reset-btn .block  {
  margin: 5px auto 5px auto !important;
  justify-content: center !important;
  align-items: center !important;
  display: flex !important;
  padding: 0 16px; /* или любые другие значения по вашему вкусу */
  width: 100%;
}

.expandable-row {
  transition: all 0.3s ease;
}

.expand-content {
  animation: fadeIn 0.3s ease-out;
  overflow: hidden;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    max-height: 500px; /* Примерное значение, подберите под ваш контент */
    transform: translateY(0);
  }
}

/* Для плавного сворачивания */
.q-table__expandable-row {
  transition: all 0.3s ease;
}

.q-table__expandable-row--closed {
  opacity: 0;
  max-height: 0;
  padding: 0;
  border: none;
}

  </style>