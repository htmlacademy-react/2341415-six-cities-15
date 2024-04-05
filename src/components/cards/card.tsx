import { OfferType } from '../../types';
import { AppRoute, MAX_RATING } from '../../const';
import { getRatingPercentage } from '../../utils';
import { Link } from 'react-router-dom';
import { memo } from 'react';
import { useAppDispatch } from '../../hooks/app-dispatch';
import { fetchIsFavoritesAction } from '../../store/city-offers-slice';

export type Props = {
  id: string;
  title: string;
  type: OfferType;
  price: number;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  className: string;
  previewImage: string;
  imgWrapperClassName: string;
  onMouseEnter?: (id: string) => void;
  onMouseLeave?: () => void;
};

function Card ({ id, isPremium, price, rating, title, type, isFavorite, className, previewImage, imgWrapperClassName, onMouseEnter, onMouseLeave }: Props): JSX.Element {

  const dispatch = useAppDispatch();

  const onFavoriteButtonClick: React.MouseEventHandler = (evt) => {
    evt.preventDefault();
    dispatch(fetchIsFavoritesAction({id, isFavorite}));
  };

  const bookmarksButtonClassName = `place-card__bookmark-button button${isFavorite ? ' place-card__bookmark-button--active' : ''}`;

  return (
    <Link to={`${AppRoute.Offer}${id}`}>
      <article
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
            <button className={bookmarksButtonClassName} onClick={onFavoriteButtonClick} type="button">
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
            {title}
          </h2>
          <p className="place-card__type">{type}</p>
        </div>
      </article>
    </Link>
  );
}

const MemoCard = memo(
  Card,
);

export default MemoCard;
