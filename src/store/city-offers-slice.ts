import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { DEFAULT_CITY, DEFAULT_SORTING_ORDER, SortVariants } from '../const';
import { CityName, Offer } from '../types';
import { OfferApi } from '../services/offer-api';
import { comparators } from '../utils';
import { FavoritesApi } from '../services/favorites-api';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type OfferState = {
  city: CityName;
  offers: Offer[];
  selectedSorting: SortVariants;
  isOffersDataLoading: boolean;
  favoriteOffers: Offer[];
}

const initialState: OfferState = {
  city: DEFAULT_CITY,
  offers: [],
  selectedSorting: DEFAULT_SORTING_ORDER,
  isOffersDataLoading: false,
  favoriteOffers: []
};

const cityOffersSlice = createSliceWithThunks({
  name: 'offers',
  initialState,
  selectors: {
    selectIsOffersDataLoading: (state) => state.isOffersDataLoading,
    selectOffers: (state) => state.offers,
    selectCity: (state) => state.city,
    selectSorting: (state) => state.selectedSorting,
    selectFavoriteOffers: (state) => state.favoriteOffers,
  },
  reducers: (create) => ({
    cityChangeAction: create.reducer<CityName>((state, action) => {
      state.city = action.payload;
    }),
    sortingOrderChangeAction: create.reducer<SortVariants>((state, action) => {
      const newSelectedSorting = action.payload;
      state.selectedSorting = newSelectedSorting;
      state.offers = newSelectedSorting === DEFAULT_SORTING_ORDER ? initialState.offers : state.offers.sort(comparators[newSelectedSorting]);
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
    fetchFavoritesAction: create.asyncThunk<Offer[], undefined, { extra: { favoritesApi: FavoritesApi }}>(
      async (_arg, { extra: { favoritesApi }}) => favoritesApi.getList(),
      {
        fulfilled: (state, action) => {
          state.favoriteOffers = action.payload;
        },
      }
    ),
    fetchIsFavoritesAction: create.asyncThunk<Offer, { id: string; isFavorite: boolean }, { extra: { favoritesApi: FavoritesApi } }>(
      async ({ id, isFavorite }, { extra: { favoritesApi } }) => {
        const offer = await favoritesApi.changeIsFavorite(id, isFavorite);
        favoritesApi.getList();
        return offer;
      },
      {
        fulfilled: (state, action) => {
          const updatedOffer = action.payload;

          if (updatedOffer.isFavorite){
            state.favoriteOffers = [...state.favoriteOffers, updatedOffer];
          } else {
            state.favoriteOffers = state.favoriteOffers.filter((offer) => offer.id !== updatedOffer.id);
          }

          const offer = state.offers.find((item) => item.id === updatedOffer.id);

          if (offer) {
            offer.isFavorite = updatedOffer.isFavorite;
          }
        },
      }
    )
  }),
});

export default cityOffersSlice;
export const { fetchOffersAction, cityChangeAction, sortingOrderChangeAction, fetchFavoritesAction, fetchIsFavoritesAction } = cityOffersSlice.actions;
export const { selectIsOffersDataLoading, selectOffers, selectCity, selectSorting, selectFavoriteOffers } = cityOffersSlice.selectors;
