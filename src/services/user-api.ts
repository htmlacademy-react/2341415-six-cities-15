import { APIRoute } from '../const';
import { AuthData, UserData } from '../types';
import api from './api';

export const userApi = {
  async login({ login, password }: AuthData): Promise<UserData> {
    const { data } = await api.post<UserData>(APIRoute.Login, { email: login, password });
    return data;
  },
  async logout() {
    await api.delete<UserData>(APIRoute.Logout);
  },
  async getAuthorizedUser(): Promise<UserData> {
    const { data } = await api.get<UserData>(APIRoute.Login);
    return data;
  }
} as const;

export type UserApi = typeof userApi;
