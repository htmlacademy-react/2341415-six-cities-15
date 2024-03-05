import FavoriteList, { FavoriteListProps } from '../../components/favorite-cards/favorite-list';
import { Offer } from '../../types';
import { groupBy } from 'lodash';

type Props = {
  offers: Offer[];
};

function offersToFavoriteListProps(offers: Offer[]): FavoriteListProps['cityOffers'] {
  const offersGroupedByCityName = groupBy(offers, 'city.name');
  return Object.entries(offersGroupedByCityName).map(([cityName, cityOffers]) => ({ cityName, cityOffers }));
}

function FavoritesScreen({ offers }: Props): JSX.Element {
  return (
    <main className="page__main page__main--favorites">
      <div className="page__favorites-container container">
        <section className="favorites">
          <h1 className="favorites__title">Saved listing</h1>
          {<FavoriteList cityOffers={offersToFavoriteListProps(offers)} />}
        </section>
      </div>
    </main>
  );
}

export default FavoritesScreen;
