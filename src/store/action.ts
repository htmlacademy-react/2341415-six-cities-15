import { createAction } from '@reduxjs/toolkit';
import { CityName } from '../types';
import { SortVariants } from '../const';

export const Action = {
  CITY_CHANGE: 'CITY_CHANGE',
  CHANGE_SORTING_ORDER: 'CHANGE_SORTING_ORDER',
  SET_ERROR: 'SET_ERROR',
  SET_USER:'SET_USER'
} as const;

export const cityChangeAction = createAction(Action.CITY_CHANGE, (cityName: CityName) => ({ payload: cityName }));
export const sortingOrderChangeAction = createAction(Action.CHANGE_SORTING_ORDER, (sortingOrder: SortVariants) => ({ payload: sortingOrder }));
export const setError = createAction<string | null>(Action.SET_ERROR);
