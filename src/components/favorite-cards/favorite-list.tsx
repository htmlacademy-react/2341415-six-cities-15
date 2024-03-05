import FavoriteListItem, { FavoriteListItemProps } from './favorite-list-item';

type Props = {
  cityOffers: FavoriteListItemProps[];
}

function FavoriteList({ cityOffers }: Props): JSX.Element {
  return (
    <ul className="favorites__list">
      {cityOffers.map((itemProps) => <FavoriteListItem key={itemProps.cityName} {...itemProps} />)}
    </ul>
  );
}

export default FavoriteList;
export type {
  Props as FavoriteListProps
};
