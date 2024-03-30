import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';
import { offerApi } from '../services/offer-api';
import { userApi } from '../services/user-api';
import { commentsApi } from '../services/comments-api';

export type State = ReturnType<typeof store.getState>;

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          offerApi,
          userApi,
          commentsApi
        },
      },
    }),
});

export default store;
