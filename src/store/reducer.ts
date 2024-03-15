import {createReducer} from '@reduxjs/toolkit';
import { DEFAULT_CITY } from '../const';
import { offers } from '../mocks/offer';
import { CityName, Offer } from '../types';
import { cityChangeAction } from './action';

type OfferState = {
  city: CityName;
  offers: Offer[];
}

const initialState: OfferState = {
  city: DEFAULT_CITY,
  offers: offers.filter((offer) => offer.city.name === DEFAULT_CITY),
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(
      cityChangeAction,
      (state, actionObj) => {
        const newCityName = actionObj.payload;
        state.city = newCityName;
        state.offers = offers.filter((offer) => offer.city.name === newCityName);
      });
});

