<template>
<div class="container">
    <div class="window">

        <div class="chats-panel beautiful-bg-2 no-select">
            <div class="chats-creating">
            <q-btn class="add-group-btn" color="primary" outline icon="add" label="групповой чат" @click="creatingGroupChat = true; userRequest = ''"/>
            <q-input class="user-search" dense rounded outlined label="Поиск" v-model="userRequest" color="primary" :loading="isLoading" />
            </div>

            <div v-if="chats.length > 0 && userRequest.trim() === ''">
            <div class="chat-card" v-for="chat in chats" :key="chat.id" style="color: black;" @click="setCurrentChat(chat); void nextTick(() => scrollToBottomInstant())">
                <img v-if="!chat.isGroup" class="user-avatar" :src="getParticipantAvatar(chat)" />
                <img v-else-if="chat.isGroup" class="user-avatar" :src="getChatAvatar(chat.id)" />
                <div class="chat-info">
                    <div class="chat-header">
                    <p class="chat-title" v-if="!chat.isGroup">{{ getChatParticiapnt(chat)?.firstname }} {{ getChatParticiapnt(chat)?.lastname }}</p>
                    <p class="chat-title" v-else>{{ chat.name }}</p>
                    <p class="chat-date" v-if="getLastMessageContent(chat.id)">{{ formatSmartDate(getLastMessageTime(chat.id)) }}</p>
                    </div>

                    <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
                    <p class="chat-last-message" v-if="!chat.isGroup && getLastMessageContent(chat.id)">{{ getLastMessageContent(chat.id) }}</p>
                    <p class="chat-last-message" v-else-if="chat.isGroup && chat.messages && getLastMessageSenderId(chat.id) !== user!.id "><strong>{{ getLastMessageSender(chat.id) }}:</strong> {{ getLastMessageContent(chat.id) }}</p>
                    <p class="chat-last-message" v-else-if="chat.messages && getLastMessageSenderId(chat.id) === user!.id"><strong>Вы:</strong> {{ getLastMessageContent(chat.id) }}</p>
                    <q-icon :name="getLastMessageIsRead(chat.id) ? 'done_all' : 'check'" v-if="chat.messages && getLastMessageSenderId(chat.id) === user!.id" 
                    style="margin-right: 20px;" size="18px" color="primary"/>
                    <p v-else-if="chat.messages && getLastMessageSenderId(chat.id) !== user!.id && getUnreadCount(chat.id) !== 0"
                    class="unread-in-chat">{{ getUnreadCount(chat.id) }}</p>
                    </div>
                </div>
            </div>
            </div>

            <div v-else-if="userRequest.trim() !== ''" class="search-results-container">
                <div class="search-results-scroll">
                <div  v-for="user in searchResults" :key="user.id" @click="currentChat = undefined; beginingChat = true; selectedUser = user">
                <div class="chat-card" v-if="notHaveChat(user.id)">
                  <img class="user-avatar" :src="getAvatarUrl(user.id)" />
                <div class="chat-info">
                    <div class="chat-header">
                        <p class="chat-title">{{ user.firstname }} {{ user.lastname }}</p>
                    </div>
                </div>
                </div>
                </div>
            </div>
            </div>

            <p v-else>
                чатов нет
            </p>
        </div>

        <div class="current-chat beautiful-bg">
            <div v-if="currentChat" class="chat-container">

                <div class="messages-header">
                  <div style="display: flex; flex-direction: row; align-items: center;">
                    <img v-if="!currentChat.isGroup" class="user-avatar" :src="getParticipantAvatar(currentChat)" />
                    <img v-else-if="currentChat.isGroup" class="user-avatar" :src="getChatAvatar(currentChat.id)" />
                    <div>
                    <p class="chat-header-title onHover" v-if="currentChat.isGroup" @click="showChatDetails = true">{{ currentChat.name }}</p>
                    <p class="chat-header-title" v-else-if="!currentChat.isGroup">{{ getParticiapnt()?.firstname }} {{ getParticiapnt()?.lastname }}</p>
                    <p class="participants-count" v-if="currentChat.isGroup">{{ currentChat.participants.length }} {{ participantsInterpritaion(currentChat.participants.length) }}</p>
                    </div>
                    </div>
                    <q-btn flat icon="more_horiz" color="secondary" style="margin-right: 20px;">
                      <q-menu class="bg-secondary">
                        <q-list style="width: 200px;">
                          <q-item clickable v-close-popup style="display: flex; align-items: center;" class="red-on-hover" @click="deleteChat()">
                            <q-item-section style="color: #eb6449;">Удалить чат</q-item-section>
                            <q-icon name="delete" color="negative" size="20px"/>
                          </q-item>

                        </q-list>
                      </q-menu>
                    </q-btn>
                </div>

                <div class="messages-container" @scroll="handleScroll">
                <div v-for="message in messages[currentChat.id]" :key="message.id" :ref="(el) => message.sender.id !== user!.id && observeMessage(el, message.id)">
                    <q-chat-message style="margin-right: 10px; margin-top: 10px;" v-if="message.sender.id === user!.id" sent
                    :avatar="!getNextSenderId(message) ? undefined : getAvatarUrl(user!.id)"
                    bg-color="primary"
                    text-color="secondary"
                    :style="!getNextSenderId(message) ? {'margin-right': '65px'} : null"
                    >
                        <div>
                            {{ message.content }}
                        <div class="q-message-stamp" style="display: flex; flex-direction: row; justify-content: flex-end; align-items: center;">
                            <div>{{ formatSmartDate(message.createdAt) }}</div>

                            <transition name="fade" mode="out-in">
                            <q-icon class="q-message-stamp" style="display: flex; justify-self: flex-end; margin: 0; margin-left: 5px;" :name="message.isRead ? 'done_all' : 'check'" size="18px" />
                            </transition>
                            </div>
                        </div>
                    </q-chat-message>

                    <q-chat-message style="margin-left: 10px; margin-top: 10px;" v-else-if="message.sender.id !== user!.id" :stamp="formatSmartDate(message.createdAt)"
                    :avatar="!getNextSenderId(message) ? undefined : getAvatarUrl(message.sender.id)"
                    bg-color="secondary"
                    :style="!getNextSenderId(message) ? {'margin-left': '65px'} : null"
                    >
                        <div>
                            <div v-if="currentChat.isGroup && getPreviousSenderId(message)" style="margin-bottom: 5px; color: #202226;"><strong>{{ message.sender.firstname }}</strong></div>
                            <div>{{ message.content }}</div>
                        </div>
                    </q-chat-message>

                    
                </div>
                <q-chat-message v-if="chatting[currentChat.id]" bg-color="secondary" style="margin-left: 65px;margin-top: 10px;">
                        <q-spinner-dots size="2rem" />
                    </q-chat-message>

                    <div 
                      v-if="shouldShowNewMessagesAlert"
                      class="new-messages-alert" 
                      @click="smoothScrollToBottom"
                    >
                      <q-icon name="keyboard_arrow_down" size="24px" />
                      <q-tooltip>Новые сообщения</q-tooltip>
                    </div>
                </div>

                <div class="input-message-panel">
                    <q-input class="input-message" borderless v-model="myMessage" dense :label="shadowText" @keyup.enter="myMessage.trim() !== '' && sendMessage(currentChat.id, myMessage)"/>
                    <q-btn class="send-btn" :disable="myMessage.trim() === '' ? true : false" flat round icon="send" @click="sendMessage(currentChat.id, myMessage)" />
                </div>
            </div>

            <div style="width: 100%; height: 100%; display: flex; flex-direction: column;" v-else-if="beginingChat && currentChat === undefined && selectedUser && userRequest !== ''">
                <div class="messages-header" style="justify-content: flex-start;">
                    <img class="user-avatar" :src="getAvatarUrl(selectedUser.id)" />
                    <div>
                    <p class="chat-header-title">{{ selectedUser?.firstname }} {{ selectedUser?.lastname }}</p>
                    </div>
                </div>
                <div class="messages-container" />
                <div class="input-message-panel">
                    <q-input class="input-message" borderless v-model="myMessage" dense :label="shadowText" @keyup.enter="myMessage.trim() !== '' && createPrivateChat(selectedUser.id)"/>
                    <q-btn class="send-btn" :disable="myMessage.trim() === '' ? true : false" flat round icon="send" @click="createPrivateChat(selectedUser!.id)" />
                </div>
            </div>

            <div v-else>

            </div>
        </div>
    </div>

    <q-dialog v-model="creatingGroupChat" @before-hide="creatingChatName = ''; addingParticipant = false; creatingSelectedUsers = []; addParticipantRequest = ''" 
    @before-show="addingParticipant = true">
        <q-list class="chat-details">
          <p class="participants-title">Введите название чата</p>
          <q-input outlined label="название" v-model="creatingChatName" 
          style="width: 80%;margin-top: 10px;"
          :rules="[val => !!val || 'Введите название чата']"/>

          <p class="participants-title">Выберите участников чата</p>

          <div v-if="addingParticipant" style="width: 90%; display: flex; flex-direction: column; align-items: center;">
        <q-input class="user-search" dense rounded outlined label="Поиск" v-model="addParticipantRequest" color="primary" :loading="isLoading" />

        <div v-if="addParticipantRequest.trim() !== ''" class="adding-participants-list search-results-scroll">
          <div v-for="user in searchResults" :key="user.id">
            <div v-if="itsNotMe(user.id)" class="participants-intersection">
            <img class="user-avatar" :src="getAvatarUrl(user.id)" />
            <div style="display: flex; flex-direction: column;">
              <p>{{ user.firstname }} {{ user.lastname }}</p>
              <p>{{ user.mail }}</p>
            </div>
            <q-checkbox keep-color v-model="creatingSelectedUsers" :val="user" color="secondary" />
          </div>
          </div>
        </div>

        

        <div class="selected-users">
          <p v-for="user in creatingSelectedUsers" :key="user.id">{{ user.firstname }} {{ user.lastname }}<span v-if="creatingSelectedUsers.indexOf(user) !== selectedUsers.length">, </span></p>
          <p>Вы<span v-if="creatingSelectedUsers.length !== 0">, </span></p>
          <p><strong>Состав чата: </strong></p>
        </div>

        <q-btn filled color="primary" label="создать"
        style="width: 200px; border-radius: 10px; margin-top: 20px;"
        :disable="creatingSelectedUsers.length === 0 || creatingChatName === ''" 
        @click="createGroupChat()"/>
        </div>
        </q-list>
    </q-dialog>

    <q-dialog v-model="showChatDetails" @before-hide="addParticipantRequest = ''; addingParticipant = false; changingChatName = false; newChatName = ''">
      <q-list class="chat-details search-results-scroll">
        <div style="display: flex; flex-direction: row; align-items: center;">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileUpload"
            accept="image/*"
            style="display: none"
          />
          <img class="user-avatar" :src="getChatAvatar(currentChat!.id)" style="height: 100px; margin-right: 20px; cursor: pointer;" @click="triggerFileInput"/>
          <div style="display: flex; flex-direction: column; align-items: center;">

            <transition name="fade" mode="out-in">
              <div v-if="!changingChatName" style="display: flex; flex-direction: row;">
            <p class="chat-title">{{ currentChat?.name }}</p>
            <q-icon name="edit" color="primary" v-if="currentChat" size="18px" class="edit-name-btn" @click="changingChatName = true; newChatName = currentChat.name!"/>
            </div>
            <div v-else-if="changingChatName" style="display: flex; flex-direction: column;">
            <q-input dense  v-model="newChatName" style="width: 300px;" color="primary" input-style="color: #41789C; margin: 0; font-size: 16px;"/>
            <div style="display: flex; flex-direction: row; justify-content: space-evenly; margin-top: 20px; margin-bottom: 10px;">
              <q-btn filled label="сохранить" color="primary" style="border-radius: 10px;" @click="changeChatName()"/>
              <q-btn outline label="отмена" color="primary" style="border-radius: 10px;" @click="changingChatName= false; newChatName = ''"/>
            </div>
            </div>
            </transition>

            <p class="participants-count" style="color: #41789C;">{{ currentChat?.participants.length }} {{ participantsInterpritaion(currentChat!.participants.length) }}</p>
          </div>
        </div>
        <p class="participants-title">Участники</p>
        <div class="participants-list">
          <div class="participant-big-block" v-for="participant in currentChat?.participants" :key="participant.id" :class="{hovered: isHovered[participant.id]}">
          <div class="participant-block">
            <img :src="getAvatarUrl(participant.id)" class="user-avatar" />
            <div class="participant-info">
              <p> {{ participant.firstname }} {{ participant.lastname }}</p>
              <p>{{ participant.mail }}</p>
              <q-badge  v-if="participant.id === currentChat?.createdBy.id">Админ</q-badge>
            </div>
          </div>
          <q-icon v-if="participant.id !== currentChat?.createdBy.id && currentChat?.createdBy.id === user?.id" @mouseover="isHovered[participant.id] = true" @mouseleave="isHovered[participant.id] = false" class="onHover-remove" :class="{ hovered: isHovered[participant.id]}" name="remove" size="18px" style="padding-left: 4px; padding-right: 4px;"
          @click="selectedParticipant = participant; deletingParticipant = true"
          />
          </div>
        </div>

        <q-btn v-if="currentChat?.createdBy.id === user!.id" color="primary" :filled="addingParticipant ? false : true"
        :outline="addingParticipant ? true : false"
        :label="addingParticipant ? 'отмена' : 'добавить участника'"
        style="width: 200px; border-radius: 10px; margin-top: 50px;" 
        @click="addingParticipant = !addingParticipant; addParticipantRequest = ''"/>

        <div v-if="addingParticipant" style="width: 90%; display: flex; flex-direction: column; align-items: center;">
        <q-input class="user-search" dense rounded outlined label="Поиск" v-model="addParticipantRequest" color="primary" :loading="isLoading" />

        <div v-if="addParticipantRequest.trim() !== ''" class="adding-participants-list search-results-scroll">
          <div v-for="user in searchResults" :key="user.id">
            <div v-if="notInChat(user.id)" class="participants-intersection">
            <img class="user-avatar" :src="getAvatarUrl(user.id)" />
            <div style="display: flex; flex-direction: column;">
              <p>{{ user.firstname }} {{ user.lastname }}</p>
              <p>{{ user.mail }}</p>
            </div>
            <q-checkbox keep-color v-model="selectedUsers" :val="user.id" color="secondary" />
          </div>
          </div>
        </div>

        <q-btn filled color="primary" label="добавить"
        style="width: 200px; border-radius: 10px; margin-top: 20px;"
        :disable="selectedUsers.length === 0" 
        @click="addParticipants()"/>
        </div>
      </q-list>
    </q-dialog>

    <q-dialog v-model="deletingParticipant">
      <q-list class="chat-details" style="height: 300px;justify-content: space-between;">
        <div class="participant-block">
            <img :src="getAvatarUrl(selectedParticipant!.id)" class="user-avatar" />
            <div class="participant-info">
              <p> {{ selectedParticipant!.firstname }} {{ selectedParticipant!.lastname }}</p>
              <p>{{ selectedParticipant!.mail }}</p>
            </div>
          </div>
          <p class="alert-message">Исключить данного участника из чата?</p>
          <div style="display: flex; gap: 100px;">
            <q-btn outline label="да" color="primary" style="border-radius: 10px; width: 100px;" @click="removeParticipant()"/>
            <q-btn filled label="нет" color="primary" style="border-radius: 10px; width: 100px;" @click="deletingParticipant = false; selectedParticipant = undefined"/>
          </div>
      </q-list>
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

  .beautiful-bg {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    backdrop-filter: blur(2px);
  }

  .beautiful-bg-2 {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    backdrop-filter: blur(5px);
  }

  .no-select {
    user-select: none;
  }

  .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.window {
    display: flex;
    width: 100%;
    height: 100%;
}

.chats-panel {
    width: 20vw;
    height: 100%;
    min-width: 250px;
    border-right: 1px solid #41789C;
}

.user-avatar {
    width: auto;
    height: 50px;
    margin-right: 10px;
    margin-left: 5px;
    border-radius: 100%;
    transition: opacity 0.3s ease;
    background-color: #f0f0f0; /* Фон пока загружается */
}

.user-avatar[src*="blob:"] {
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

.chat-card {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #41789C;
    padding-top: 8px;
    padding-bottom: 5px;
    background-color: transparent;
    transition: background-color 0.3s ease;
}

.chat-card:hover {
    background-color: rgba(65, 120, 156, 0.2);
}

.chat-info {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.current-chat {
    width: 80vw;
    height: 100%;
    display: flex;
    align-items: flex-end;
}

.chat-title {
    display: -webkit-box;
  -webkit-line-clamp: 1; /* Количество строк */
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #41789C;
  padding-top: 2px;
  margin: 0;
}

.chat-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
}

.chat-last-message {
    display: -webkit-box;
  -webkit-line-clamp: 1; /* Количество строк */
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
    margin: 0;
}

.chat-date {
    margin: 0;
    margin-right: 5px;
    opacity: 70%;
}

.chat-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.input-message-panel {
    width: 100%;
    height: 45px;
    background-color: #E0EEF8;
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    border-top: 1px solid #41789C;
}

.input-message {
    margin-left: 5px;
    width: 100%;
    font-size: 16px;
    padding: 0;
}

.send-btn {
    margin-right: 10px;
}

.messages-container {
    flex-grow: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.messages-container::-webkit-scrollbar {
    width: 6px;
}

.messages-container::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
}

.messages-container::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
}

.new-messages-alert {
  position: fixed;
  right: 20px;
  bottom: 70px; /* Выше поля ввода */
  background: #5093c0;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.new-messages-alert:hover {
  transform: scale(1.1);
}

.new-messages-alert .q-icon {
  margin: 0;
}

.add-group-btn {
    display: flex;
    justify-self: center;
    margin: 10px;
    border-radius: 10px;
    width: 90%;
}

.user-search {
    display: flex;
    justify-self: center;
    margin: 10px;
    width: 95%;
}

.chats-creating {
    width: 100%;
    border-bottom: 1px solid #41789C;
}

.chat-header-title {
    display: -webkit-box;
    font-weight: 500;
    color: #E0EEF8;
    font-size: 17px;
    -webkit-line-clamp: 1; /* Количество строк */
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.participants-count {
    margin: 0;
    color: #E0EEF8;
    opacity: 80%;
}

.messages-header {
    width: 100%;
    height: 60px;
    background-color: #5093c0;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-shrink: 0;
    align-items: center;
}

img.q-message-avatar {
    transition: opacity 0.3s ease;
    background-color: #f0f0f0; /* Фон пока загружается */
}

img.q-message-avatar[src*="blob:"] {
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

.search-results-container {
  height: calc(100% - 110px); /* Высота контейнера (можно регулировать) */
  overflow: hidden; /* Скрываем всё, что выходит за границы */
  position: relative; /* Для позиционирования внутреннего контейнера */
}

.search-results-scroll {
  max-height: 100%; /* Максимальная высота равна родительскому контейнеру */
  overflow-y: auto; /* Вертикальный скролл при необходимости */
  scrollbar-width: thin; /* Для Firefox */
  padding-right: 5px; /* Чтобы контент не заезжал под скролл */
}

/* Стилизация скроллбара (для WebKit браузеров) */
.search-results-scroll::-webkit-scrollbar {
  width: 6px;
}

.search-results-scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.search-results-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.search-results-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

.red-on-hover {
  background-color: #E0EEF8;
  transition: background-color 0.3s ease;
}

.red-on-hover:hover {
  background-color: rgba(235, 100, 73, 0.3);
}

.onHover {
  border-bottom: 2px solid;
  border-bottom-color: transparent;
  transition: border-bottom-color 0.3s ease;
}

.onHover:hover {
  border-bottom-color: #E0EEF8;
  cursor: pointer;
}

.onHover-remove {
  color: #E0EEF8;
  transition: color 0.3s ease;
}

.hovered.onHover-remove {
  color: #eb6449;
}

.chat-details {
  width: 560px;
  min-width: 50px;
  height: 80vh;
  background-color: #E0EEF8;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  border-radius: 10px;
  overflow-x: hidden;
}

.edit-name-btn {
  margin-left: 2px;
  padding: 2px;
  border: 1px solid;
  border-radius: 100%;
  border-color: transparent;
  transition: border-color 0.3s ease;
}

.edit-name-btn:hover {
  border-color: #41789C;
  cursor: pointer;
}

.participants-list {
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.participant-block {
  display: flex;
  flex-direction: row;
  background-color: #41789C;
  padding: 8px;
  height: 70px;
  border-radius: 20px;
  align-items: center;

  p {
    margin: 0;
    color: #E0EEF8;
  }
}

.participant-big-block {
  display: flex;
  flex-direction: row;
  background-color: #eb6449;
  border-radius: 20px;
  align-items: center;
  height: 70px;
  transition: background-color 0.3s ease;
}

.hovered.participant-big-block {
  background-color: #E0EEF8;
}

.participant-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.alert-message {
  color: #41789C;
  font-size: 18px;
}

.participants-title {
  margin: 0;
  margin-top: 20px;
  font-size: 20px;
  color: #41789C;
}

.adding-participants-list {
  max-height: 25vh;
  width: 100%;
  overflow: auto;
  overflow-x: hidden;
  background-color:#E0EEF8;
  padding: 10px;
  border-radius: 10px;
}

.participants-intersection {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #41789C;
  background-color: #41789C;
  padding: 10px;
  border-radius: 20px;
  margin-bottom: 10px;

  p {
    margin: 0;
    font-size: 15px;
    text-align: center;
    color: #E0EEF8;
  }
}

.selected-users {
  display: flex;
  flex-direction: row-reverse;
  white-space: pre;
  margin-top: 20px;
  max-width: 80%;
  flex-wrap: wrap-reverse;
  justify-content: flex-end;

  p {
    font-size: 16px;
    color: #41789C;
  }
}

.unread-in-chat {
  margin: 0;
  margin-right: 20px;
  padding-left: 6px;
  padding-right: 6px;
  background-color: #41789C;
  color: #E0EEF8;
  font-size: 14px;
  border-radius: 100%;
}

</style>

<script setup lang="ts">
  /* eslint-disable @typescript-eslint/no-explicit-any */
import { useSocketStore } from 'src/store/socket.store';
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
import avatar_alt from 'assets/avatar_alt.png'
import { formatSmartDate } from 'src/services/interpritation.service';
import { useUserStore } from 'src/store';
import type { IChat, IMessage, IUser } from 'src/types/types';
import { instance } from 'src/api/axios.api';
import { toast } from 'vue3-toastify';
import { scrollToBottom, scrollToBottomInstant } from 'src/services/scroll.service';
import { nextTick } from 'process';
import { debounce } from 'quasar';
import { AuthService } from 'src/services/auth.service';
import { participantsInterpritaion } from 'src/services/interpritation.service';
import chat_alt from '../assets/1af82c8ed1916d70e58f662999ce7461.jpg'

const user = useUserStore().getUser

const socketStore = useSocketStore()

const avatarUrls = ref<Record<number, string>>({});

const chats = computed(() => socketStore.chats)
const messages = computed(() => socketStore.messages)
const chatting = computed(() => socketStore.chatting)

const creatingGroupChat = ref<boolean>(false)
const isScrolledToBottom = ref<boolean>(true)
const userRequest = ref<string>('')
const isLoading = ref<boolean>(false)
const searchResults = ref<IUser[]>([])
const beginingChat = ref<boolean>(false)
const selectedUser = ref<IUser | undefined>(undefined)
const showChatDetails = ref<boolean>(false)
const changingChatName = ref<boolean>(false)
const newChatName = ref<string>('')
const deletingParticipant = ref<boolean>(false)
const selectedParticipant = ref<IUser>()
const addingParticipant = ref<boolean>(false)
const addParticipantRequest = ref<string>('')
const selectedUsers = ref<number[]>([])
const creatingSelectedUsers = ref<IUser[]>([])
const creatingChatName = ref<string>('')

const shadowText = ref<string>('Сообщение')

const fileInput = ref<HTMLInputElement | null>(null); // Явно указываем тип

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const getChatAvatar = (chatId: number) => {
  if (chatAvatar.value[chatId]) {
    return chatAvatar.value[chatId]
  }
  return chat_alt
}

const chatAvatar = computed(() => socketStore.chatAvatars)

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append('avatar', file);

    // Для чатов (если currentChat.value существует)
    if (currentChat.value) {
      await instance.post(`chat/avatar/${currentChat.value.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } 

      toast.success('Аватар чата обновлён!');
  } catch (error: any) {
    console.error('Ошибка загрузки аватара:', error);
    toast.error(error.response?.data?.message || 'Ошибка загрузки');
  } finally {
    // Сбрасываем input, чтобы можно было загрузить тот же файл снова
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};

const isHovered = ref<Record<number, boolean>>({})

const currentChat = ref<IChat>()

const myMessage = ref<string>('')

const messageRefs = ref<Record<number, HTMLElement>>({});
const processingMessages = new Set<number>();

const getLastMessageContent = (chatId: number) => {
    const chatMessages = messages.value[chatId]
    if (!chatMessages || chatMessages.length === 0) return ''
    return chatMessages[chatMessages.length - 1]?.content || ''
}

const getLastMessageIsRead = (chatId: number) => {
  const chatMessages = messages.value[chatId]
  if (!chatMessages || chatMessages.length === 0) return false
  return chatMessages[chatMessages.length - 1]?.isRead
}

const getLastMessageTime = (chatId: number) => {
    const chatMessages = messages.value[chatId]
    if (!chatMessages || chatMessages.length === 0) return ''
    return chatMessages[chatMessages.length - 1]?.createdAt || ''
}

const getLastMessageSender = (chatId: number) => {
    const chatMessages = messages.value[chatId]
    if (!chatMessages || chatMessages.length === 0) return ''
    return chatMessages[chatMessages.length - 1]?.sender.firstname || ''
}

const getLastMessageSenderId = (chatId: number) => {
    const chatMessages = messages.value[chatId]
    if (!chatMessages || chatMessages.length === 0) return ''
    return chatMessages[chatMessages.length - 1]?.sender.id
}

const getPreviousSenderId = (message: IMessage) => {
    if (!currentChat.value) return true;
  
  const chatMessages = messages.value[currentChat.value.id];
  if (!chatMessages) return true;

  const messageIndex = chatMessages.findIndex(m => m.id === message.id);
  if (messageIndex <= 0) return true; // Первое сообщение или не найдено

  const prevMessage = chatMessages[messageIndex - 1];
  return prevMessage!.sender.id !== message.sender.id;
}

const getNextSenderId = (message: IMessage) => {
    if (!currentChat.value) return true;
  
  const chatMessages = messages.value[currentChat.value.id];
  if (!chatMessages) return true;

  const messageIndex = chatMessages.findIndex(m => m.id === message.id);
  if (messageIndex <= 0 || messageIndex === chatMessages.length - 1) return true; // Первое сообщение или не найдено

  const prevMessage = chatMessages[messageIndex + 1];
  return prevMessage!.sender.id !== message.sender.id;
}

const itsNotMe = (userId: number) => {
  if (userId === user!.id) return false
  return true
}

const loadAvatar = async (userId: number) => {
  if (avatarUrls.value[userId]) return;
  
  try {
    const blob = await AuthService.getAvatar(userId);
    avatarUrls.value[userId] = blob && blob.size > 0 
      ? URL.createObjectURL(blob) 
      : avatar_alt;
  } catch (error: any) {
    avatarUrls.value[userId] = avatar_alt;
    console.error(error.message)
  }
};

const getAvatarUrl = (userId: number): string => {
  if (!avatarUrls.value[userId]) {
    // Запускаем загрузку, но возвращаем заглушку сразу
    void loadAvatar(userId);
    return avatar_alt;
  }
  return avatarUrls.value[userId];
};

const changeChatName = async () => {
  try {
    const chat = (await instance.patch('chat/name', {chatId: currentChat.value?.id, name: newChatName.value})).data

    socketStore.setNewChatName(chat)

    changingChatName.value = false
    newChatName.value = ''

    toast.success('Название чата изменено')
  }
  catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
    toast.error(errorMessage);
  }
}

const setCurrentChat = (chat: IChat) => {
  currentChat.value = chat;
  void nextTick(() => {
    scrollToBottomInstant();
    checkVisibleMessages();
  });
};

const notHaveChat = (userId: number) => {
  let flag = true

  chats.value.forEach(chat => {
    if (!chat.isGroup) {
      chat.participants.forEach(p => {
        if (p.id === userId) {
          flag = false
        }
      })
    }
  })

  return flag
}

const handleScroll = debounce(() => {
  const container = document.querySelector('.messages-container');
  if (!container) return;
  
  isScrolledToBottom.value = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
  checkVisibleMessages();
}, 100);

const observeMessage = (node: unknown, messageId: number) => {
  let element: HTMLElement | null = null;
  
  if (node instanceof HTMLElement) {
    element = node;
  } else if (node && typeof node === 'object' && '$el' in node) {
    element = node.$el as HTMLElement;
  }
  
  if (element) {
    messageRefs.value[messageId] = element;
  }
};

const sendMessage = async (chatId: number, content: string) => {
    try {
      const senderId = user!.id
      const response = await instance.post('chat/message', {chatId, senderId, content})
      socketStore.addMessage(response.data)

      myMessage.value = ''
      void nextTick(() => scrollToBottom()) 
    }
    catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
        toast.error(errorMessage);
    }
}

const getUnreadCount = (chatId: number) => {
  const chatMessages = messages.value[chatId]
  if (!chatMessages || chatMessages.length === 0) return 0

  let count = 0

  chatMessages.forEach(m => {
    if (!m.isRead) count += 1
  })

  return count
}

const createGroupChat = async () => {
  try {
    const userIds: number[] = []

    creatingSelectedUsers.value.forEach(user => userIds.push(user.id))

    const chat = (await instance.post('chat/group', {name: creatingChatName.value, userIds})).data

    socketStore.chats.unshift(chat)

    creatingGroupChat.value = false

    toast.success('Групповой чат создан')
  }
  catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
        toast.error(errorMessage);
  }
}

const checkVisibleMessages = debounce(() => {
  if (!currentChat.value) return;
  
  const container = document.querySelector('.messages-container');
  if (!container) return;

  const containerRect = container.getBoundingClientRect();
  const chatId = currentChat.value.id;
  
  Object.entries(messageRefs.value).forEach(([messageIdStr, element]) => {
    const messageId = Number(messageIdStr);
    const message = messages.value[chatId]?.find(m => m.id === messageId);
    
    if (message && message.sender.id !== user!.id && !message.isRead) {
      const rect = element.getBoundingClientRect();
      const isVisible = (
        rect.top >= containerRect.top -50 &&
        rect.bottom <= containerRect.bottom + 50
      );
      
      if (isVisible) {
        void markAsRead(messageId);
      }
    }
  });
}, 200);

const getParticipantAvatar = computed(() => (chat: IChat) => {
  if (chat.isGroup) return avatar_alt;
  if (!chat.participants || !user) return avatar_alt;
  
  const otherParticipants = chat.participants.filter(p => p.id !== user.id);
  if (!otherParticipants.length) return avatar_alt;
  
  return getAvatarUrl(otherParticipants[0]!.id);
});

const markAsRead = async (messageId: number) => {
  try {
    const chatId = currentChat.value?.id;
    if (!chatId) return;
    
    const message = messages.value[chatId]?.find(m => m.id === messageId);
    if (!message || message.sender.id === user!.id || message.isRead) return;

    // 1. Сначала обновляем локально
    socketStore.markMessageAsRead(chatId, messageId);
    
    // 2. Затем отправляем на сервер
    await instance.patch(`chat/${messageId}`);
    
    // 3. Прекращаем наблюдение
    delete messageRefs.value[messageId];
  } catch (error) {
    console.error('Ошибка пометки сообщения:', error);
  } finally {
    processingMessages.delete(messageId);
  }
}

const notInChat = (userId: number) => {
  let flag = true

  if (!currentChat.value) return

  currentChat.value.participants.forEach(p => {
    if (p.id === userId) flag = false
  })

  return flag
}

const smoothScrollToBottom = () => {
  const container = document.querySelector('.messages-container');
  if (!container) return;
  
  container.scrollTo({
    top: container.scrollHeight,
    behavior: 'smooth'
  });
  
  // После скролла помечаем сообщения как прочитанные
};

const shouldShowNewMessagesAlert = computed(() => {
  if (isScrolledToBottom.value || !currentChat.value) return false;
  
  const chatMessages = messages.value[currentChat.value.id];
  if (!chatMessages) return false;
  
  // Проверяем есть ли непрочитанные сообщения от других пользователей
  return chatMessages.some(
    message => !message.isRead && message.sender.id !== user?.id
  );
});

const debouncedSearch = debounce(async (query) => {
  if (!query.trim()) {
    searchResults.value = [];
    return;
  }
  
  try {
    isLoading.value = true;
    if(userRequest.value !== '')
    searchResults.value = (await instance.get(`user/search/${userRequest.value}`)).data;

    else if(addParticipantRequest.value !== '')
    searchResults.value = (await instance.get(`user/search/${addParticipantRequest.value}`)).data

    searchResults.value.forEach(user => {
        if (!avatarUrls.value[user.id]) {
          void getAvatarUrl(user.id)
        }
    })
  } catch (error) {
    console.error('Search error:', error);
  } finally {
    isLoading.value = false;
  }
}, 500);

const removeParticipant = async () => {
  try {
    if (!currentChat.value || !selectedParticipant.value) return

    const chatId = currentChat.value?.id
    const userId = selectedParticipant.value.id
    let userIdMass: number[] = []
    userIdMass = [...userIdMass, userId]

    await instance.patch('chat/remove', {chatId, userIds: userIdMass})

    deletingParticipant.value = false
    selectedParticipant.value = undefined

    toast.success('Пользователь удален из чата')
  }
  catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
        toast.error(errorMessage);
  }
}

const addParticipants = async () => {
  try {
    if (!currentChat.value || !selectedUsers.value) return

    const chatId = currentChat.value.id
    const userIds = selectedUsers.value

    await instance.patch('chat/add', {chatId, userIds})

    addingParticipant.value = false
    addParticipantRequest.value = ''
    selectedUsers.value = []

    toast.success('Пользователи добавлены в чат')

  }
  catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
        toast.error(errorMessage);
  }
}

const getParticiapnt = () => {
    return currentChat.value?.participants.filter(p => p.id !== user!.id)[0]
}

const getChatParticiapnt = (chat: IChat) => {
    return chat.participants.filter(p => p.id !== user!.id)[0]
}

const createPrivateChat = async (user2Id: number) => {
    try {
        const chat = (await instance.post('chat/private', {user2Id})).data

        chats.value.unshift(chat)

        currentChat.value = chat

        beginingChat.value = false
        userRequest.value = ''

        if (currentChat.value)
        void sendMessage(currentChat.value?.id, myMessage.value)
    }
    catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
        toast.error(errorMessage);
    }
}

const deleteChat = async () => {
  try {

    if (!currentChat.value) {
      return
    }

    await instance.delete(`chat/${currentChat.value.id}`)
    socketStore.removeChat(currentChat.value)

    currentChat.value = undefined

    toast.success('Чат удален')
  }
  catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
        toast.error(errorMessage);
  }
}

watch(userRequest, (newVal) => {
  debouncedSearch(newVal);
});

watch(addParticipantRequest, (newVal) => {
  debouncedSearch(newVal)
})

watch(() => chats.value, (chats) => {
    chats.forEach(chat => {
        chat.participants.filter(p => p.id !== user!.id).forEach(user => {
            void loadAvatar(user.id)
        })
    })
})

watch(() => messages.value[currentChat.value?.id || 0], () => {
  void nextTick(checkVisibleMessages);
}, { deep: true });

watch(() => myMessage.value, async() => {

    if (myMessage.value.trim() !== '' && currentChat.value) {
      await instance.post(`chat/chatting/${currentChat.value?.id}`)
    }
    else if (myMessage.value.trim() === '' && currentChat.value) {
        await instance.post(`chat/stopchatting/${currentChat.value?.id}`)
        
    }
    if (myMessage.value.trim() !== '') shadowText.value = ''
    else if (myMessage.value.trim() === '') shadowText.value = 'Сообщение'
})

watch(() => [...chats.value], (newChats) => {
  // Сработает только если текущий чат пропал из массива
  if (currentChat.value && !newChats.some(chat => chat.id === currentChat.value?.id)) {
    currentChat.value = undefined;
  }
}, { deep: true });

watch(() => chats.value.find(c => c.id === currentChat.value?.id), (newChat) => {
  if (newChat && currentChat.value?.isGroup && currentChat.value && newChat.name !== currentChat.value?.name && newChat.name) {
    currentChat.value.name = newChat.name
  }
  if (newChat && currentChat.value?.isGroup && currentChat.value && newChat.participants.length !== currentChat.value.participants.length) {
    currentChat.value.participants = newChat.participants
  }
})

watch(
  () => currentChat.value?.id ? chatting.value[currentChat.value.id] : undefined,
  (isTypingNow, wasTypingBefore) => {
    if (!isTypingNow || isTypingNow === wasTypingBefore) return;
    
    void nextTick(() => {
      const container = document.querySelector('.messages-container');
      if (!container) return;
      
      // Более надежная проверка на нахождение внизу
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
      
      // Дополнительная проверка - если скролл уже близко к низу
      const isNearBottom = container.scrollHeight - container.scrollTop < container.clientHeight + 300;
      
      if (isAtBottom || isNearBottom) {
        requestAnimationFrame(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        });
      }
    });
  },
  { deep: true }
);

watch(() => currentChat.value, () => {
    myMessage.value = ''
})

onMounted(() => {
  const container = document.querySelector('.messages-container');
  if (container) {
    container.addEventListener('scroll', handleScroll);
    // Инициализируем начальное состояние
    handleScroll();
  }

  void loadAvatar(user!.id)
});

onUnmounted(() => {
  const container = document.querySelector('.messages-container');
  if (container) {
    container.removeEventListener('scroll', handleScroll);
  }
});

onBeforeUnmount(() => {
    Object.values(avatarUrls.value).forEach(url => {
    if (url && url !== avatar_alt) URL.revokeObjectURL(url);
  });
});

</script>