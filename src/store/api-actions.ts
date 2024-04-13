import {createAsyncThunk} from '@reduxjs/toolkit';
import { setError } from './action';
import { TIMEOUT_SHOW_ERROR } from '../const';

export const clearErrorAction = createAsyncThunk(
  'clearError',
  (_arg, { dispatch }) => {
    setTimeout(
      () => dispatch(setError(null)),
      TIMEOUT_SHOW_ERROR,
    );
  },
);
