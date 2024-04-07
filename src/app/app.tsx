import MainScreen from '../pages/main-screen/main-screen';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFoundPage from '../pages/error-screen/error-404-screen';
import FavoritesScreen from '../pages/favorites-screen/favorites-screen';
import LoginScreen from '../pages/login-screen/login-screen';
import PrivateRoute from '../components/private-route/private-route';
import { AppRoute, DEFAULT_CITY } from '../const';
import Layout from './layout';
import ErrorMessage from '../components/error-message/error-message';
import { useAppDispatch, useAppSelector } from '../hooks/app-dispatch';
import LoadingScreen from '../pages/loading-screen/loading-screen';
import { useEffect } from 'react';
import OfferScreenPreloader from '../pages/offer-screen/offer-screen-preloader';
import { fetchOffersAction, selectIsOffersDataLoading } from '../store/city-offers-slice';
import { checkAuthAction, selectAuthorizationStatus } from '../store/auth-slice';

function App(): JSX.Element {
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const isOffersDataLoading = useAppSelector(selectIsOffersDataLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchOffersAction(DEFAULT_CITY));
    dispatch(checkAuthAction());
  },[dispatch]);

  if(isOffersDataLoading) {
    return (
      <LoadingScreen/>
    );
  }

  return (
    <>
      <ErrorMessage />
      <BrowserRouter>
        <Routes>
          <Route path={AppRoute.Main} element={<Layout />}>
            <Route index element={<MainScreen />} />
            <Route path={AppRoute.Favorites} element={
              <PrivateRoute authorizationStatus={authorizationStatus}>
                <FavoritesScreen />
              </PrivateRoute>
            }
            />
            <Route path={AppRoute.Login} element={
              <PrivateRoute authorizationStatus={authorizationStatus} isReverse>
                <LoginScreen />
              </PrivateRoute>
            }
            />
            <Route path={AppRoute.Offer} >
              <Route index element={<NotFoundPage />} />
              <Route path={AppRoute.OfferId} element={<OfferScreenPreloader />} />
            </Route>
            <Route path='*' element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
