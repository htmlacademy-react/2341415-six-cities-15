import { groupBy } from 'lodash';
import { useAppSelector } from '../../hooks/app-dispatch';
import FavoriteListItem from './favorite-list-item';
import { selectFavoriteOffers } from '../../store/auth-slice';

function FavoriteList(): JSX.Element {
  const favorites = useAppSelector(selectFavoriteOffers);
  const groupedFavorites = groupBy(favorites, 'city.name');

  return (
    <ul className="favorites__list">
      {Object.entries(groupedFavorites).map(([cityName, cityOffers]) => <FavoriteListItem key={cityName} cityName={cityName} cityOffers={cityOffers} />)}
    </ul>
  );
}

export default FavoriteList;
