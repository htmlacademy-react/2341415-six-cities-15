import {createReducer} from '@reduxjs/toolkit';
import { setError } from './action';

type OfferState = {
  error: string | null;
}

const initialState: OfferState = {
  error: null,
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(
      setError,
      (state, action) => {
        state.error = action.payload;
      }
    );
});

