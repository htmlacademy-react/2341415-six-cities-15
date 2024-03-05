import FavoriteCard, { FavoriteCardProps } from './favorite-card';

type Props = {
  cityName: string;
  cityOffers: FavoriteCardProps[];
}

function FavoriteListItem({ cityName, cityOffers }: Props): JSX.Element {
  return (
    <li className="favorites__locations-items">
      <div className="favorites__locations locations locations--current">
        <div className="locations__item">
          <a className="locations__item-link" href="#">
            <span>{cityName}</span>
          </a>
        </div>
      </div>
      <div className="favorites__places">
        {cityOffers.map((offer) => <FavoriteCard key={offer.id} {...offer} />)}
      </div>
    </li>
  );
}

export default FavoriteListItem;
export type {
  Props as FavoriteListItemProps
};
