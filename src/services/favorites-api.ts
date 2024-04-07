import { ApiRoute } from '../const';
import { Offer } from '../types';
import api from './api';

const favoritesApi = {
  async getList(): Promise<Offer[]> {
    const { data } = await api.get<Offer[]>(ApiRoute.Favorites);
    return data;
  },

  async changeIsFavorite(id: string, isFavorite: boolean): Promise<Offer> {
    const { data } = await api.post<Offer>(`${ApiRoute.Favorites}/${id}/${isFavorite ? 1 : 0}`);
    return data;
  }

} as const;

type FavoritesApi = typeof favoritesApi;

export {
  favoritesApi,
};

export type {
  FavoritesApi,
};
