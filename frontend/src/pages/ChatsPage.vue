<template>
<div class="container">
    <div class="window">

        <div class="chats-panel beautiful-bg-2 no-select">
            <div class="chats-creating">
            <q-btn class="add-group-btn" color="primary" outline icon="add" label="групповой чат" @click="creatingChat = true"/>
            <q-input class="user-search" dense rounded outlined label="Поиск" v-model="userRequest" color="primary" :loading="isLoading" />
            </div>

            <div v-if="chats.length > 0 && userRequest.trim() === ''">
            <div class="chat-card" v-for="chat in chats" :key="chat.id" style="color: black;" @click="setCurrentChat(chat); void nextTick(() => scrollToBottomInstant())">
                <img class="user-avatar" :src="getParticipantAvatar(chat)" />
                <div class="chat-info">
                    <div class="chat-header">
                    <p class="chat-title" v-if="!chat.isGroup">{{ getChatParticiapnt(chat)?.firstname }} {{ getChatParticiapnt(chat)?.lastname }}</p>
                    <p class="chat-title" v-else>{{ chat.name }}</p>
                    <p class="chat-date" v-if="getLastMessageContent(chat.id)">{{ formatSmartDate(getLastMessageTime(chat.id)) }}</p>
                    </div>

                    <p class="chat-last-message" v-if="!chat.isGroup && getLastMessageContent(chat.id)">{{ getLastMessageContent(chat.id) }}</p>
                    <p class="chat-last-message" v-else-if="chat.isGroup && chat.messages && getLastMessageSenderId(chat.id) !== user!.id "><strong>{{ getLastMessageSender(chat.id) }}:</strong> {{ getLastMessageContent(chat.id) }}</p>
                    <p class="chat-last-message" v-else-if="chat.messages && getLastMessageSenderId(chat.id) === user!.id"><strong>Вы:</strong> {{ getLastMessageContent(chat.id) }}</p>
                </div>
            </div>
            </div>

            <div v-else-if="userRequest.trim() !== ''" class="search-results-container">
                <div class="search-results-scroll">
                <div class="chat-card" v-for="user in searchResults" :key="user.id" @click="currentChat = undefined; beginingChat = true; selectedUser = user">
                <img class="user-avatar" :src="getAvatarUrl(user.id)" />
                <div class="chat-info">
                    <div class="chat-header">
                        <p class="chat-title">{{ user.firstname }} {{ user.lastname }}</p>
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
                    <img class="user-avatar" :src="getParticipantAvatar(currentChat)" />
                    <div>
                    <p class="chat-header-title" v-if="currentChat.isGroup">{{ currentChat.name }}</p>
                    <p class="chat-header-title" v-else-if="!currentChat.isGroup">{{ getParticiapnt()?.firstname }} {{ getParticiapnt()?.lastname }}</p>
                    <p class="participants-count" v-if="currentChat.isGroup">{{ currentChat.participants.length }} {{ participantsInterpritaion(currentChat.participants.length) }}</p>
                    </div>
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
                <q-chat-message v-if="chatting[currentChat.id]" bg-color="secondary">
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
                    <q-input class="input-message" borderless v-model="myMessage" dense/>
                    <q-btn class="send-btn" :disable="myMessage.trim() === '' ? true : false" flat round icon="send" @click="sendMessage(currentChat.id, myMessage)" />
                </div>
            </div>

            <div style="width: 100%; height: 100%; display: flex; flex-direction: column;" v-else-if="beginingChat && currentChat === undefined && selectedUser">
                <div class="messages-header">
                    <img class="user-avatar" :src="getAvatarUrl(selectedUser.id)" />
                    <div>
                    <p class="chat-header-title">{{ selectedUser?.firstname }} {{ selectedUser?.lastname }}</p>
                    </div>
                </div>
                <div class="messages-container" />
                <div class="input-message-panel">
                    <q-input class="input-message" borderless v-model="myMessage" dense/>
                    <q-btn class="send-btn" :disable="myMessage.trim() === '' ? true : false" flat round icon="send" @click="createPrivateChat(selectedUser!.id)" />
                </div>
            </div>

            <div v-else>

            </div>
        </div>
    </div>

    <q-dialog v-model="creatingChat">
        <p>да</p>
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

const user = useUserStore().getUser

const socketStore = useSocketStore()

const avatarUrls = ref<Record<number, string>>({});

const chats = computed(() => socketStore.chats)
const messages = computed(() => socketStore.messages)
const chatting = computed(() => socketStore.chatting)

const creatingChat = ref<boolean>(false)
const isScrolledToBottom = ref<boolean>(true)
const userRequest = ref<string>('')
const isLoading = ref<boolean>(false)
const searchResults = ref<IUser[]>([])
const beginingChat = ref<boolean>(false)
const selectedUser = ref<IUser | undefined>(undefined)

const currentChat = ref<IChat>()

const myMessage = ref<string>('')

const messageRefs = ref<Record<number, HTMLElement>>({});
const processingMessages = new Set<number>();

const getLastMessageContent = (chatId: number) => {
    const chatMessages = messages.value[chatId]
    if (!chatMessages || chatMessages.length === 0) return ''
    return chatMessages[chatMessages.length - 1]?.content || ''
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

const setCurrentChat = (chat: IChat) => {
  currentChat.value = chat;
  void nextTick(() => {
    scrollToBottomInstant();
    checkVisibleMessages();
  });
};

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
    console.log('пометил')
    
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
    searchResults.value = (await instance.get(`user/search/${userRequest.value}`)).data;

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

        if (currentChat.value)
        void sendMessage(currentChat.value?.id, myMessage.value)
    }
    catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
        toast.error(errorMessage);
    }
}

watch(userRequest, (newVal) => {
  debouncedSearch(newVal);
});

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