import { AuthorizationStatus } from '../const';
import { getToken } from '../services/token';
import { UserApi } from '../services/user-api';
import { AuthData, Offer, UserData } from '../types';

import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { FavoritesApi } from '../services/favorites-api';
import { showErrorMessage } from '../utils';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type State = {
  error: string | null;
  user: UserData | null;
  favoriteOffers: Offer[];
  addingToFavoritesOfferIds: string[];
  token: string | null;
}

const initialState: State = {
  error: null,
  user: null,
  addingToFavoritesOfferIds: [],
  favoriteOffers: [],
  token: getToken(),
};

const authSLice = createSliceWithThunks({
  name: 'auth',
  initialState,
  selectors: {
    selectUser: (state) => state.user,
    selectAddingToFavoritesOfferIds: (state) => state.addingToFavoritesOfferIds,
    selectAuthorizationStatus: (state) => {
      if (state.user) {
        return AuthorizationStatus.Auth;
      }

      if (state.token) {
        return AuthorizationStatus.Unknown;
      }

      return AuthorizationStatus.NoAuth;
    },
    selectFavoriteOffers: (state) => state.favoriteOffers,
  },
  reducers: (create) => ({
    clearFavoritesAction: create.reducer((state) => {
      state.favoriteOffers = [];
    }),
    setUserAction: create.reducer<UserData>((state) => {
      state.favoriteOffers = [];
    }),
    checkAuthAction: create.asyncThunk<{ user: UserData; favoriteOffers: Offer[] } | { user: null; favoriteOffers: [] }, undefined, { extra: { userApi: UserApi; favoritesApi: FavoritesApi } }>(
      async (_arg, { extra: { userApi, favoritesApi }, dispatch, getState }) => {
        const state = getState() as { auth: State };

        if(!state.auth.token) {
          return { user: null, favoriteOffers: [] };
        }

        try {
          const user = await userApi.getAuthorizedUser().catch((err) => {
            showErrorMessage('authorization error', dispatch);
            throw err;
          });
          const favoriteOffers = await favoritesApi.getList().catch((err) => {
            showErrorMessage('favorites offers getting error', dispatch);
            throw err;
          });
          return { user, favoriteOffers };
        } catch {
          return { user: null, favoriteOffers: []};
        }
      },
      {
        fulfilled: (state, action) => {
          const { user, favoriteOffers } = action.payload;

          state.user = user;
          state.token = user?.token ?? null;
          state.favoriteOffers = favoriteOffers;
        },
        rejected: (state) => {
          state.user = null;
          state.token = null;
        }
      }
    ),
    loginAction: create.asyncThunk<{ user: UserData | null; favoriteOffers: Offer[] }, AuthData , { extra: { userApi: UserApi; favoritesApi: FavoritesApi }}>(
      async (authData, { extra: { userApi, favoritesApi }, dispatch }) => {
        const user = await userApi.login(authData).catch((err) => {
          showErrorMessage('authorization error', dispatch);
          throw err;
        });
        const favoriteOffers = await favoritesApi.getList().catch((err) => {
          showErrorMessage('favorites offers getting error', dispatch);
          throw err;
        });
        return { user, favoriteOffers };
      },
      {
        fulfilled: (state, action) => {
          const { user, favoriteOffers } = action.payload;
          state.user = user;
          state.token = user?.token ?? null;
          state.favoriteOffers = favoriteOffers;
        }
      }
    ),
    logoutAction: create.asyncThunk<void, undefined, { extra: { userApi: UserApi }}>(
      async (_arg, { extra: { userApi }, dispatch }) => {
        await userApi.logout().catch((err) => {
          showErrorMessage('favorites offers getting error', dispatch);
          throw err;
        });
      },
      {
        fulfilled: (state) => {
          state.user = null;
          state.token = null;
          state.favoriteOffers = [];
        },
      }
    ),
    fetchFavoritesAction: create.asyncThunk<Offer[], undefined, { extra: { favoritesApi: FavoritesApi }}>(
      async (_arg, { extra: { favoritesApi }, dispatch }) => favoritesApi.getList().catch((err) => {
        showErrorMessage('favorite offer adding error', dispatch);
        throw err;
      }),
      {
        fulfilled: (state, action) => {
          state.favoriteOffers = action.payload;
        },
      }
    ),
    fetchIsFavoritesAction: create.asyncThunk<Offer, { id: string; isFavorite: boolean }, { extra: { favoritesApi: FavoritesApi } }>(
      async ({ id, isFavorite }, { extra: { favoritesApi }, dispatch }) => favoritesApi.changeIsFavorite(id, isFavorite).catch((err) => {
        showErrorMessage('favorite offer adding error', dispatch);
        throw err;
      }),
      {
        pending: (state, action) => {
          state.addingToFavoritesOfferIds = [...state.addingToFavoritesOfferIds, action.meta.arg.id];
        },
        fulfilled: (state, action) => {
          const updatedOffer = action.payload;

          if (updatedOffer.isFavorite){
            state.favoriteOffers = [...state.favoriteOffers, updatedOffer];
          } else {
            state.favoriteOffers = state.favoriteOffers.filter((offer) => offer.id !== updatedOffer.id);
          }

          state.addingToFavoritesOfferIds = state.addingToFavoritesOfferIds.filter((id) => id !== action.meta.arg.id);
        },
        rejected: (state, action) => {
          state.addingToFavoritesOfferIds = state.addingToFavoritesOfferIds.filter((id) => id !== action.meta.arg.id);
        },
      }
    )
  }),
});
export default authSLice;
export const { selectAuthorizationStatus, selectUser, selectFavoriteOffers, selectAddingToFavoritesOfferIds } = authSLice.selectors;
export const { checkAuthAction, loginAction, logoutAction, fetchIsFavoritesAction, fetchFavoritesAction } = authSLice.actions;
