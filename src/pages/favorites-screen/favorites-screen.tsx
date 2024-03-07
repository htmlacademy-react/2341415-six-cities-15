import FavoriteList, { FavoriteListProps } from '../../components/favorite-cards/favorite-list';
import { Offer } from '../../types';
import { groupBy } from 'lodash';

type Props = {
  offers: Offer[];
};

function FavoritesScreen({ offers }: Props): JSX.Element {
  return (
    <main className="page__main page__main--favorites">
      <div className="page__favorites-container container">
        <section className="favorites">
          <h1 className="favorites__title">Saved listing</h1>
          {<FavoriteList {...groupBy(offers, 'city.name') as unknown as FavoriteListProps} />}
        </section>
      </div>
    </main>
  );
}

export default FavoritesScreen;
