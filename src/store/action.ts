import { createAction } from '@reduxjs/toolkit';

export const Action = {
  SET_ERROR: 'SET_ERROR',
} as const;

export const setError = createAction<string | null>(Action.SET_ERROR);
