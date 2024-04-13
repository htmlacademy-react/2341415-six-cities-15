import { groupBy } from 'lodash';
import FavoriteListItem from './favorite-list-item';
import { CityName, Offer } from '../../types';

type Props = {
  favorites: Offer[];
};

function FavoriteList({ favorites }: Props): JSX.Element | null {
  const groupedFavorites = groupBy(favorites, 'city.name');

  return favorites.length === 0 ? null : (
    <>
      <h1 className="favorites__title">Saved listing</h1>
      <ul className="favorites__list">
        {Object.entries(groupedFavorites).map(([cityName, cityOffers]) => <FavoriteListItem key={cityName} cityName={cityName as CityName} cityOffers={cityOffers} />)}
      </ul>
    </>
  );
}

export default FavoriteList;
