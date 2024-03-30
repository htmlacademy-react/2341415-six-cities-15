import { APIRoute, DEFAULT_NEIGHBOURS_COUNT } from '../const';
import { CityName, Offer, OfferCard } from '../types';
import api from './api';

const offerApi = {
  async getList(cityName: CityName): Promise<Offer[]> {
    const { data } = await api.get<Offer[]>(APIRoute.Offers);
    return data.filter((offer) => offer.city.name === cityName);
  },

  async getBy(id: Offer['id']): Promise<OfferCard> {
    const { data } = await api.get<OfferCard>(`${APIRoute.Offers}/${id}`);
    return data;
  },
  async getNearby(id: Offer['id'], limit = DEFAULT_NEIGHBOURS_COUNT): Promise<Offer[]> {
    const { data } = await api.get<Offer[]>(`${APIRoute.Offers}/${id}/nearby`);
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
