import { ApiRoute, DEFAULT_NEIGHBOURS_COUNT } from '../const';
import { Offer, OfferCard } from '../types';
import api from './api';

const offerApi = {
  async getList(): Promise<Offer[]> {
    const { data } = await api.get<Offer[]>(ApiRoute.Offers);
    return data;
  },

  async getBy(id: Offer['id']): Promise<OfferCard> {
    const { data } = await api.get<OfferCard>(`${ApiRoute.Offers}/${id}`);
    return data;
  },
  async getNearby(id: Offer['id'], limit = DEFAULT_NEIGHBOURS_COUNT): Promise<Offer[]> {
    const { data } = await api.get<Offer[]>(`${ApiRoute.Offers}/${id}/nearby`);
    return data.slice(0, limit);
  }
} as const;

type OfferApi = typeof offerApi;

export {
  offerApi,
};

export type {
  OfferApi,
};
