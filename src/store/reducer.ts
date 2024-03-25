import {createReducer} from '@reduxjs/toolkit';
import { AuthorizationStatus, DEFAULT_CITY, DEFAULT_SORTING_ORDER, SortVariants } from '../const';
import { CityName, Offer, OfferCard } from '../types';
import { cityChangeAction, sortingOrderChangeAction, setError } from './action';
import { comparators } from '../utils';
import { fetchOffersAction, fetchOffersByIdAction, loginAction } from './api-actions';

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
      state.authorizationStatus = action.payload;
    })
    .addCase(
      setError,
      (state, action) => {
        state.error = action.payload;
      }
    );
});

