import { AuthorizationStatus } from '../const';
import { getToken } from '../services/token';
import { UserApi } from '../services/user-api';
import { AuthData, Offer, UserData } from '../types';

import { buildCreateSlice, asyncThunkCreator, createAction } from '@reduxjs/toolkit';
import { FavoritesApi } from '../services/favorites-api';
import { showErrorMessage } from '../utils';
import { Action } from './action';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type State = {
  error: string | null;
  user: UserData | null;
  favoriteOffers: Offer[];
  addingToFavoritesOfferIds: string[];
  isFavoritesLoading: boolean;
  token: string | null;
}

const initialState: State = {
  error: null,
  user: null,
  addingToFavoritesOfferIds: [],
  favoriteOffers: [],
  isFavoritesLoading: false,
  token: getToken(),
};

const setUser = createAction<UserData>(Action.SET_USER);
const setFavoriteOffers = createAction<Offer[]>(Action.SET_FAVORITES);
const setIsFavoritesLoading = createAction<boolean>(Action.SET_IS_FAVORITES);

const authSLice = createSliceWithThunks({
  name: 'auth',
  initialState,
  selectors: {
    selectUser: (state) => state.user,
    selectIsFavoritesLoading: (state) => state.isFavoritesLoading,
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
  extraReducers: (builder) => {
    builder.addCase(
      setUser,
      (state, action) => {
        state.user = action.payload;
        state.token = action.payload.token;
      }
    );
    builder.addCase(
      setFavoriteOffers,
      (state, action) => {
        state.favoriteOffers = action.payload;
      }
    );
    builder.addCase(
      setIsFavoritesLoading,
      (state, action) => {
        state.isFavoritesLoading = action.payload;
      }
    );
  },
  reducers: (create) => ({
    clearFavoritesAction: create.reducer((state) => {
      state.favoriteOffers = [];
    }),
    setUserAction: create.reducer<UserData>((state) => {
      state.favoriteOffers = [];
    }),
    checkAuthAction: create.asyncThunk<void, undefined, { extra: { userApi: UserApi; favoritesApi: FavoritesApi } }>(
      async (_arg, { extra: { userApi, favoritesApi }, dispatch, getState }) => {
        const state = getState() as { auth: State };

        if(!state.auth.token) {
          return;
        }

        const user = await userApi.getAuthorizedUser().catch((err) => {
          showErrorMessage('authorization error', dispatch);
          throw err;
        });

        dispatch(setIsFavoritesLoading(true));
        dispatch(setUser(user));

        const favoriteOffers = await favoritesApi.getList().catch((err) => {
          showErrorMessage('favorites offers getting error', dispatch);
          dispatch(setIsFavoritesLoading(false));
          throw err;
        });

        dispatch(setFavoriteOffers(favoriteOffers));
        dispatch(setIsFavoritesLoading(false));
      },
      {
        fulfilled: (state) => {
          state.isFavoritesLoading = false;
        },
        rejected: (state) => {
          state.isFavoritesLoading = false;

          if (!state.user) {
            state.token = null;
          }
        }
      }
    ),
    loginAction: create.asyncThunk<void, AuthData , { extra: { userApi: UserApi; favoritesApi: FavoritesApi }}>(
      async (authData, { extra: { userApi, favoritesApi }, dispatch }) => {
        const user = await userApi.login(authData).catch((err) => {
          showErrorMessage('authorization error', dispatch);
          throw err;
        });

        dispatch(setUser(user));

        const favoriteOffers = await favoritesApi.getList().catch((err) => {
          showErrorMessage('favorites offers getting error', dispatch);
          throw err;
        });

        dispatch(setFavoriteOffers(favoriteOffers));
      }
    ),
    logoutAction: create.asyncThunk<void, undefined, { extra: { userApi: UserApi }}>(
      async (_arg, { extra: { userApi }, dispatch }) => {
        await userApi.logout().catch((err) => {
          showErrorMessage('logout', dispatch);
          throw err;
        });
      },
      {
        fulfilled: (state) => {
          state.token = null;
          state.user = null;
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
export const { selectAuthorizationStatus, selectUser, selectFavoriteOffers, selectAddingToFavoritesOfferIds, selectIsFavoritesLoading } = authSLice.selectors;
export const { checkAuthAction, loginAction, logoutAction, fetchIsFavoritesAction, fetchFavoritesAction } = authSLice.actions;
