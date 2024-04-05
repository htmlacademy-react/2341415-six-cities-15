import { APIRoute } from '../const';
import { Offer } from '../types';
import api from './api';

const favoritesApi = {
  async getList(): Promise<Offer[]> {
    const { data } = await api.get<Offer[]>(APIRoute.Favorites);
    return data;
  },

  async changeIsFavorite(id: string, isFavorite: boolean): Promise<Offer> {
    const { data } = await api.post<Offer>(`${APIRoute.Favorites}/${id}/${isFavorite ? 0 : 1}`);
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
