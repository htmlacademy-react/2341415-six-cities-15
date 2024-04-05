import { createAction } from '@reduxjs/toolkit';

export const Action = {
  CITY_CHANGE: 'CITY_CHANGE',
  CHANGE_SORTING_ORDER: 'CHANGE_SORTING_ORDER',
  SET_ERROR: 'SET_ERROR',
  SET_USER:'SET_USER'
} as const;

export const setError = createAction<string | null>(Action.SET_ERROR);
