<template>
<div>
    <p class="i-member-teams-title">Заявок на рассмотрении: {{ createTeamRequests.length }}</p>
        <div v-for="request in createTeamRequests" :key="request.id">
          <q-separator />
          <p class="team-description" style="margin-top: 20px;"><strong>Название:</strong> {{ request.title }}</p>
          <p class="team-description" style="margin-top: 15px;"><strong>Описание:</strong> {{ request.description }}</p>
          <q-btn outline label="удалить заявку" style="border-radius: 10px; margin-top: 15px; display: flex; justify-self: flex-end;" color="primary" icon="delete_forever" @click="isOpen = true" />
          <q-dialog v-model="isOpen" backdrop-filter="blur(4px)" transition-show="fade" transition-hide="fade">
            <q-card flat bordered class="team-edit-card" style="border-radius: 15px;">
              <q-card-section>
                <div style="display: flex; justify-content: space-between; flex-direction: row;">
                      <p class="text-h5" style="color: #41789C;">Удаление заявки</p>
                      <q-btn flat color="primary" rounded icon="close" v-close-popup />
                    </div>
              </q-card-section>
              <q-card-section>
                <p class="text-h6" style="color: #41789C; margin-left: 30px;">Вы уверены, что хотите удалить заявку на создание команды?</p>
              </q-card-section>
              <q-card-section>
                <div style="display: flex; flex-direction: row; justify-content: space-between;">
                      <q-btn outline color="negative" style="border-radius: 10px; margin-left: 20px;" label="Да, удалить" @click="deleteCreateTeamReq(request.id)" />
                      <q-btn filled color="primary" style="border-radius: 10px; margin-right: 20px;" label="Нет, не удалять" @click="isOpen = false" />
                    </div>
              </q-card-section>
            </q-card>
          </q-dialog>
        
        </div>
</div>
</template>

<style scoped>
.i-member-teams-title {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #41789C;
    font-weight: 600;
    font-size: 24px;
}

.team-description {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  font-size: 16px;
  color: #41789C;
  font-weight: 400;
  word-wrap: break-word;
}

.team-edit-card {
    width: 75vw;
}
</style>

<script lang="ts" setup>
  /* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreateTeamRequestsStore } from 'src/store/create-team-request';
import { computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';


const createTeamRequestsStore = useCreateTeamRequestsStore()

const createTeamRequests = computed(() => createTeamRequestsStore.requests)

const deleteCreateTeamReq = async (requestId: number) => {
  try {
    await createTeamRequestsStore.deleteRequest(requestId)
    toast.success('Заявка удалена')
  }
  catch (error: any) {
    console.log(error.message)
  }
 }

 const props = defineProps<{
  isDeleteDialogOpen: boolean
}>();

const emit = defineEmits(['update:isDeleteDialogOpen']);

// Computed для двустороннего связывания
const isOpen = computed({
  get: () => props.isDeleteDialogOpen,
  set: (value) => emit('update:isDeleteDialogOpen', value)
});

 onMounted(async () => {
    await createTeamRequestsStore.fetchRequests()
 })

</script>