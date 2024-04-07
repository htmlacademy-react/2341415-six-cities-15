import { ApiRoute } from '../const';
import { AuthData, UserData } from '../types';
import api from './api';
import { dropToken, saveToken } from './token';

export const userApi = {
  async login({ login, password }: AuthData): Promise<UserData> {
    const { data } = await api.post<UserData>(ApiRoute.Login, { email: login, password });
    saveToken(data.token);
    return data;
  },
  async logout() {
    await api.delete<UserData>(ApiRoute.Logout);
    dropToken();
  },
  async getAuthorizedUser(): Promise<UserData> {
    const { data } = await api.get<UserData>(ApiRoute.Login);
    return data;
  }
} as const;

export type UserApi = typeof userApi;
