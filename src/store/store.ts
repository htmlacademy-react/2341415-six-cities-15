import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';
import { offerApi } from '../services/offer-api';
import { userApi } from '../services/user-api';
import { commentsApi } from '../services/comments-api';
import cityOffersSlice from './city-offers-slice';
import favoriteOffersSlice from './city-offers-slice';
import { favoritesApi } from '../services/favorites-api';
import authSLice from './auth-slice';
import offerCardSlice from './offer-card-slice';

export type State = ReturnType<typeof store.getState>;

const store = configureStore({
  reducer: {
    offers: cityOffersSlice.reducer,
    favorites: favoriteOffersSlice.reducer,
    auth: authSLice.reducer,
    offerCard: offerCardSlice.reducer,
    other: reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          offerApi,
          userApi,
          commentsApi,
          favoritesApi
        },
      },
    }),
});

export default store;
