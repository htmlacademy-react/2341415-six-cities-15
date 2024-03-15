import { createAction } from '@reduxjs/toolkit';
import { CityName } from '../types';

export const Action = {
  CITY_CHANGE: 'CITY_CHANGE',
  ALL_OFFERS_ADDING: 'ALL_OFFERS_ADDING',
} as const;

export const cityChangeAction = createAction(Action.CITY_CHANGE, (cityName: CityName) => ({ payload: cityName }));

