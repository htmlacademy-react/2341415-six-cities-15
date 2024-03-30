import {createReducer} from '@reduxjs/toolkit';
import { AuthorizationStatus, DEFAULT_CITY, DEFAULT_SORTING_ORDER, IS_LOADING, NOT_FOUND, SortVariants } from '../const';
import { CityName, Offer, OfferCard, UserData, Comment, Review } from '../types';
import { cityChangeAction, sortingOrderChangeAction, setError } from './action';
import { comparators, isNotFoundError } from '../utils';
import { checkAuthAction, fetchCommentsAction, fetchOffersAction, fetchOffersByIdAction, fetchOffersNearbyAction, fetchReviewAction, loginAction, logoutAction } from './api-actions';

type OfferState = {
  city: CityName;
  offers: Offer[];
  selectedSorting: SortVariants;
  favoriteOffers: Offer[];
  authorizationStatus: AuthorizationStatus;
  error: string | null;
  isOffersDataLoading: boolean;
  selectedOfferCard: OfferCard | null | typeof IS_LOADING | typeof NOT_FOUND;
  neighbours: Offer[];
  user: UserData | null;
  comments: Comment[];
  review: Review | null;
}

const initialState: OfferState = {
  city: DEFAULT_CITY,
  offers: [],
  selectedSorting: DEFAULT_SORTING_ORDER,
  favoriteOffers: [],
  authorizationStatus: AuthorizationStatus.NoAuth,
  error: null,
  isOffersDataLoading: false,
  selectedOfferCard: null,
  neighbours: [],
  user: null,
  comments: [],
  review: null

};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(
      cityChangeAction,
      (state, action) => {
        const newCityName = action.payload;
        state.city = newCityName;
      })
    .addCase(
      sortingOrderChangeAction,
      (state, action) => {
        const newSelectedSorting = action.payload;
        state.selectedSorting = newSelectedSorting;
        state.offers = newSelectedSorting === DEFAULT_SORTING_ORDER ? initialState.offers : state.offers.sort(comparators[newSelectedSorting]);
      }
    )
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
    .addCase(fetchOffersAction.pending, (state) => {
      state.isOffersDataLoading = true;
    })
    .addCase(fetchOffersAction.rejected, (state) => {
      state.isOffersDataLoading = false;
    })
    .addCase(fetchOffersAction.fulfilled, (state, action) => {
      state.isOffersDataLoading = false;
      state.offers = action.payload;
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

