import CardsList from './cards-list';
import { CityName, Offer } from '../../types';
import { useCallback, useState } from 'react';
import CityMap from '../map/map';
import { offerToPoint } from '../../utils';
import { useAppSelector } from '../../hooks/app-dispatch';
import Sort from '../sort/sort';
import { selectSorting } from '../../store/city-offers-slice';
import { CITY_LOCATION } from '../../const';

type Props = {
  cityOffers: Offer[];
  selectedCity: CityName;
}

function CardsWidget({ cityOffers, selectedCity }: Props): JSX.Element {

  const [selectedOfferId, setActiveOfferId] = useState<undefined | string>(undefined);
  const selectedSorting = useAppSelector(selectSorting);
  const handleCardMouseLeave = useCallback(() => setActiveOfferId(undefined),[]);

  return (
    <div className="cities__places-container container">
      <section className="cities__places places">
        <h2 className="visually-hidden">Places</h2>
        <b className="places__found">{cityOffers.length} place{cityOffers.length > 1 ? 's' : ''} to stay in {selectedCity}</b>
        <Sort selectedSorting={selectedSorting}/>
        <div className="cities__places-list places__list tabs__content">
          <CardsList offers={cityOffers} onCardMouseEnter={setActiveOfferId} onCardMouseLeave={handleCardMouseLeave} />
        </div>
      </section>
      <div className="cities__right-section">
        <CityMap
          city={{ name: selectedCity, location: CITY_LOCATION[selectedCity] }}
          points={cityOffers.map(offerToPoint)}
          selectedPointId={selectedOfferId}
          className='cities__map'
        />
      </div>
    </div>
  );
}

export default CardsWidget;
