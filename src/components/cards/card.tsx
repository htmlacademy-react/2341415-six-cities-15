import { OfferType } from '../../types';
import { AppRoute, AuthorizationStatus, MAX_RATING } from '../../const';
import { getRatingPercentage } from '../../utils';
import { Link, useNavigate } from 'react-router-dom';
import { memo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/app-dispatch';
import { fetchIsFavoritesAction, selectAuthorizationStatus, selectFavoriteOffers, selectAddingToFavoritesOfferIds } from '../../store/auth-slice';
import { clearOfferDataAction, fetchOfferCardDataAction } from '../../store/offer-card-slice';
import cn from 'classnames';

export type Props = {
  id: string;
  title: string;
  type: OfferType;
  price: number;
  isPremium: boolean;
  rating: number;
  className: string;
  previewImage: string;
  imgWrapperClassName: string;
  onMouseEnter?: (id: string) => void;
  onMouseLeave?: () => void;
};

function Card ({ id, isPremium, price, rating, title, type, className, previewImage, imgWrapperClassName, onMouseEnter, onMouseLeave }: Props): JSX.Element {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const favoriteOffers = useAppSelector(selectFavoriteOffers);
  const favoriteAddingOfferIds = useAppSelector(selectAddingToFavoritesOfferIds);
  const isFavorite = favoriteOffers.some((offer) => offer.id === id);


  const onFavoriteButtonClick: React.MouseEventHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    if (authorizationStatus === AuthorizationStatus.Auth) {
      dispatch(fetchIsFavoritesAction({ id, isFavorite: !isFavorite }));
    } else {
      navigate(AppRoute.Login);
    }
  };

  const bookmarksButtonClassName = cn('button', 'place-card__bookmark-button', { 'place-card__bookmark-button--active': isFavorite });

  function handleLinkClick() {
    dispatch(clearOfferDataAction());
    dispatch(fetchOfferCardDataAction(id));
    navigate(`${AppRoute.Offer}${id}`);
  }

  return (
    <article
      onClick={handleLinkClick}
      onMouseEnter={onMouseEnter ? () => onMouseEnter(id) : undefined}
      onMouseLeave={onMouseLeave}
      key={id}
      className={`${className} place-card`}
    >
      {isPremium ? <div className="place-card__mark"><span>Premium</span></div> : null}
      <div className={imgWrapperClassName}>
        <img className="place-card__image" src={previewImage} width="260" height="200" alt="Place image" />
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button className={bookmarksButtonClassName} onClick={onFavoriteButtonClick} type="button" disabled={favoriteAddingOfferIds.includes(id)}>
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">To bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style= {{width: `${getRatingPercentage(rating, MAX_RATING)}%`}}></span>
            <span className="visually-hidden">{rating}</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to=''>{title}</Link>
        </h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
}

const MemoCard = memo(
  Card,
);

export default MemoCard;
