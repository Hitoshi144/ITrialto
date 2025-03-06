<template>
  <div class="flex flex-center items=center bg-blue-1" id="container">
    <div class="background">
      <div class="marquee" v-for="(line, index) in lines" :key="index" :class="{'reverse': index % 2 !== 0}">
        <span class="marquee-content">{{ line.toUpperCase() }}</span>
      </div>
    </div>

    <transition appear name="fade" mode="out-in">
    <q-card flat bordered class="auth-card" v-if="isAuth">
      <h4 class="text-center text-uppercase text-bold">Вход</h4>
      <div class="input-auth">
        <div class="inp-mail">
      <q-input standout="bg-blue-9 text-white" v-model="mail" type="email" placeholder="Почта">
        <template v-slot:before>
          <q-icon name="mail" />
        </template>
      </q-input>
      </div>
      <div class="inp-pass">
      <q-input standout="bg-blue-9 text-white" v-model="password" :type="isPwd ? 'password' : 'text'" placeholder="Пароль">
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
        <q-input standout="bg-blue-9 text-white" v-model="retryPassword" :type="isPwd ? 'password' : 'text'" placeholder="Повторите пароль">
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
        <q-btn unelevated color="blue-9" label="Войти" text-color="white" padding="10px 50%"/>
        </div>
      <div class="newReg">
        <button class="newReg-btn" type="button" v-on:click="isAuth = ! isAuth">Создать новый аккаунт</button>
        </div>
      </div>
    </q-card>

    <q-card flat bordered class="auth-card" v-else-if="isAuth == false">
      <h4 class="text-center text-uppercase text-bold">Регистрация</h4>
      <div class="input-auth">
      <div class="inp-first-name">
        <q-input standout="bg-blue-9 text-white" v-model="firstname" type="text" placeholder="Имя">
      </q-input>
      </div>
      <div class="inp-last-name">
        <q-input standout="bg-blue-9 text-white" v-model="lastname" type="text" placeholder="Фамилия">
      </q-input>
      </div>
      <div class="inp-group">
        <q-input standout="bg-blue-9 text-white" v-model="group" type="text" placeholder="Группа">
      </q-input>
      </div>
        <div class="inp-mail">
      <q-input standout="bg-blue-9 text-white" v-model="mail" type="email" placeholder="Почта">
        <template v-slot:before>
          <q-icon name="mail" />
        </template>
      </q-input>
      </div>
      <div class="inp-pass">
      <q-input standout="bg-blue-9 text-white" v-model="password" :type="isPwd ? 'password' : 'text'" placeholder="Пароль">
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
        <q-input standout="bg-blue-9 text-white" v-model="retryPassword" :type="isPwd ? 'password' : 'text'" placeholder="Повторите пароль">
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
        <q-btn unelevated color="blue-9" label="Создать аккаунт" text-color="white" padding="10px 50%" no-wrap/>
        </div>
        <div class="newReg">
        <button class="newReg-btn" type="button" v-on:click="isAuth = ! isAuth">Войти в аккаунт</button>
        </div>
      </div>
    </q-card>
  </transition>


  </div>
</template>

<script setup lang="ts">
  import {ref} from 'vue'

  const mail =  ref<string>('')
  const password = ref<string>('')
  const firstname = ref<string>('')
  const lastname = ref<string>('')
  const group = ref<string>('')
  const retryPassword = ref<string>('')

  const isPwd = ref<boolean>(true)
  const isAuth = ref<boolean>(true)

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
</script>

<style>
  #container {
    width: 100vw;
    height: 100vh;
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