import { defineStore } from "pinia";
import { instance } from "src/api/axios.api";
import type { ICreateTeamRequest } from "src/types/types";
import { ref } from "vue";

export const useCreateTeamRequestsStore = defineStore('createTeamRequests', () => {
    const requests = ref<ICreateTeamRequest[]>([])

    const fetchRequests = async () => {
        requests.value = (await instance.get('create-team-request/my')).data
    }

    const deleteRequest = async (id: number) => {
        await instance.delete(`create-team-request/${id}`)
        requests.value = requests.value.filter(r => r.id !== id)
    }

    return { requests, fetchRequests, deleteRequest }
})