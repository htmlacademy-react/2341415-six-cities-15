import {createReducer} from '@reduxjs/toolkit';
import { AuthorizationStatus, DEFAULT_CITY, DEFAULT_SORTING_ORDER, SortVariants } from '../const';
import { CityName, Offer, OfferCard, UserData } from '../types';
import { cityChangeAction, sortingOrderChangeAction, setError } from './action';
import { comparators } from '../utils';
import { checkAuthAction, fetchOffersAction, fetchOffersByIdAction, loginAction, logoutAction } from './api-actions';

type OfferState = {
  city: CityName;
  offers: Offer[];
  selectedSorting: SortVariants;
  favoriteOffers: Offer[];
  authorizationStatus: AuthorizationStatus;
  error: string | null;
  isOffersDataLoading: boolean;
  isSelectedOfferCardLoading: boolean;
  selectedOfferCard: OfferCard | null;
  neighbours: Offer[];
  user: UserData | null;
}

const initialState: OfferState = {
  city: DEFAULT_CITY,
  offers: [],
  selectedSorting: DEFAULT_SORTING_ORDER,
  favoriteOffers: [],
  authorizationStatus: AuthorizationStatus.NoAuth,
  error: null,
  isOffersDataLoading: false,
  isSelectedOfferCardLoading: false,
  selectedOfferCard: null,
  neighbours: [],
  user: null,
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
      state.isSelectedOfferCardLoading = false;
      state.selectedOfferCard = action.payload;
    })
    .addCase(fetchOffersByIdAction.rejected, (state) => {
      state.isSelectedOfferCardLoading = false;
      state.selectedOfferCard = null;
    })
    .addCase(fetchOffersByIdAction.pending, (state) => {
      state.isSelectedOfferCardLoading = true;
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

