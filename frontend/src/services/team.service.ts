import { instance } from "src/api/axios.api";

export const TeamService = {
    async loadStack (teamId: number): Promise<string[]> {
        try {
        const response = await instance.get(`/teams/stack/${teamId}`);
        return response.data; // Предполагаем, что сервер возвращает string[]
      } catch (error) {
        console.error(`Ошибка загрузки стека для команды ${teamId}:`, error);
        return []; // Возвращаем пустой массив в случае ошибки
      }
      }
}