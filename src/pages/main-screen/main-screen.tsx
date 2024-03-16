import CardsList from '../../components/cards/cards-list';
import { CityName } from '../../types';
import { CITIES } from '../../const';
import Tabs from '../../components/tabs/tabs';
import { useState } from 'react';
import CityMap from '../../components/map/map';
import { cityLocation } from '../../mocks/city-locations';
import { offerToPoint } from '../../utils';
import { useAppDispatch, useAppSelector } from '../../hooks/app-dispatch';
import { cityChangeAction } from '../../store/action';
import Sort from '../../components/sort/sort';

function MainScreen(): JSX.Element {
  const [selectedOfferId, setActiveOfferId] = useState<undefined | string>(undefined);
  const dispatch = useAppDispatch();
  const selectedCity = useAppSelector((state) => state.city);
  const cityOffers = useAppSelector((state) => state.offers);

  const onTabClick = (cityName: CityName) => {
    const action = cityChangeAction(cityName);
    dispatch(action);
  };

  const selectedSorting = useAppSelector((state) => state.selectedSorting);

  return (
    <main className="page__main page__main--index">
      <h1 className="visually-hidden">Cities</h1>
      <div className="tabs">
        <section className="locations container">
          <ul className="locations__list tabs__list">
            {CITIES.map((cityName) => <Tabs key={cityName} cityName={cityName} selectedCity={selectedCity} onClick={onTabClick}/>)}
          </ul>
        </section>
      </div>
      <div className="cities">
        <div className="cities__places-container container">
          <section className="cities__places places">
            <h2 className="visually-hidden">Places</h2>
            <b className="places__found">{cityOffers.length} places to stay in {selectedCity}</b>
            <Sort selectedSorting={selectedSorting}/>
            <div className="cities__places-list places__list tabs__content">
              <CardsList offers={cityOffers} onCardMouseEnter={setActiveOfferId} onCardMouseLeave={() => setActiveOfferId(undefined)} />
            </div>
          </section>
          <div className="cities__right-section">
            <CityMap
              city={{ name: selectedCity, location: cityLocation[selectedCity] }}
              points={cityOffers.map(offerToPoint)}
              selectedPointId={selectedOfferId}
              className='cities__map'
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default MainScreen;
