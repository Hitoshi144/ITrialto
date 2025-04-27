import { AxiosError } from "axios";
import { instance } from "src/api/axios.api";
import type { IResponse, IUserAuthData, IUserData, IUserProfile, IUserUpdate } from "src/types/types";

export const AuthService = {
    async registration(userData: IUserData): Promise<IResponse | undefined> {
        const { data } = await instance.post<IResponse>('user', userData)
        return data
    },

    async login(userData: IUserAuthData): Promise<IResponse | undefined> {
        const {data} = await instance.post<IResponse>('auth/login', userData)
        return data
    },

    async getProfile(): Promise<IUserProfile> {
        const {data} = await instance.get<IUserProfile>('auth/profile')
        return data
    },

    async updateProfile(updateData: IUserUpdate): Promise<IUserProfile> {
        const {data} = await instance.patch<IUserProfile>('auth/profile', updateData)
        return data
    },

    async uploadAvatar(formData: FormData): Promise<void> {
        await instance.post('/user/avatar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
      },

      async getAvatar(userId: number): Promise<Blob | null> {
        try {
          const response = await instance.get(`/user/avatar/${userId}`, {
            responseType: 'blob'
          });
          return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response?.status === 404) {
              return null;
            }
            throw error;
          }
      },

    parseStack(stack: string) {
      if (stack != null) {
        return stack.replace('{', '').replace('}', '').split(',')
      }
    },
}
