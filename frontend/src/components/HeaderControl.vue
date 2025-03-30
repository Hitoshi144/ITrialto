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
		<input type="radio" id="radio-1" name="tabs" :checked="route.name === 'projects-exchange'" />
		<label class="tab" for="radio-1" @click="router.push({name: 'projects-exchange'})">Биржа проектов</label>
		<input type="radio" id="radio-2" name="tabs" :checked="route.name === 'teams-registry'"/>
		<label class="tab" for="radio-2" @click="router.push({name: 'teams-registry'})"
    v-if="user?.role === 'teacher' || user?.role === 'student'"
    >Реестр команд</label>
		<transition name="glide" mode="out-in">
    <span class="glider" v-if="isHeaderRoute"></span>
    </transition>
	</div>
      </nav>
      <q-btn flat class="bg-accent" rounded>
      <div class="profile_logo">
        <img 
        :src="avatarUrl || avatarAlt" 
        alt="Аватар" 
        class="user-avatar"
      />
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
          <q-item clickable v-close-popup v-if="user?.role === 'teacher' || user?.role === 'student'">
            <q-item-section class="no-select"
            >Моя команда</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section class="no-select">Мои проекты</q-item-section>
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

  @media (max-width: 690px) {
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

@media (max-width: 700px) {
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
import { removeTokenFromLocalStorage } from 'src/helpers/localstorage.helper';
import { AuthService } from 'src/services/auth.service';
import { useUserStore } from 'src/store';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import avatarAlt from '../assets/avatar_alt.png'; // Добавьте этот импорт
import logoutImg from '../assets/logout.png'; // Добавьте этот импорт

  const userStore = useUserStore()

  const router = useRouter()
  const route = useRoute()

  const isHeaderRoute = computed( () => route.name === 'projects-exchange' || route.name === 'teams-registry')
  
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


  const logoutHandler = async () => {
    userStore.logout()
    removeTokenFromLocalStorage('token')
    await router.push({name: 'auth'})
  }

  onMounted(async () => {
  if (user.value?.id) {
    try {
      const response = await AuthService.getAvatar(user.value.id);
      if (response) {
        avatarUrl.value = URL.createObjectURL(response);
      }
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error);
    }
  }
});
  </script>