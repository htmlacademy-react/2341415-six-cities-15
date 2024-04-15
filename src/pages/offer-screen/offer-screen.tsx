import { AppRoute, AuthorizationStatus, CITY_LOCATION, DISPLAYED_OFFER_IMAGE_COUNT } from '../../const';
import { getRatingPercentage, offerToPoint } from '../../utils';
import { MAX_RATING } from '../../const';
import OfferCommentsForm from '../../forms/offer-comments-form';
import CommentList from '../../components/comment/comment-list';
import CityMap from '../../components/map/map';
import NearestCardsList from '../../components/cards/nearest-cards-list';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from '../../hooks/app-dispatch';
import { Comment, Offer, OfferCard } from '../../types';
import { fetchIsFavoritesAction, selectAddingToFavoritesOfferIds, selectAuthorizationStatus, selectFavoriteOffers } from '../../store/auth-slice';
import { useNavigate } from 'react-router-dom';
import { selectCommentsCount } from '../../store/offer-card-slice';
import { capitalize } from 'lodash';

type Props = {
  selectedOffer: OfferCard;
  comments: Comment[];
  neighbours: Offer[];
}

function OfferScreen({ selectedOffer, comments, neighbours }: Props): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const favoriteOffers = useAppSelector(selectFavoriteOffers);
  const isFavorite = favoriteOffers.some((offer) => offer.id === selectedOffer.id);
  const bookmarksButtonClassName = `offer__bookmark-button button${isFavorite ? ' offer__bookmark-button--active' : ''}`;
  const favoriteAddingOfferIds = useAppSelector(selectAddingToFavoritesOfferIds);
  const commentsCount = useAppSelector(selectCommentsCount);

  const onFavoriteButtonClick: React.MouseEventHandler = (evt) => {
    evt.preventDefault();

    if (authorizationStatus === AuthorizationStatus.Auth) {
      dispatch(fetchIsFavoritesAction({ id: selectedOffer.id, isFavorite: !isFavorite }));
    } else {
      navigate(AppRoute.Login);
    }
  };

  const displayedImages = selectedOffer.images.slice(0, DISPLAYED_OFFER_IMAGE_COUNT);

  return (
    <main className="page__main page__main--offer">
      <section className="offer">
        <div className="offer__gallery-container container">
          <div className="offer__gallery">
            {displayedImages.map((image) => (
              <div key={image} className="offer__image-wrapper">
                <img className="offer__image" src={image} alt="Photo studio" />
              </div>
            ))}
          </div>
        </div>
        <div className="offer__container container">
          <div className="offer__wrapper">
            {selectedOffer.isPremium ? <div className="offer__mark"><span>Premium</span></div> : null}
            <div className="offer__name-wrapper">
              <h1 className="offer__name">
                {selectedOffer.title}
              </h1>
              <button className={bookmarksButtonClassName} onClick={onFavoriteButtonClick} type="button" disabled={favoriteAddingOfferIds.includes(selectedOffer.id)}>
                <svg className="offer__bookmark-icon" width="31" height="33">
                  <use xlinkHref="#icon-bookmark"></use>
                </svg>
                <span className="visually-hidden">To bookmarks</span>
              </button>
            </div>
            <div className="offer__rating rating">
              <div className="offer__stars rating__stars">
                <span style= {{width: `${getRatingPercentage(selectedOffer.rating, MAX_RATING)}%`}}></span>
                <span className="visually-hidden">Rating</span>
              </div>
              <span className="offer__rating-value rating__value">{selectedOffer.rating}</span>
            </div>
            <ul className="offer__features">
              <li className="offer__feature offer__feature--entire">
                {capitalize(selectedOffer.type)}
              </li>
              <li className="offer__feature offer__feature--bedrooms">
                {selectedOffer.bedrooms} Bedroom{selectedOffer.bedrooms > 1 ? 's' : ''}
              </li>
              <li className="offer__feature offer__feature--adults">
                  Max {selectedOffer.maxAdults} adult{selectedOffer.maxAdults > 1 ? 's' : ''}
              </li>
            </ul>
            <div className="offer__price">
              <b className="offer__price-value">&euro;{selectedOffer.price}</b>
              <span className="offer__price-text">&nbsp;night</span>
            </div>
            <div className="offer__inside">
              <h2 className="offer__inside-title">What&apos;s inside</h2>
              <ul className="offer__inside-list">
                {selectedOffer.goods.map((item) => <li key={item} className="offer__inside-item">{item}</li>)}
              </ul>
            </div>
            <div className="offer__host">
              <h2 className="offer__host-title">Meet the host</h2>
              <div className="offer__host-user user">
                <div className={cn('offer__avatar-wrapper offer', 'user__avatar-wrapper', { ['offer__avatar-wrapper--pro']:selectedOffer.host.isPro })}>
                  <img className="offer__avatar user__avatar" src={selectedOffer.host.avatarUrl} width="74" height="74" alt="Host avatar" />
                </div>
                <span className="offer__user-name">
                  {selectedOffer.host.name}
                </span>
                {selectedOffer.host.isPro ? <span className="offer__user-status">Pro</span> : null}
              </div>
              <div className="offer__description">
                <p className="offer__text">
                  {selectedOffer.description}
                </p>
              </div>
            </div>
            <section className="offer__reviews reviews">
              <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{commentsCount}</span></h2>
              <CommentList comments={comments}/>
              {authorizationStatus === AuthorizationStatus.Auth ? <OfferCommentsForm /> : null}
            </section>
          </div>
        </div>
        <CityMap
          city={{ name: selectedOffer.city.name, location: CITY_LOCATION[selectedOffer.city.name] }}
          points={[selectedOffer, ...neighbours].map(offerToPoint)}
          selectedPointId={selectedOffer.id}
          className='offer__map'
        />
      </section>
      <div className="container">
        <section className="near-places places">
          <h2 className="near-places__title">Other places in the neighbourhood</h2>
          <div className="near-places__list places__list">
            <NearestCardsList offers={neighbours} />
          </div>
        </section>
      </div>
    </main>
  );
}

export default OfferScreen;
