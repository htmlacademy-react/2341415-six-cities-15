import { OfferType } from '../../types';
import { getRatingPercentage } from '../../utils';
import { AppRoute, AuthorizationStatus, MAX_RATING } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks/app-dispatch';
import { fetchIsFavoritesAction, selectAddingToFavoritesOfferIds, selectAuthorizationStatus, selectFavoriteOffers } from '../../store/auth-slice';
import { Link, useNavigate } from 'react-router-dom';
import { capitalize } from 'lodash';

type Props = {
  id: string;
  title: string;
  type: OfferType;
  price: number;
  previewImage: string;
  isPremium: boolean;
  rating: number;
};


function FavoriteCard({ id, price, rating, previewImage, type, title, isPremium }: Props): JSX.Element {

  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const favoriteOffers = useAppSelector(selectFavoriteOffers);
  const isFavorite = favoriteOffers.some((offer) => offer.id === id);
  const favoriteAddingOfferIds = useAppSelector(selectAddingToFavoritesOfferIds);

  const onFavoriteButtonClick: React.MouseEventHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    if (authorizationStatus === AuthorizationStatus.Auth) {
      dispatch(fetchIsFavoritesAction({ id, isFavorite: !isFavorite }));
    } else {
      navigate(AppRoute.Login);
    }
  };

  const bookmarksButtonClassName = `place-card__bookmark-button button${isFavorite ? ' place-card__bookmark-button--active' : ''}`;

  return (
    <article onClick={() => navigate(`${AppRoute.Offer}${id}`)} key={id} className="favorites__card place-card">
      {isPremium ? <div className="place-card__mark"><span>Premium</span></div> : null}
      <div className="favorites__image-wrapper place-card__image-wrapper">
        <Link to="">
          <img className="place-card__image" src={previewImage} width="150" height="110" alt="Place image" />
        </Link>
      </div>
      <div className="favorites__card-info place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button className={bookmarksButtonClassName} onClick={onFavoriteButtonClick} type="button" disabled={favoriteAddingOfferIds.includes(id)}>
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">In bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{width: `${getRatingPercentage(rating, MAX_RATING)}%`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to="">{title}</Link>
        </h2>
        <p className="place-card__type">{capitalize(type)}</p>
      </div>
    </article>
  );
}

export default FavoriteCard;
export type {
  Props as FavoriteCardProps,
};
