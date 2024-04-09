import MainScreen from '../pages/main-screen/main-screen';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFoundPage from '../pages/error-screen/error-404-screen';
import FavoritesScreen from '../pages/favorites-screen/favorites-screen';
import LoginScreen from '../pages/login-screen/login-screen';
import PrivateRoute from '../components/private-route/private-route';
import { AppRoute, AuthorizationStatus } from '../const';
import Layout from './layout';
import ErrorMessage from '../components/error-message/error-message';
import { useAppSelector } from '../hooks/app-dispatch';
import LoadingScreen from '../pages/loading-screen/loading-screen';
import OfferScreenPreloader from '../pages/offer-screen/offer-screen-preloader';
import { selectIsOffersDataLoading } from '../store/city-offers-slice';
import { selectAuthorizationStatus } from '../store/auth-slice';

function App(): JSX.Element {
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const isOffersDataLoading = useAppSelector(selectIsOffersDataLoading);
  const isLoading = authorizationStatus === AuthorizationStatus.Unknown || isOffersDataLoading;

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
          {
            isLoading ? <Route path='*' element={<LoadingScreen />} /> :
              <Route path={AppRoute.Main} element={<Layout />}>
                <Route index element={<MainScreen />} />
                <Route path={AppRoute.Favorites} element={
                  <PrivateRoute
                    predicate={authorizationStatus === AuthorizationStatus.Auth}
                    falsePredicateRoute={AppRoute.Login}
                  >
                    <FavoritesScreen />
                  </PrivateRoute>
                }
                />
                <Route path={AppRoute.Login} element={
                  <PrivateRoute
                    predicate={authorizationStatus === AuthorizationStatus.NoAuth}
                    falsePredicateRoute={AppRoute.Main}
                  >
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
          }
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
