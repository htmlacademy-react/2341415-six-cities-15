import { createAction } from '@reduxjs/toolkit';
import { CityName } from '../types';
import { SortVariants } from '../const';

export const Action = {
  CITY_CHANGE: 'CITY_CHANGE',
  ALL_OFFERS_ADDING: 'ALL_OFFERS_ADDING',
  CHANGE_SORTING_ORDER: 'CHANGE_SORTING_ORDER',
} as const;

export const cityChangeAction = createAction(Action.CITY_CHANGE, (cityName: CityName) => ({ payload: cityName }));
export const sortingOrderChangeAction = createAction(Action.CHANGE_SORTING_ORDER, (sortingOrder: SortVariants) => ({ payload: sortingOrder }));

