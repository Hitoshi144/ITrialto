import { instance } from "src/api/axios.api";
import type { IResponse, IUserData } from "src/types/types";

export const AuthService = {
    async registration(userData: IUserData): Promise<IResponse | undefined> {
        const { data } = await instance.post<IResponse>('user', userData)
        return data
    },

    async login() {},

    async getMe() {},
}
