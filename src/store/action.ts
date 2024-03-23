import { createAction } from '@reduxjs/toolkit';
import { CityName, Offer, OfferCard } from '../types';
import { AuthorizationStatus, SortVariants } from '../const';

export const Action = {
  CITY_CHANGE: 'CITY_CHANGE',
  ALL_OFFERS_ADDING: 'ALL_OFFERS_ADDING',
  CHANGE_SORTING_ORDER: 'CHANGE_SORTING_ORDER',
  LOAD_OFFERS: 'LOAD_OFFERS',
  LOAD_OFFER_CARD: 'LOAD_OFFER_CARD',
  REQUIRE_AUTHORIZATION: 'REQUIRE_AUTHORIZATION',
  SET_ERROR: 'SET_ERROR',
} as const;

export const cityChangeAction = createAction(Action.CITY_CHANGE, (cityName: CityName) => ({ payload: cityName }));
export const sortingOrderChangeAction = createAction(Action.CHANGE_SORTING_ORDER, (sortingOrder: SortVariants) => ({ payload: sortingOrder }));
export const loadOffersAction = createAction(Action.LOAD_OFFERS, (offers: Offer[]) => ({ payload: offers }));
export const loadOfferByIdAction = createAction(Action.LOAD_OFFER_CARD, (offer: OfferCard) => ({ payload: offer }));
export const requireAuthorizationAction = createAction<AuthorizationStatus>(Action.REQUIRE_AUTHORIZATION);
export const setError = createAction<string | null>(Action.SET_ERROR);
