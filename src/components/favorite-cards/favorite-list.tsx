import { CityName } from '../../types';
import { FavoriteCardProps } from './favorite-card';
import FavoriteListItem from './favorite-list-item';

type Props = {
  [key in CityName]: FavoriteCardProps[];
}

function FavoriteList(props: Props): JSX.Element {
  return (
    <ul className="favorites__list">
      {Object.entries(props).map(([cityName, cityOffers]) => <FavoriteListItem key={cityName} cityName={cityName} cityOffers={cityOffers} />)}
    </ul>
  );
}

export default FavoriteList;
export type {
  Props as FavoriteListProps
};
