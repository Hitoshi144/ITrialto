<template>
    <div class="header">
      <div class="header_logo">
        <img 
        src="../assets/logo.png" 
        alt="Аватар" 
        class="logo avatar-image"
        @click="router.push({name: 'projects-exchange'})"
      />
        <h1 class="logo-text no-select">ITrialto</h1>
      </div>
      <nav>
        <div class="tabs">
		<input type="radio" id="radio-1" name="tabs" :checked="route.name === 'projects'" />
		<label class="tab" for="radio-1" @click="router.push({name: 'projects', params: {rialtoId: 4}})">Биржа проектов</label>
		<input type="radio" id="radio-2" name="tabs" :checked="route.name === 'teams-registry' || route.name === 'team-detail'"/>
		<label class="tab" for="radio-2" @click="router.push({name: 'teams-registry'})"
    v-if="user?.role === 'teacher' || user?.role === 'student'"
    >Реестр команд</label>
		<transition name="glide" mode="out-in">
    <span class="glider" v-if="isHeaderRoute"></span>
    </transition>
	</div>
      </nav>

      <div class="notif-profile">
      <q-btn flat class="bg-accent notifications-btn" color="secondary" style="border-radius: 10px;" icon="notifications" @click="notificationsMenu = true; onMenuShow()">
        <q-badge v-if="notifications.filter(n => !n.isRead).length > 0" color="primary" class="notif-count" floating :class="{ 'notification-pulse': socketStore.hasNewNotification }">{{ notifications.filter(n => !n.isRead).length }}</q-badge>
      <q-menu transition-show="jump-down" transition-hide="jump-up" transition-duration="300" fit :offset="[50, 5]">
        <q-list class="bg-secondary notifications-menu">
          
          <q-item v-for="notification in notifications" :key="notification.id" :class="{'notification-unread': !notification.isRead, 'notification-read': notification.isRead}">
          <div class="notification-tale">

          <div v-if="notification.type === 'teamJoinRequest'" class="notification-data">
            <q-icon name="person_add" class="notification-icon" size="30px" color="primary"/>
            <p class="notification-text">Пользователь <span>{{ notification.fromUser.firstname }} {{ notification.fromUser.lastname }}</span> хочет вступить в команду <span>{{ notification.team.title }}</span></p>
          </div>

          <div v-if="notification.type === 'userJoinedToTeam'" class="notification-data">
            <q-icon name="group_add" class="notification-icon" size="30px" color="primary"/>
            <p class="notification-text"><span>{{ notification.fromUser.firstname }} {{ notification.fromUser.lastname }}</span> присоеденился к команде <span>{{ notification.team.title }}.</span></p>
          </div>

          <div v-if="notification.type === 'approvedTeamJoin'" class="notification-data">
            <q-icon name="how_to_reg" class="notification-icon" size="30px" color="primary"/>
            <p class="notification-text">Заявка на вступление в команду <span>{{ notification.team.title }}</span> одобрена.</p>
          </div>

          <div v-if="notification.type === 'rejectedTeamJoin'" class="notification-data">
            <q-icon name="sentiment_dissatisfied" class="notification-icon" size="30px" color="primary"/>
            <p class="notification-text">Заявка на вступление в команду <span>{{ notification.team.title }}</span> отклонена</p>
          </div>

          <div v-if="notification.type === 'teamMemberRemoved'" class="notification-data">
            <q-icon name="person_remove" class="notification-icon" size="30px" color="primary"/>
            <p class="notification-text">Вас исключили из команды <span>{{ notification.team.title }}.</span></p>
          </div>

          <div v-if="notification.type === 'createTeamApproved'" class="notification-data">
            <q-icon name="diversity_3" class="notification-icon" size="30px" color="primary"/>
            <p class="notification-text">Создание команды <span>{{ notification.team.title }}</span> одобрено.</p>
          </div>

          <div v-if="notification.type === 'createTeamRejected'" class="notification-data">
            <q-icon name="group_remove" class="notification-icon" size="30px" color="primary"/>
            <p class="notification-text">Создание команды <span>{{ notification.message }}</span> отклонено.</p>
          </div>

          <div v-if="notification.type === 'publishedProject'" class="notification-data">
            <q-icon name="publish" class="notification-icon" size="30px" color="primary"/>
            <p class="notification-text">Ваш проект <span>{{ notification.project.title }}</span> опубликован.</p>
          </div>

          <div v-if="notification.type === 'rejectedProject'" class="notification-data">
            <q-icon name="unpublished" class="notification-icon" size="30px" color="primary"/>
            <p class="notification-text">Ваш проект <span>{{ notification.project.title }}</span> отклонен.</p>
          </div>

          <div v-if="notification.type === 'revisionProject'" class="notification-data">
            <q-icon name="report" class="notification-icon" size="30px" color="primary"/>
            <p class="notification-text">Ваш проект <span>{{ notification.project.title }}</span> отправлен на доработку.</p>
          </div>

          <div v-if="notification.type === 'notAssignedTeam'" class="notification-data">
            <q-icon name="cancel_schedule_send" class="notification-icon" size="30px" color="primary"/>
            <p class="notification-text">Заявка на проект <span>{{ notification.project.title }}</span> от команды <span>{{ notification.team.title }}</span> отклонена.</p>
          </div>

          <div v-if="notification.type === 'assignedTeam'" class="notification-data">
            <q-icon name="verified" class="notification-icon" size="30px" color="primary"/>
            <p class="notification-text">Заявка на проект <span>{{ notification.project.title }}</span> от команды <span>{{ notification.team.title }}</span> одобрена.</p>
          </div>

          <div v-if="notification.type === 'toProjectRequest'" class="notification-data">
            <q-icon name="hail" class="notification-icon" size="30px" color="primary"/>
            <p class="notification-text">Команда <span>{{ notification.team.title }}</span> отправила заявку на проект <span>{{ notification.project.title }}</span>.</p>
          </div>

          <div v-if="notification.type === 'resignedTeam'" class="notification-data">
            <q-icon name="group_off" class="notification-icon" size="30px" color="primary"/>
            <p class="notification-text">Команда <span>{{ notification.team.title }}</span> была снята с проекта <span>{{ notification.project.title }}</span>.</p>
          </div>

          <div v-if="notification.type === 'completeProject'" class="notification-data">
            <q-icon name="task_alt" class="notification-icon" size="30px" color="primary"/>
            <p class="notification-text">Команда <span>{{ notification.team.title }}</span> завершила проект <span>{{ notification.project.title }}</span>.</p>
          </div>

          <div style="display: flex; flex-direction: row; justify-content: space-between;">
          <p class="notification-date">{{ sharedDateInterpretation(notification.timestamp.toString()) }}</p>
          <p v-if="typeVerified(notification.type)" class="goTo" @click="notificationRedirect(notification)">Перейти</p>
          </div>
          <q-separator color="primary" />

          </div>

          </q-item>

        </q-list>

        </q-menu>
      </q-btn>

      <q-btn flat class="bg-accent notifications-btn" color="secondary" style="border-radius: 10px;" icon="chat" @click="router.push({name: 'chats'})">
        <q-badge v-if="newMessagesCount() !== 0" color="primary" class="notif-count" floating :class="{'notification-pulse': newMessagesCount() !== 0}">{{ newMessagesCount() }}</q-badge>
      </q-btn>


      <q-btn flat class="bg-accent" style="border-radius: 10px;" rounded>
      <div class="profile_logo">
        <img v-if="avatarUrl != null"
        :src="avatarUrl"
        class="user-avatar"
      />
      <img v-else :src="avatarAlt" class="user-avatar" />
        <div class="name_rule">
        <p class="name">{{ user?.firstname }} {{ user?.lastname }}</p>
        <q-badge rounded color="primary" style="font-size: smaller; font-weight: 600; opacity: 75%; justify-content: center; padding-top: 5px;">{{ rolesInterpritation[user?.role as keyof typeof rolesInterpritation || 'withoutRole'] }}</q-badge>
        </div>
      </div>
      <q-menu transition-show="jump-down" transition-hide="jump-up" transition-duration="300" fit :offset="[0, 5]">
        <q-list class="bg-secondary">
          <q-item clickable v-close-popup :to="{name: 'profile'}">
            <q-item-section class="no-select">Профиль</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-close-popup v-if="user?.role === 'teacher' || user?.role === 'student'" :to="{name: 'i-member'}">
            <q-item-section class="no-select"
            >Моя команда</q-item-section>
          </q-item>
          <q-item clickable v-close-popup :to="{name: 'my-projects', query: {tab: 'published'}}">
            <q-item-section class="no-select">Мои проекты</q-item-section>
          </q-item>
          <q-item clickable v-close-popup :to="{name: 'my-requests'}">
            <q-item-section class="no-select">Мои заявки</q-item-section>
          </q-item>
          <q-item clickable v-close-popup v-if="user?.role === 'teacher'" :to="{name: 'requests-moderation', query: {tab: 'teams'}}">
            <q-item-section class="no-select">Модерация заявок</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-close-popup @click="logoutHandler" class="logout">
            <q-item-section class="no-select">Выйти</q-item-section>
            <q-item-section avatar>
              <img :src="logoutImg" height="20px" width="auto">
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
      </q-btn>
      </div>
    </div>
  </template>
  
  <style scoped>
  .header {
    position: fixed;
    display: flex;
    align-items: center;
    width: 100vw;
    height: 60px;
    background: #41789c;
    padding: 0 20px;
    justify-content: space-between;
  }

  .logo {
    transition: transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  }

  .logo:hover {
    animation: smooth-rotation 3s linear infinite;
}
  
@keyframes smooth-rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
  
  .header_logo, .profile_logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .avatar-container {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  object-position: center;
  display: block;
}

  .logo {
    height: 50px;
    width: auto;
  }
  
  .logo-text {
    margin: 0;
    color:#E0EEF8;
    ;
    font-weight: 700;
    font-size: 2.5rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .name {
    margin: 0;
    color:#E0EEF8;
    ;
    font-size: 2.5rem;
    text-wrap: nowrap;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .profile_logo {
    height: 45px;
  }

  .profile_logo h1 {
    font-size: 1rem;
    font-weight: 400;
    margin: 0px;
  }

  .profile_logo img {
    height: 40px;
    width: auto;
  }

  .no-select {
    user-select: none;
  }

  .name {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: medium;
  }

  .name_rule {
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 817px) {
    

    .header_logo h1 {
      display: none;
    }
  }

  @media (max-width: 817px) {
    .name_rule {
      display: none;
    }
  }


  .logout {
    background-color: #E0EEF8;
    transition: background-color 0.3s ease;
  }
  .logout:hover {
    background-color: rgb(240, 125, 125);
  }

  .avatar-image {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.tabs {
	display: flex;
	position: relative;
	background-color:#5093c0;
	box-shadow: 0 0 1px 0 rgba(#185ee0, 0.15), 0 6px 12px 0 rgba(#185ee0, 0.15);
	padding: 0.75rem;
	border-radius: 99px; 
	* {
		z-index: 2;
	}
}

input[type="radio"] {
	display: none;
}

.tab {
	display: flex;
	align-items: center;
	justify-content: center;
  color: #E0EEF8;
	height: 25px;
	width: 175px;
	font-size: 1.25rem;
	font-weight: 500;
	border-radius: 99px; 
	cursor: pointer;
	transition: color 0.15s ease-in;
}

.notification-pulse {
  animation: pulse 3s ease-out;
}

@keyframes pulse {
  0% {
    background-color: red;
    box-shadow: 0 0 5px red;
  }
  70% {
    background-color: red;
    box-shadow: 0 0 10px red;
  }
  100% {
    background-color: var(--q-primary); /* Возвращаем стандартный цвет */
    box-shadow: none;
  }
}

.tab:hover {
  color: white;
}

input[type="radio"] {
	&:checked {
		& + label {
			color: white;
		}
	}
}

input[id="radio-1"] {
	&:checked {
		& ~ .glider {
			transform: translateX(0);
		}
	}
}

input[id="radio-2"] {
	&:checked {
		& ~ .glider {
			transform: translateX(100%);
		}
	}
}

input[id="radio-3"] {
	&:checked {
		& ~ .glider {
			transform: translateX(200%);
		}
	}
}

.glider {
	position: absolute;
	display: flex;
  opacity: 1;
  bottom: 5px;
	height: 40px;
	width: 175px;
	background-color: #8fbfe4;
	z-index: 1;
	border-radius: 99px; 
	transition: 0.25s ease-out;
}

.notifications-btn {
  width: 60px;
  height: 50px;
  margin-right: 10px;
}

.notif-profile {
  display: flex;
  overflow: hidden;
  flex-wrap: nowrap
}

.notif-count {
  margin-right: 10px;
  margin-top: 10px;
}

.notifications-menu {
  width: 40vw;
  max-width: 600px;
  min-width: 300px;
}

.notification-tale {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.notification-data {
  display: flex;
  flex-direction: row;
}

.notification-icon {
  margin-right: 10px;
  display: flex;
}

.notification-text {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 15px;
  color: #223c4d;

  span {
    color:#41789c;
    font-weight: 500;
  }
}

.notification-date {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: rgba(34, 60, 77, 0.7);
}

.goTo {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin-right: 20px;
  font-size: 15px;
  color: #223c4d;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: border-bottom-color 0.3s ease;
}

.goTo:hover {
  border-bottom-color: #223c4d; /* Цвет underline такой же, как и текст */
}

.notification-unread {
  background-color: rgba(65, 120, 156, 0.2);
  animation: fadeOutBackground 3s forwards;
}


@keyframes fadeOutBackground {
  from {
    background-color: rgba(65, 120, 156, 0.2);
  }
  to {
    background-color: transparent;
  }
}

.notification-read {
  background-color: transparent;
}

@media (max-width: 817px) {
	.tabs {
		transform: scale(0.8);
	}

}

.glide-enter-active,
.glide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glide-enter-from,
.glide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
  </style>
  
  <script setup lang="ts">
  /* eslint-disable @typescript-eslint/no-explicit-any */
import { removeTokenFromLocalStorage } from 'src/helpers/localstorage.helper';
import { AuthService } from 'src/services/auth.service';
import { useUserStore } from 'src/store';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import avatarAlt from '../assets/avatar_alt.png'; // Добавьте этот импорт
import logoutImg from '../assets/logout.png'; // Добавьте этот импорт
import { useSocketStore } from 'src/store/socket.store';
import { sharedDateInterpretation } from 'src/services/interpritation.service';
import type { INotification } from 'src/types/types';
import { toast } from 'vue3-toastify';
import { instance } from 'src/api/axios.api';

  const userStore = useUserStore()

  const socketStore = useSocketStore()

  const chats = computed(() => socketStore.chats)
  const messages = computed(() => socketStore.messages)

  const router = useRouter()
  const route = useRoute()

  const notifications = computed(() => socketStore.notifications)
  const notificationsMenu = ref<boolean>(false)

  const isHeaderRoute = computed( () => route.name === 'projects' || route.name === 'teams-registry' || route.name === 'team-detail')
  
  const getImageUrl = (name: string) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

const avatarUrl = ref(getImageUrl('avatar_alt.png'));

  const user = computed(() => userStore.getUser);

  const rolesInterpritation = {
    parther: 'Партнер',
    student: 'Студент',
    teacher: 'Преподаватель',
    withoutRole: 'Без роли'
  }

  const typeVerified = (type: string) => {
    switch (type){
      case 'userJoinedToTeam':
      case 'rejectedTeamJoin':
      case 'teamMemberRemoved':
      case 'createTeamRejected':
      case 'notAssignedTeam':
      case 'resignedTeam':
        return false
      default:
        return true
    }
  }

  const markNotificationAsRead = async (id: number) => {
    try {
      await instance.patch(`notifications/${id}/read`);
    // Используем метод хранилища для обновления состояния
    socketStore.markNotificationAsRead(id);
    }
    catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
        toast.error(errorMessage);
    }
  }

  const onMenuShow = () => {
  // Через 3 секунды помечаем все как прочитанные
  setTimeout(() => {
    const unreadNotifications = notifications.value.filter(n => !n.isRead);
    unreadNotifications.forEach(notification => {
      markNotificationAsRead(notification.id).catch(error => {
        console.error('Ошибка при пометке уведомления как прочитанного:', error);
      });
    });
  }, 3000);
};

  const logoutHandler = async () => {
    userStore.logout()
    removeTokenFromLocalStorage('token')
    await router.push({name: 'auth'})
  }

  const notificationRedirect = async (notification: INotification) => {
    try {
      switch (notification.type) {
        case 'teamJoinRequest':
        case 'assignedTeam':
          await router.push({name: 'i-teamleader', hash: `#team-${notification.teamId}`})
          break
        case 'createTeamApproved':
          await router.push({name: 'i-teamleader', hash: `#team-${notification.teamId}`})
          break
        case 'approvedTeamJoin':
          await router.push({name: 'i-member', hash: `#team-${notification.teamId}`})
          break
        case 'publishedProject':
        case 'toProjectRequest':
          await router.push({name: 'my-projects', query: {tab: 'published'}, hash: `#project-${notification.projectId}`})
          break
        case 'rejectedProject':
          await router.push({name: 'my-projects', query: {tab: 'rejected'}, hash: `#project-${notification.projectId}`})
          break
        case 'revisionProject':
          await router.push({name: 'my-projects', query: {tab: 'revision'}, hash: `#project-${notification.projectId}`})
          break
        case 'completeProject':
          await router.push({name: 'projects', params: {rialtoId: notification.project.rialtoId, projectId: notification.projectId}})
      }
    }
    catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
        toast.error(errorMessage);
    }
  }

  const newMessagesCount = () => {
    let count = 0

    chats.value.forEach(chat => {
      const chatMessages = messages.value[chat.id]
      if(!chatMessages) return;

      chatMessages.forEach(m => {
        if (!m.isRead && user.value && m.sender.id !== user.value.id) count += 1
      })
    })

    return count
  }

  onMounted(async () => {
  if (user.value?.id) {
    try {
      const response = await AuthService.getAvatar(user.value.id);
      if (response && response.size > 0) {
        avatarUrl.value = URL.createObjectURL(response);
      }
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error);
    }
  }
});
  </script>