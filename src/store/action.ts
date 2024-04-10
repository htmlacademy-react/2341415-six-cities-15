import { createAction } from '@reduxjs/toolkit';

export const Action = {
  SET_ERROR: 'SET_ERROR',
  SET_USER: 'SET_USER',
  SET_FAVORITES: 'SET_FAVORITES',
  SET_IS_FAVORITES: 'SET_IS_FAVORITES',
  RESET_USER_DATA: 'RESET_USER_DATA',
} as const;

export const setError = createAction<string | null>(Action.SET_ERROR);
