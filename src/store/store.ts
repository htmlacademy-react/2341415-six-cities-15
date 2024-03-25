import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';
import { offerApi } from '../services/offer-api';
import { userApi } from '../services/user-api';

export type State = ReturnType<typeof store.getState>;

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          offerApi,
          userApi
        },
      },
    }),
});

export default store;
