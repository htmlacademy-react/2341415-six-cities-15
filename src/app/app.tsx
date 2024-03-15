import { StrictMode } from 'react';
import MainScreen from '../pages/main-screen/main-screen';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFoundPage from '../pages/error-screen/error-404-screen';
import FavoritesScreen from '../pages/favorites-screen/favorites-screen';
import LoginScreen from '../pages/login-screen/login-screen';
import OfferScreen from '../pages/offer-screen/offer-screen';
import PrivateRoute from '../components/private-route/private-route';
import { AppRoute } from '../const';
import Layout from './layout';
import { getAuthorizationStatus } from '../pages/authorization-status';
import { OfferCard } from '../types';
import { Provider } from 'react-redux';
import store from '../store/store';

type AppScreenProps = {
  offers: OfferCard[];
};

function App({ offers}: AppScreenProps): JSX.Element {
  const authorizationStatus = getAuthorizationStatus();
  return (
    <StrictMode>
      <Provider store={store}>
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
              <Route path={AppRoute.Offer} element={<OfferScreen offers={offers} />}>
                <Route path={AppRoute.OfferId} element={<OfferScreen offers={offers}/>} />
              </Route>
              <Route path='*' element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </StrictMode>
  );
}

export default App;
