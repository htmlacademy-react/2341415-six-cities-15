import CardsList from '../../components/cards/cards-list';
import { CityName, Offer } from '../../types';
import { CITIES } from '../../const';
import Tabs from '../../components/tabs/tabs';
import { useState } from 'react';
import CityMap from '../../components/map/map';
import { cityLocation } from '../../mocks/city-locations';
import { offerToPoint } from '../../utils';

type MainScreenProps = {
  [key in CityName]: Offer[];
};

function MainScreen(props: MainScreenProps): JSX.Element {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const cityOffers = props[selectedCity] ?? [];
  const [selectedOfferId, setActiveOfferId] = useState<undefined | string>(undefined);

  return (
    <main className="page__main page__main--index">
      <h1 className="visually-hidden">Cities</h1>
      <div className="tabs">
        <section className="locations container">
          <ul className="locations__list tabs__list">
            {CITIES.map((cityName) => <Tabs key={cityName} cityName={cityName} onClick={setSelectedCity}/>)}
          </ul>
        </section>
      </div>
      <div className="cities">
        <div className="cities__places-container container">
          <section className="cities__places places">
            <h2 className="visually-hidden">Places</h2>
            <b className="places__found">312 places to stay in Amsterdam</b>
            <form className="places__sorting" action="#" method="get">
              <span className="places__sorting-caption">Sort by</span>
              <span className="places__sorting-type" tabIndex={0}>
                  Popular
                <svg className="places__sorting-arrow" width="7" height="4">
                  <use xlinkHref="#icon-arrow-select"></use>
                </svg>
              </span>
              <ul className="places__options places__options--custom places__options--opened">
                <li className="places__option places__option--active" tabIndex={0}>Popular</li>
                <li className="places__option" tabIndex={0}>Price: low to high</li>
                <li className="places__option" tabIndex={0}>Price: high to low</li>
                <li className="places__option" tabIndex={0}>Top rated first</li>
              </ul>
            </form>
            <div className="cities__places-list places__list tabs__content">
              <CardsList offers={cityOffers} onCardMouseEnter={setActiveOfferId} onCardMouseLeave={() => setActiveOfferId(undefined)} />
            </div>
          </section>
          <div className="cities__right-section">
            <section className="cities__map map">
              <CityMap
                city={{ name: selectedCity, location: cityLocation[selectedCity] }}
                points={cityOffers.map(offerToPoint)}
                selectedPointId={selectedOfferId}
                style={{ height: '744px', width: '512px' }}
              />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

export type {
  MainScreenProps
};

export default MainScreen;
