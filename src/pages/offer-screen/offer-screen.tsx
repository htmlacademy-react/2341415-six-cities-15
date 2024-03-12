import { useParams } from 'react-router-dom';
import { getAuthorizationStatus } from '../authorization-status';
import { AuthorizationStatus } from '../../const';
import { OfferCard } from '../../types';
import NotFoundPage from '../error-screen/error-404-screen';
import { getRatingPercentage, offerToPoint } from '../../utils';
import { MAX_RATING } from '../../const';
import OfferCommentsForm from '../../forms/offer-comments-form';
import CommentList from '../../components/comment/comment-list';
import { comments } from '../../mocks/comments';
import CityMap from '../../components/map/map';
import { cityLocation } from '../../mocks/city-locations';
import NearestCardsList from '../../components/cards/nearest-cards-list';

type Props = {
  offers: OfferCard[];
}

function OfferScreen({ offers }: Props): JSX.Element {
  const authorizationStatus = getAuthorizationStatus();
  const params = useParams();
  const selectedOffer = offers.find((it) => it.id === params.id);
  const neighbourhood = offers.filter((offer) => offer.city.name === selectedOffer?.city.name && offer.id !== selectedOffer.id);

  if(!selectedOffer){
    return <NotFoundPage />;
  }

  const bookmarksButtonClassName = `offer__bookmark-button button${selectedOffer.isFavorite ? ' offer__bookmark-button--active' : ''}`;

  return (
    <main className="page__main page__main--offer">
      <section className="offer">
        <div className="offer__gallery-container container">
          <div className="offer__gallery">
            <div className="offer__image-wrapper">
              <img className="offer__image" src="img/room.jpg" alt="Photo studio" />
            </div>
            <div className="offer__image-wrapper">
              <img className="offer__image" src="img/apartment-01.jpg" alt="Photo studio" />
            </div>
            <div className="offer__image-wrapper">
              <img className="offer__image" src="img/apartment-02.jpg" alt="Photo studio" />
            </div>
            <div className="offer__image-wrapper">
              <img className="offer__image" src="img/apartment-03.jpg" alt="Photo studio" />
            </div>
            <div className="offer__image-wrapper">
              <img className="offer__image" src="img/studio-01.jpg" alt="Photo studio" />
            </div>
            <div className="offer__image-wrapper">
              <img className="offer__image" src="img/apartment-01.jpg" alt="Photo studio" />
            </div>
          </div>
        </div>
        <div className="offer__container container">
          <div className="offer__wrapper">
            {selectedOffer.isPremium ? <div className="offer__mark"><span>Premium</span></div> : null}
            <div className="offer__name-wrapper">
              <h1 className="offer__name">
                {selectedOffer.title}
              </h1>
              <button className={bookmarksButtonClassName} type="button">
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
                  Apartment
              </li>
              <li className="offer__feature offer__feature--bedrooms">
                {selectedOffer.bedrooms} Bedrooms
              </li>
              <li className="offer__feature offer__feature--adults">
                  Max {selectedOffer.maxAdults} adults
              </li>
            </ul>
            <div className="offer__price">
              <b className="offer__price-value">&euro;{selectedOffer.price}</b>
              <span className="offer__price-text">&nbsp;night</span>
            </div>
            <div className="offer__inside">
              <h2 className="offer__inside-title">What&apos;s inside</h2>
              <ul className="offer__inside-list">
                <li className="offer__inside-item">
                    Wi-Fi
                </li>
                <li className="offer__inside-item">
                    Washing machine
                </li>
                <li className="offer__inside-item">
                    Towels
                </li>
                <li className="offer__inside-item">
                    Heating
                </li>
                <li className="offer__inside-item">
                    Coffee machine
                </li>
                <li className="offer__inside-item">
                    Baby seat
                </li>
                <li className="offer__inside-item">
                    Kitchen
                </li>
                <li className="offer__inside-item">
                    Dishwasher
                </li>
                <li className="offer__inside-item">
                    Cabel TV
                </li>
                <li className="offer__inside-item">
                    Fridge
                </li>
              </ul>
            </div>
            <div className="offer__host">
              <h2 className="offer__host-title">Meet the host</h2>
              <div className="offer__host-user user">
                <div className="offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper">
                  <img className="offer__avatar user__avatar" src="img/avatar-angelina.jpg" width="74" height="74" alt="Host avatar" />
                </div>
                <span className="offer__user-name">
                    Angelina
                </span>
                <span className="offer__user-status">
                    Pro
                </span>
              </div>
              <div className="offer__description">
                <p className="offer__text">
                    A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.
                </p>
                <p className="offer__text">
                    An independent House, strategically located between Rembrand Square and National Opera, but where the bustle of the city comes to rest in this alley flowery and colorful.
                </p>
              </div>
            </div>
            <section className="offer__reviews reviews">
              <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{comments.length}</span></h2>
              <CommentList comments={comments}/>
              {authorizationStatus === AuthorizationStatus.Auth ?
                <OfferCommentsForm />
                : null}
            </section>
          </div>
        </div>
        <CityMap
          city={{ name: selectedOffer.city.name, location: cityLocation[selectedOffer.city.name] }}
          points={[selectedOffer, ...neighbourhood].map(offerToPoint)}
          selectedPointId={selectedOffer.id}
          className='offer__map'
        />
      </section>
      <div className="container">
        <section className="near-places places">
          <h2 className="near-places__title">Other places in the neighbourhood</h2>
          <div className="near-places__list places__list">
            <NearestCardsList offers={offers.slice(0, 3)} />
          </div>
        </section>
      </div>
    </main>
  );
}

export default OfferScreen;
