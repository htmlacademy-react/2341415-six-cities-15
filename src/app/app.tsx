import MainScreen from '../pages/main-screen/main-screen';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFoundPage from '../pages/error-screen/error-404-screen';
import FavoritesScreen from '../pages/favorites-screen/favorites-screen';
import LoginScreen from '../pages/login-screen/login-screen';
import OfferScreen from '../pages/offer-screen/offer-screen';
import PrivateRoute from '../components/private-route/private-route';
import { AppRoute } from '../const';
import Layout from './layout';
import ErrorMessage from '../components/error-message/error-message';
import { useAppSelector } from '../hooks/app-dispatch';
import LoadingScreen from '../pages/loading-screen/loading-screen';

function App(): JSX.Element {
  const authorizationStatus = useAppSelector((state) => state.authorizationStatus);
  const isOffersDataLoading = useAppSelector((state) => state.isOffersDataLoading);
  const offers = useAppSelector((state) => state.offers);

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
                <FavoritesScreen offers={offers.filter((offer) => offer.isFavorite === true)}/>
              </PrivateRoute>
            }
            />
            <Route path={AppRoute.Login} element={
              <PrivateRoute authorizationStatus={authorizationStatus} isReverse>
                <LoginScreen />
              </PrivateRoute>
            }
            />
            <Route path={AppRoute.Offer} element={<OfferScreen />}>
              <Route path={AppRoute.OfferId} element={<OfferScreen />} />
            </Route>
            <Route path='*' element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
