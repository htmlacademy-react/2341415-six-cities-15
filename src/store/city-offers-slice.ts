import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { DEFAULT_CITY, DEFAULT_SORTING_ORDER, SortVariants } from '../const';
import { CityName, Offer } from '../types';
import { OfferApi } from '../services/offer-api';
import { COMPARATORS } from '../utils';

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
    selectOffers: (state) => state.offers,
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
      state.offers = newSelectedSorting === DEFAULT_SORTING_ORDER ? initialState.offers : state.offers.sort(COMPARATORS[newSelectedSorting]);
    }),
    fetchOffersAction: create.asyncThunk<Offer[], CityName, { extra: { offerApi: OfferApi }}>(
      async (cityName, { extra: { offerApi }}) => offerApi.getList(cityName),
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
