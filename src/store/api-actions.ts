import {AxiosInstance} from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';
import { setError } from './action';
import {saveToken, dropToken} from '../services/token';
import {APIRoute, AuthorizationStatus, TIMEOUT_SHOW_ERROR } from '../const';
import { AppDispatch } from '../hooks/app-dispatch';
import { State } from './store';
import { AuthData, CityName, Offer, OfferCard } from '../types.js';
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

export const checkAuthAction = createAsyncThunk<AuthorizationStatus, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'checkAuthAction/login',
  async (_arg, { extra: api}) => {
    try {
      await api.get(APIRoute.Login);
      return AuthorizationStatus.Auth;
    } catch {
      return AuthorizationStatus.NoAuth;
    }
  },
);

export const loginAction = createAsyncThunk<AuthorizationStatus, AuthData, {
  dispatch: AppDispatch;
  state: State;
  extra: { userApi: UserApi };
}>(
  'loginAction/login',
  async (authData, { extra: { userApi } }) => {
    const { token } = await userApi.login(authData);
    saveToken(token);
    return AuthorizationStatus.Auth;
  },
);


export const logoutAction = createAsyncThunk<AuthorizationStatus, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'logoutAction/logout',
  async (_arg, { extra: api}) => {
    await api.delete(APIRoute.Logout);
    dropToken();
    return AuthorizationStatus.NoAuth;
  },
);
