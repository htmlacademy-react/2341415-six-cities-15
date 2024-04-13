import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/app-dispatch';
import { cityChangeAction } from '../../store/city-offers-slice';
import FavoriteCard, { FavoriteCardProps } from './favorite-card';
import { AppRoute } from '../../const';
import { CityName } from '../../types';

type Props = {
  cityName: CityName;
  cityOffers: FavoriteCardProps[];
}

function FavoriteListItem({ cityName, cityOffers }: Props): JSX.Element {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleOnCityClick() {
    dispatch(cityChangeAction(cityName));
    navigate(AppRoute.Main);
  }

  return (
    <li className="favorites__locations-items">
      <div className="favorites__locations locations locations--current">
        <div className="locations__item">
          <a onClick={handleOnCityClick} className="locations__item-link" href="#">
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
