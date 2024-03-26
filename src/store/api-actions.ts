import {createAsyncThunk} from '@reduxjs/toolkit';
import { setError } from './action';
import {saveToken, dropToken, getToken} from '../services/token';
import { TIMEOUT_SHOW_ERROR } from '../const';
import { AppDispatch } from '../hooks/app-dispatch';
import { State } from './store';
import { AuthData, CityName, Offer, OfferCard, UserData } from '../types.js';
import { OfferApi } from '../services/offer-api.js';
import { UserApi } from '../services/user-api.js';

export const clearErrorAction = createAsyncThunk(
  'clearError',
  (_arg, { dispatch }) => {
    setTimeout(
      () => dispatch(setError(null)),
      TIMEOUT_SHOW_ERROR,
    );
  },
);

export const fetchOffersAction = createAsyncThunk<Offer[], CityName, {
  dispatch: AppDispatch;
  state: State;
  extra: { offerApi: OfferApi };
}>(
  'fetchOffersAction/offers',
  (cityName, { extra: { offerApi }}) => offerApi.getList(cityName),
);

export const fetchOffersByIdAction = createAsyncThunk<OfferCard, string, {
  dispatch: AppDispatch;
  state: State;
  extra: { offerApi: OfferApi };
}>(
  'fetchOffersByIdAction/offers/id',
  (id, { extra: { offerApi }}) => offerApi.getBy(id),
);

export const checkAuthAction = createAsyncThunk<UserData | null, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: { userApi: UserApi };
}>(
  'checkAuthAction/login',
  async (_arg, { extra: { userApi }}) => {
    const token = getToken();
    if(!token) {
      return null;
    }
    try {
      const user = await userApi.getAuthorizedUser();
      return user;
    } catch {
      return null;
    }
  },
);

export const loginAction = createAsyncThunk<UserData, AuthData, {
  dispatch: AppDispatch;
  state: State;
  extra: { userApi: UserApi };
}>(
  'loginAction/login',
  async (authData, { extra: { userApi } }) => {
    const user = await userApi.login(authData);
    saveToken(user.token);
    return user;
  },
);

export const logoutAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: { userApi: UserApi };
}>(
  'logoutAction/logout',
  async (_arg, { extra: { userApi }}) => {
    await userApi.logout();
    dropToken();
  },
);
