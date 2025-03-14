import { instance } from "src/api/axios.api";
import type { IResponse, IUserAuthData, IUserData } from "src/types/types";

export const AuthService = {
    async registration(userData: IUserData): Promise<IResponse | undefined> {
        const { data } = await instance.post<IResponse>('user', userData)
        return data
    },

    async login(userData: IUserAuthData): Promise<IResponse | undefined> {
        const {data} = await instance.post<IResponse>('auth/login', userData)
        return data
    },

    async getMe() {},
}
