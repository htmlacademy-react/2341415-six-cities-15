import { OfferType } from '../../types';
import { AppRoute, MAX_RATING } from '../../const';
import { getRatingPercentage } from '../../utils';
import { Link } from 'react-router-dom';

export type Props = {
  id: string;
  title: string;
  type: OfferType;
  price: number;
  previewImage: string;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  onMouseEnter: (id: string) => void;
  onMouseLeave: () => void;
};

function Card ({ id, isPremium, previewImage, price, rating, title, type, isFavorite, onMouseEnter, onMouseLeave }: Props): JSX.Element {

  const bookmarksButtonClassName = `place-card__bookmark-button button${isFavorite ? ' place-card__bookmark-button--active' : ''}`;

  return (
    <Link to={`${AppRoute.Offer}${id}`}>
      <article
        onMouseEnter={() => onMouseEnter(id)}
        onMouseLeave={onMouseLeave}
        key={id}
        className="cities__card place-card"
      >
        {isPremium ? <div className="place-card__mark"><span>Premium</span></div> : null}
        <div className="cities__image-wrapper place-card__image-wrapper">
          <img className="place-card__image" src={previewImage} width="260" height="200" alt="Place image" />
        </div>
        <div className="place-card__info">
          <div className="place-card__price-wrapper">
            <div className="place-card__price">
              <b className="place-card__price-value">&euro;{price}</b>
              <span className="place-card__price-text">&#47;&nbsp;night</span>
            </div>
            <button className={bookmarksButtonClassName} type="button">
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

export default Card;
