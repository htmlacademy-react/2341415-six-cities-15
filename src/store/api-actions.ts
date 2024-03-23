import {AxiosInstance} from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {loadOfferByIdAction, loadOffersAction, requireAuthorizationAction, setError } from './action';
import {saveToken, dropToken} from '../services/token';
import {APIRoute, AuthorizationStatus, TIMEOUT_SHOW_ERROR } from '../const';
import { AppDispatch } from '../hooks/app-dispatch';
import { State } from './store';
import { AuthData, CityName, UserData } from '../types.js';
import { OfferApi } from '../services/offer-api.js';

export const clearErrorAction = createAsyncThunk(
  'clearError',
  (_arg, { dispatch }) => {
    setTimeout(
      () => dispatch(setError(null)),
      TIMEOUT_SHOW_ERROR,
    );
  },
);

export const fetchOffersAction = createAsyncThunk<void, CityName, {
  dispatch: AppDispatch;
  state: State;
  extra: { offerApi: OfferApi };
}>(
  '/offers',
  async (cityName, {dispatch, extra: { offerApi }}) => {
    const offers = await offerApi.getList(cityName);
    dispatch(loadOffersAction(offers));
  },
);

export const fetchOffersByIdAction = createAsyncThunk<void, string, {
  dispatch: AppDispatch;
  state: State;
  extra: { offerApi: OfferApi };
}>(
  '/offers/id',
  async (id, {dispatch, extra: { offerApi }}) => {
    const offer = await offerApi.getBy(id);
    dispatch(loadOfferByIdAction(offer));
  },
);

export const checkAuthAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  '/login',
  async (_arg, {dispatch, extra: api}) => {
    try {
      await api.get(APIRoute.Login);
      dispatch(requireAuthorizationAction(AuthorizationStatus.Auth));
    } catch {
      dispatch(requireAuthorizationAction(AuthorizationStatus.NoAuth));
    }
  },
);

export const loginAction = createAsyncThunk<void, AuthData, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  '/login',
  async ({login: email, password}, {dispatch, extra: api}) => {
    const {data: {token}} = await api.post<UserData>(APIRoute.Login, {email, password});
    saveToken(token);
    dispatch(requireAuthorizationAction(AuthorizationStatus.Auth));
  },
);


export const logoutAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  '/logout',
  async (_arg, {dispatch, extra: api}) => {
    await api.delete(APIRoute.Logout);
    dropToken();
    dispatch(requireAuthorizationAction(AuthorizationStatus.NoAuth));
  },
);
