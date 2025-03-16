<template>
  <div class="flex flex-center items=center bg-blue-1" id="container">
    <div class="background">
      <div class="marquee" v-for="(line, index) in lines" :key="index" :class="{'reverse': index % 2 !== 0}">
        <span class="marquee-content">{{ line.toUpperCase() }}</span>
      </div>
    </div>

    <transition appear name="slide" mode="out-in">
    <q-card class="auth-card bg-blue-1" v-if="isAuth">
      <h4 class="text-center text-uppercase text-bold">Вход</h4>
      <div class="input-auth">
        <div class="inp-mail">
      <q-input standout="bg-primary text-white" v-model="mail" type="email" placeholder="Почта"
      :rules="[val => (val.includes('.') && val.includes('@')) || 'Введите почту']"
      lazy-rules
      >
        <template v-slot:before>
          <q-icon name="mail" />
        </template>
      </q-input>
      </div>
      <div class="inp-pass">
      <q-input standout="bg-primary text-white" v-model="password" :type="isPwd ? 'password' : 'text'" placeholder="Пароль">
        <template v-slot:before>
          <q-icon name="password" />
        </template>        
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      
        </div>
        <div class="auth-btn">
        <q-btn unelevated color="primary" label="Войти" text-color="white" padding="10px 50%" @click="loginHandler" />
        </div>
      <div class="newReg">
        <button class="newReg-btn" type="button" v-on:click="isAuth = ! isAuth">Создать новый аккаунт</button>
        </div>
      </div>
    </q-card>

    <q-card class="auth-card bg-blue-1" v-else-if="isAuth == false" >
      <h4 class="text-center text-uppercase text-bold">Регистрация</h4>
      <q-tabs class="text-primary" v-model="selectedRole">
        <q-tab name="parther" label="Партнер" />
        <q-tab name="student" label="Студент" />
        <q-tab name="teacher" label="Преподаватель" />
      </q-tabs>

      <transition appear name="fade" mode="out-in">
      <div class="input-auth" v-if="selectedRole === 'student'">
      <div class="inp-first-name">
        <q-input standout="bg-primary text-white" v-model="firstname" type="text" placeholder="Имя">
      </q-input>
      </div>
      <div class="inp-last-name">
        <q-input standout="bg-primary text-white" v-model="lastname" type="text" placeholder="Фамилия">
      </q-input>
      </div>
      <div class="inp-group">
        <q-input standout="bg-primary text-white" v-model="group" type="text" placeholder="Группа">
      </q-input>
      </div>
        <div class="inp-mail">
      <q-input standout="bg-primary text-white" v-model="mail" type="email" placeholder="Почта"
      :rules="[val => (val.endsWith('@std.tyuiu.ru')) || 'Введите почту ТИУ студента']"
      lazy-rules
      >
        <template v-slot:before>
          <q-icon name="mail" />
        </template>
      </q-input>
      </div>
      <div class="inp-pass">
      <q-input standout="bg-primary text-white" v-model="password" :type="isPwd ? 'password' : 'text'" placeholder="Пароль">
        <template v-slot:before>
          <q-icon name="password" />
        </template>        
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <div class="retry-pass">
        <q-input standout="bg-primary text-white" v-model="retryPassword" :type="isPwd ? 'password' : 'text'" placeholder="Повторите пароль">
          <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
          </template>
      </q-input>
      </div>
        </div>
        <div class="auth-btn">
        <q-btn unelevated color="primary" label="Создать аккаунт" text-color="white" padding="10px 50%" no-wrap @click="registrationHandler"/>
        </div>
        <div class="newReg">
        <button class="newReg-btn" type="button" v-on:click="isAuth = ! isAuth">Войти в аккаунт</button>
        </div>
      </div>

      <div class="input-auth" v-else-if="selectedRole === 'parther'">
      <div class="inp-first-name">
        <q-input standout="bg-primary text-white" v-model="firstname" type="text" placeholder="Имя">
      </q-input>
      </div>
      <div class="inp-last-name">
        <q-input standout="bg-primary text-white" v-model="lastname" type="text" placeholder="Фамилия">
      </q-input>
      </div>
        <div class="inp-mail">
      <q-input standout="bg-primary text-white" v-model="mail" type="email" placeholder="Почта"
      :rules="[val => (val.includes('.') && val.includes('@') && !(val.endsWith('@tyuiu.ru') || val.endsWith('@std.tyuiu.ru'))) || 'Введите корректную почту']"
      lazy-rules
      >
        <template v-slot:before>
          <q-icon name="mail" />
        </template>
      </q-input>
      </div>
      <div class="inp-pass">
      <q-input standout="bg-primary text-white" v-model="password" :type="isPwd ? 'password' : 'text'" placeholder="Пароль">
        <template v-slot:before>
          <q-icon name="password" />
        </template>        
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <div class="retry-pass">
        <q-input standout="bg-primary text-white" v-model="retryPassword" :type="isPwd ? 'password' : 'text'" placeholder="Повторите пароль">
          <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
          </template>
      </q-input>
      </div>
        </div>
        <div class="auth-btn">
        <q-btn unelevated color="primary" label="Создать аккаунт" text-color="white" padding="10px 50%" no-wrap @click="registrationHandler"/>
        </div>
        <div class="newReg">
        <button class="newReg-btn" type="button" v-on:click="isAuth = ! isAuth">Войти в аккаунт</button>
        </div>
      </div>

      <div class="input-auth" v-else-if="selectedRole === 'teacher'">
      <div class="inp-first-name">
        <q-input standout="bg-primary text-white" v-model="firstname" type="text" placeholder="Имя">
      </q-input>
      </div>
      <div class="inp-last-name">
        <q-input standout="bg-primary text-white" v-model="lastname" type="text" placeholder="Фамилия">
      </q-input>
      </div>
        <div class="inp-mail">
      <q-input standout="bg-primary text-white" v-model="mail" type="email" placeholder="Почта преподавателя ТИУ"
      :rules="[val => (val.endsWith('@tyuiu.ru')) || 'Введите почту ТИУ преподавателя']"
      lazy-rules
      >
        <template v-slot:before>
          <q-icon name="mail" />
        </template>
      </q-input>
      </div>
      <div class="inp-pass">
      <q-input standout="bg-primary text-white" v-model="password" :type="isPwd ? 'password' : 'text'" placeholder="Пароль">
        <template v-slot:before>
          <q-icon name="password" />
        </template>        
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <div class="retry-pass">
        <q-input standout="bg-primary text-white" v-model="retryPassword" :type="isPwd ? 'password' : 'text'" placeholder="Повторите пароль">
          <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
          </template>
      </q-input>
      </div>
        </div>
        <div class="auth-btn">
        <q-btn unelevated color="primary" label="Создать аккаунт" text-color="white" padding="10px 50%" no-wrap @click="registrationHandler"/>
        </div>
        <div class="newReg">
        <button class="newReg-btn" type="button" v-on:click="isAuth = ! isAuth">Войти в аккаунт</button>
        </div>
      </div>
      </transition>

    </q-card>
  </transition>


  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { setTokenToLocalStorage } from 'src/helpers/localstorage.helper'
import { AuthService } from 'src/services/auth.service'
import {ref} from 'vue'
import { toast } from 'vue3-toastify'
import { useUserStore } from 'src/store'
import { useRouter } from 'vue-router'
import { validateHeaderName } from 'http'

const router = useRouter()


  const mail =  ref<string>('')
  const password = ref<string>('')
  const firstname = ref<string>('')
  const lastname = ref<string>('')
  const group = ref<string>('')
  const retryPassword = ref<string>('')

  const isPwd = ref<boolean>(true)
  const isAuth = ref<boolean>(true)
  const selectedRole = ref<string>('student')

  const lines = ["ITrialto ".repeat(20),
        "ITrialto ".repeat(20),
        "ITrialto ".repeat(20),
        "ITrialto ".repeat(20),
        "ITrialto ".repeat(20),
        "ITrialto ".repeat(20),
        "ITrialto ".repeat(20),
        "ITrialto ".repeat(20),
        "ITrialto ".repeat(20),
        "ITrialto ".repeat(20),]

  const registrationHandler = async () => {
    try {
      if (password.value !== retryPassword.value) {
        toast.error('Пароли не совпадают')
        return
      }

      if (selectedRole.value != 'student') {
        group.value = ''
      }

      const data = await AuthService.registration({firstname: firstname.value, lastname: lastname.value, group: group.value, mail: mail.value, password: password.value, role: selectedRole.value})
      if (data) {
        toast.success('Аккаунт создан')
        mail.value = ''
        password.value = ''
        isAuth.value = !isAuth.value
      }
      else {
        toast.error('Что-то пошло не так')
      }
    }
    catch(err: any) {
      const error = err.response?.data.message
      toast.error(error)
    }
  }

  const loginHandler = async () => {
    try {
      const data = await AuthService.login({mail: mail.value, password: password.value})

      if (data) {
        setTokenToLocalStorage('token', data.token)
        useUserStore().login(data)
        await router.push({name: 'Home'})
      }
    }
    catch (err: any) {
      const error = err.response?.data.message
      console.log(err)
      toast.error(error)
    }
  }
</script>

<style>
  #container {
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;
  }

  h4 {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: x-large;
    color: #41789C;
  }

  .input-auth {
    margin-top: 50px;
    margin: 30px;
  }

  .inp-first-name, .inp-last-name, .inp-group, .retry-pass {
    margin-bottom: 20px;
    padding-left: 35px;
    width: min(50vw, 400px);
  }

  .retry-pass {
    margin-top: 20px;
  }

  .inp-mail {
    margin-bottom: 20px;
    width: min(50vw, 400px);
  }

  .inp-pass {
    width: min(50vw, 400px);
  }

  .auth-btn {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }

  .newReg {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .newReg-btn {
    border: none;
    background-color: transparent;
  }

  .newReg-btn:hover {
    color: #2779a7;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s ease;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

  .background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  overflow: hidden;
}

.marquee {
  white-space: nowrap;
  font-size: 5rem; /* Размер шрифта */
  color: #2779a7; /* Цвет текста */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 700;
  opacity: 15%;
  overflow: hidden;
  position: relative;
}

.marquee-content {
  display: inline-block;
  animation: marquee 600s linear infinite;
}

.marquee.reverse .marquee-content {
  animation-direction: reverse;

}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%); /* Сдвигаем текст на половину его ширины */
  }
}
</style>