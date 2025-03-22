<template>
    <div class="profile-component">
        <div class="card">
            <h3 style="margin: 0px; text-align: center;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            color: rgba(80, 147, 192, 1);
            font-weight: 500;
            ">Профиль</h3>
            <div class="card-top">
                <div class="avatar">
                    <img src="../assets/avatar_alt.png" class="user-avatar"/>
                    <p style="
                    background-color: #41789C;
                    margin-top: 5px;
                    padding: 5px;
                    border-radius: 10px;
                    color: aliceblue;
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    font-size: medium;
                    ">{{ rolesInterpritation[role as keyof typeof rolesInterpritation || 'withoutRole']}}</p>
                </div>
                <div class="main-data">
                    <q-input standout="bg-primary text-white" v-model="mail" label="Почта" type="email" style="margin-top: 20px; margin-bottom: 20px;" :readonly="!isEditing" />
                    <q-input standout="bg-primary text-white" v-model="firstname" label="Имя" type="text" style="margin-top: 20px; margin-bottom: 20px;" :readonly="!isEditing" />
                    <q-input standout="bg-primary text-white" v-model="lastname" label="Фамилия" type="text" style="margin-top: 20px; margin-bottom: 20px;" :readonly="!isEditing" />
                    <q-input standout="bg-primary text-white" v-model="group" label="Группа" type="text" style="margin-top: 20px; margin-bottom: 20px;" :readonly="!isEditing" />
                    <q-input standout="bg-primary text-white" v-model="phone" label="Телефон" type="tel" style="margin-top: 20px; margin-bottom: 20px;" :readonly="!isEditing" />
                    <p style="padding-left: 5px;">Дата регистрации: {{ createAt }}</p>
                </div>
            </div>
            <div class="card-bottom">
                <q-input outlined v-model="aboutMe" type="textarea" label="Обо мне" autogrow :readonly="!isEditing" />
            </div>
            <div class="actions">
    <!-- Контейнер для кнопки "Изменить" -->
    <transition name="fade-edit" mode="out-in">
      <div v-if="!isEditing" key="edit" class="edit-button-container">
        <q-btn
          color="primary"
          label="Изменить"
          @click="startEditing"
          class="action-button"
        />
      </div>
    </transition>

    <!-- Контейнер для кнопок "Сохранить" и "Отмена" -->
    <transition name="fade-save-cancel" mode="out-in">
      <div v-if="isEditing" key="save-cancel" class="save-cancel-buttons-container">
        <q-btn
          color="primary"
          label="Сохранить"
          @click="saveChanges"
          class="action-button"
        />
        <q-btn
        outline
          color="primary"
          label="Отмена"
          @click="cancelEditing"
          class="action-button"
        />
      </div>
    </transition>
  </div>
        </div>
    </div>
</template>

<style>
.profile-component {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    max-width: 100vw;
    height: 95vh;
    margin-top: 25px;
}

.card {
    border: 2px solid;
    border-radius: 25px;
    border-color: rgba(80, 147, 192, 0.3);
    padding: 50px;
}

.card-top {
    display: flex;
    flex-direction: row;
    padding: 50px;
}

.avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-right: 100px;
}

.user-avatar {
    height: 100px;
    width: auto;
}

.main-data {
    width: 30vw;
}

.actions {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px; /* Фиксированная высота для предотвращения сдвигов */
  margin-top: 20px;
}

/* Контейнер для кнопки "Изменить" */
.edit-button-container {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

/* Контейнер для кнопок "Сохранить" и "Отмена" */
.save-cancel-buttons-container {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
}

/* Базовая стилизация кнопок */
.action-button {
  margin: 0 5px; /* Отступ между кнопками */
}

/* Анимация для кнопки "Изменить" */
.fade-edit-enter-active,
.fade-edit-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-edit-enter-from {
  opacity: 0;
  transform: translateX(-20px) scale(0.9); /* Появление слева */
}

.fade-edit-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.9); /* Исчезновение вправо */
}

/* Анимация для кнопок "Сохранить" и "Отмена" */
.fade-save-cancel-enter-active,
.fade-save-cancel-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-save-cancel-enter-from {
  opacity: 0;
  transform: translateX(20px) scale(0.9); /* Появление слева */
}

.fade-save-cancel-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.9); /* Исчезновение вправо */
}

/* Задержка для появления кнопки "Изменить" */
.fade-edit-enter-active {
  transition-delay: 0.3s; /* Задержка для появления */
}

@media (max-width: 769px) {
    .card-top {
        flex-direction: column;
        justify-content: center;
        padding: 0px;
    }
    .avatar {
        margin: 0px;
    }

    .card {
        width: 90vw;
    }
    .main-data {
        width: 75vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
}

</style>

<script setup lang="ts">
import { AuthService } from 'src/services/auth.service';
import { IUserProfile } from 'src/types/types';
import { onMounted, ref } from 'vue';

const profile = ref<IUserProfile | null>(null);

const mail = ref<string>('');
const firstname = ref<string>('');
const lastname = ref<string>('');
const group = ref<string>('');
const phone = ref<string>('');
const createdDate = ref<string>('');
const aboutMe = ref<string>('');
const createAt = ref<string>('');
const role = ref<string>('');
const isEditing = ref<boolean>(false);

const rolesInterpritation = {
    parther: 'Партнер',
    student: 'Студент',
    teacher: 'Преподаватель',
    withoutRole: 'Без роли'
};

// Сохраняем исходные данные для отмены изменений
const originalData = ref<IUserProfile | null>(null);

onMounted(async () => {
    const data = await AuthService.getProfile();
    if (data) {
        profile.value = data;
        originalData.value = { ...data }; // Сохраняем копию данных

        mail.value = data.mail;
        firstname.value = data.firstname;
        lastname.value = data.lastname;
        group.value = data.group;
        phone.value = data.phone;
        createdDate.value = data.createAt;
        aboutMe.value = data.aboutMe || '';
        role.value = data.role;

        const createdAtDate = new Date(createdDate.value);
        createAt.value = `${createdAtDate.getDate()}.${createdAtDate.getMonth() + 1}.${createdAtDate.getFullYear()}, ${createdAtDate.getHours()}:${createdAtDate.getMinutes()}`;
    }
});

const startEditing = () => {
    isEditing.value = true;
};

const saveChanges = async () => {
    if (profile.value) {
        const updatedData = {
            ...profile.value,
            mail: mail.value,
            firstname: firstname.value,
            lastname: lastname.value,
            group: group.value,
            phone: phone.value,
            aboutMe: aboutMe.value
        };

        // Отправляем обновленные данные на сервер
        const response = await AuthService.updateProfile(updatedData);
        if (response) {
            profile.value = response;
            originalData.value = { ...response }; // Обновляем исходные данные
            isEditing.value = false; // Выходим из режима редактирования
        }
    }
};

const cancelEditing = () => {
    if (originalData.value) {
        // Восстанавливаем исходные данные
        mail.value = originalData.value.mail;
        firstname.value = originalData.value.firstname;
        lastname.value = originalData.value.lastname;
        group.value = originalData.value.group;
        phone.value = originalData.value.phone;
        aboutMe.value = originalData.value.aboutMe || '';
    }
    isEditing.value = false; // Выходим из режима редактирования
};
</script>