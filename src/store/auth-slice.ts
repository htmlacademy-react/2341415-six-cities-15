import { AuthorizationStatus } from '../const';
import { getToken } from '../services/token';
import { UserApi } from '../services/user-api';
import { AuthData, Offer, UserData } from '../types';

import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { FavoritesApi } from '../services/favorites-api';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type State = {
  error: string | null;
  user: UserData | null;
  favoriteOffers: Offer[];
}

const initialState: State = {
  error: null,
  user: null,
  favoriteOffers: []
};

const authSLice = createSliceWithThunks({
  name: 'auth',
  initialState,
  selectors: {
    selectUser: (state) => state.user,
    selectAuthorizationStatus: (state) => state.user ? AuthorizationStatus.Auth : AuthorizationStatus.NoAuth,
    selectFavoriteOffers: (state) => state.favoriteOffers,
  },
  reducers: (create) => ({
    clearFavoritesAction: create.reducer((state) => {
      state.favoriteOffers = [];
    }),
    checkAuthAction: create.asyncThunk<{ user: UserData; favoriteOffers: Offer[] } | { user: null; favoriteOffers: [] }, undefined, { extra: { userApi: UserApi; favoritesApi: FavoritesApi }}>(
      async (_arg, { extra: { userApi, favoritesApi } }) => {
        const token = getToken();
        if(!token) {
          return { user: null, favoriteOffers: [] };
        }
        try {
          const user = await userApi.getAuthorizedUser();
          const favoriteOffers = await favoritesApi.getList();
          return { user, favoriteOffers };
        } catch {
          return { user: null, favoriteOffers: []};
        }
      },
      {
        fulfilled: (state, action) => {
          const { user, favoriteOffers } = action.payload;

          state.user = user;
          state.favoriteOffers = favoriteOffers;
        },
      }
    ),
    loginAction: create.asyncThunk<{ user: UserData | null; favoriteOffers: Offer[] }, AuthData , { extra: { userApi: UserApi; favoritesApi: FavoritesApi }}>(
      async (authData, { extra: { userApi, favoritesApi } }) => {
        const user = await userApi.login(authData);
        const favoriteOffers = await favoritesApi.getList();
        return { user, favoriteOffers };
      },
      {
        fulfilled: (state, action) => {
          const { user, favoriteOffers } = action.payload;
          state.user = user;
          state.favoriteOffers = favoriteOffers;
        },
      }
    ),
    logoutAction: create.asyncThunk<void, undefined, { extra: { userApi: UserApi }}>(
      async (_arg, { extra: { userApi } }) => {
        await userApi.logout();
      },
      {
        fulfilled: (state) => {
          state.user = null;
          state.favoriteOffers = [];
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
      async ({ id, isFavorite }, { extra: { favoritesApi } }) => favoritesApi.changeIsFavorite(id, isFavorite),
      {
        fulfilled: (state, action) => {
          const updatedOffer = action.payload;

          if (updatedOffer.isFavorite){
            state.favoriteOffers = [...state.favoriteOffers, updatedOffer];
          } else {
            state.favoriteOffers = state.favoriteOffers.filter((offer) => offer.id !== updatedOffer.id);
          }
        },
      }
    )
  }),
});
export default authSLice;
export const { selectAuthorizationStatus, selectUser, selectFavoriteOffers } = authSLice.selectors;
export const { checkAuthAction, loginAction, logoutAction, fetchIsFavoritesAction, fetchFavoritesAction } = authSLice.actions;
