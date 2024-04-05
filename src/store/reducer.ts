import {createReducer} from '@reduxjs/toolkit';
import { AuthorizationStatus, IS_LOADING, NOT_FOUND } from '../const';
import { Offer, OfferCard, UserData, Comment } from '../types';
import { setError } from './action';
import { isNotFoundError } from '../utils';
import { checkAuthAction, fetchCommentsAction, fetchOffersByIdAction, fetchOffersNearbyAction, fetchReviewAction, loginAction, logoutAction } from './api-actions';

type OfferState = {
  authorizationStatus: AuthorizationStatus;
  error: string | null;
  selectedOfferCard: OfferCard | null | typeof IS_LOADING | typeof NOT_FOUND;
  neighbours: Offer[];
  user: UserData | null;
  comments: Comment[];
}

const initialState: OfferState = {
  authorizationStatus: AuthorizationStatus.NoAuth,
  error: null,
  selectedOfferCard: null,
  neighbours: [],
  user: null,
  comments: [],
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(
      checkAuthAction.fulfilled,
      (state, action) => {
        state.user = action.payload;
        if(action.payload === null) {
          state.authorizationStatus = AuthorizationStatus.NoAuth;
        } else {
          state.authorizationStatus = AuthorizationStatus.Auth;
        }
      })
    .addCase(fetchOffersByIdAction.fulfilled, (state, action) => {
      state.selectedOfferCard = action.payload;
    })
    .addCase(fetchOffersByIdAction.rejected, (state, action) => {
      if (isNotFoundError(action.error)) {
        state.selectedOfferCard = NOT_FOUND;
      }
    })
    .addCase(fetchOffersByIdAction.pending, (state) => {
      state.selectedOfferCard = IS_LOADING;
    })
    .addCase(fetchOffersNearbyAction.fulfilled, (state, action) => {
      state.neighbours = action.payload;
    })
    .addCase(fetchOffersNearbyAction.rejected, (state) => {
      state.neighbours = [];
    })
    .addCase(fetchCommentsAction.rejected, (state) => {
      state.comments = [];
    })
    .addCase(fetchCommentsAction.fulfilled, (state, action) => {
      state.comments = action.payload;
    })
    .addCase(fetchReviewAction.fulfilled, (state, action) => {
      state.comments = [...state.comments, action.payload];
    })
    .addCase(loginAction.fulfilled, (state, action) => {
      state.authorizationStatus = AuthorizationStatus.Auth;
      state.user = action.payload;
    })
    .addCase(logoutAction.fulfilled, (state) => {
      state.authorizationStatus = AuthorizationStatus.NoAuth;
      state.user = null;
    })
    .addCase(
      setError,
      (state, action) => {
        state.error = action.payload;
      }
    );
});

