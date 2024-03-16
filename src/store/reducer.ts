import {createReducer} from '@reduxjs/toolkit';
import { DEFAULT_CITY, DEFAULT_SORTING_ORDER, SortVariants } from '../const';
import { offers } from '../mocks/offer';
import { CityName, Offer } from '../types';
import { cityChangeAction, sortingOrderChangeAction } from './action';
import { comparators } from '../utils';

type OfferState = {
  city: CityName;
  offers: Offer[];
  selectedSorting: SortVariants;
}

const initialState: OfferState = {
  city: DEFAULT_CITY,
  offers: offers.filter((offer) => offer.city.name === DEFAULT_CITY).sort(comparators[DEFAULT_SORTING_ORDER]),
  selectedSorting: DEFAULT_SORTING_ORDER,
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(
      cityChangeAction,
      (state, action) => {
        const newCityName = action.payload;
        state.city = newCityName;
        state.offers = offers.filter((offer) => offer.city.name === newCityName);
      })
    .addCase(
      sortingOrderChangeAction,
      (state, action) => {
        const newSelectedSorting = action.payload;
        state.selectedSorting = newSelectedSorting;
        state.offers = newSelectedSorting === DEFAULT_SORTING_ORDER ? initialState.offers : state.offers.sort(comparators[newSelectedSorting]);
      }
    );
});

