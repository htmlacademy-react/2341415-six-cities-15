import { CityName } from '../../types';
import { CITIES } from '../../const';
import Tabs from '../../components/tabs/tabs';
import { useAppDispatch, useAppSelector } from '../../hooks/app-dispatch';
import LoadingScreen from '../loading-screen/loading-screen';
import { cityChangeAction, selectCity, selectIsOffersDataLoading, selectOffers } from '../../store/city-offers-slice';
import CardsWidget from '../../components/cards/cards-widget';
import CardsWidgetEmpty from '../../components/cards/cards-widget-empty';

function MainScreen(): JSX.Element {
  const dispatch = useAppDispatch();
  const selectedCity = useAppSelector(selectCity);
  const cityOffers = useAppSelector(selectOffers);
  const isOffersDataLoading = useAppSelector(selectIsOffersDataLoading);

  const onTabClick = (cityName: CityName) => {
    const action = cityChangeAction(cityName);
    dispatch(action);
  };

  if(isOffersDataLoading) {
    return <LoadingScreen />;
  }

  return (
    <main className={cityOffers.length > 0
      ? 'page__main page__main--index'
      : 'page__main page__main--index page__main--index-empty'}
    >
      <h1 className="visually-hidden">Cities</h1>
      <div className="tabs">
        <section className="locations container">
          <ul className="locations__list tabs__list">
            {CITIES.map((cityName) => <Tabs key={cityName} cityName={cityName} selectedCity={selectedCity} onClick={onTabClick}/>)}
          </ul>
        </section>
      </div>
      <div className="cities">
        {cityOffers.length > 0
          ? <CardsWidget cityOffers={cityOffers} selectedCity={selectedCity} />
          : <CardsWidgetEmpty selectedCity={selectedCity} />}
      </div>
    </main>
  );
}

export default MainScreen;
