import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { DEFAULT_CITY, DEFAULT_SORTING_ORDER, SortVariants } from '../const';
import { CityName, Offer } from '../types';
import { OfferApi } from '../services/offer-api';
import { COMPARATORS, showErrorMessage } from '../utils';
import { createSelector } from 'reselect';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type OfferState = {
  city: CityName;
  offers: Offer[];
  selectedSorting: SortVariants;
  isOffersDataLoading: boolean;
}

const initialState: OfferState = {
  city: DEFAULT_CITY,
  offers: [],
  selectedSorting: DEFAULT_SORTING_ORDER,
  isOffersDataLoading: false,
};

const cityOffersSlice = createSliceWithThunks({
  name: 'offers',
  initialState,
  selectors: {
    selectIsOffersDataLoading: (state) => state.isOffersDataLoading,
    selectOffers: createSelector(
      [
        (state: OfferState) => state.offers,
        (state: OfferState) => state.city,
        (state: OfferState) => state.selectedSorting,
      ],
      (offers, city, selectedSorting) => offers.filter((offer) => offer.city.name === city).sort(COMPARATORS[selectedSorting])
    ),
    selectCity: (state) => state.city,
    selectSorting: (state) => state.selectedSorting,
  },
  reducers: (create) => ({
    cityChangeAction: create.reducer<CityName>((state, action) => {
      state.city = action.payload;
    }),
    sortingOrderChangeAction: create.reducer<SortVariants>((state, action) => {
      const newSelectedSorting = action.payload;
      state.selectedSorting = newSelectedSorting;
    }),
    fetchOffersAction: create.asyncThunk<Offer[], undefined, { extra: { offerApi: OfferApi }}>(
      async (_arg, { extra: { offerApi }, dispatch}) => offerApi.getList().catch((err) => {
        showErrorMessage('offers loading error', dispatch);
        throw err;
      }),
      {
        pending: (state) => {
          state.isOffersDataLoading = true;
        },
        rejected: (state) => {
          state.isOffersDataLoading = false;
        },
        fulfilled: (state, action) => {
          state.isOffersDataLoading = false;
          state.offers = action.payload;
        },
      }
    ),
  }),
});

export default cityOffersSlice;
export const {
  fetchOffersAction,
  cityChangeAction,
  sortingOrderChangeAction,
} = cityOffersSlice.actions;
export const { selectIsOffersDataLoading, selectOffers, selectCity, selectSorting } = cityOffersSlice.selectors;
