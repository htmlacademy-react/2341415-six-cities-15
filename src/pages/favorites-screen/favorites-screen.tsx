import FavoriteList from '../../components/favorite-cards/favorite-list';
import { useAppSelector } from '../../hooks/app-dispatch';
import { selectFavoriteOffers, selectIsFavoritesLoading } from '../../store/auth-slice';
import cn from 'classnames';
import FavoritesEmptyScreen from '../favorites-empty-screen/favorites-empty-screen';
import LoadingScreen from '../loading-screen/loading-screen';

function FavoritesScreen(): JSX.Element {
  const favorites = useAppSelector(selectFavoriteOffers);
  const isFavoritesLoading = useAppSelector(selectIsFavoritesLoading);
  const isEmpty = favorites.length === 0;

  if (isFavoritesLoading) {
    return <LoadingScreen/>;
  }

  return (
    <main className={cn('page__main', 'page__main--favorites', { ['page__main--favorites-empty']: isEmpty})}>
      <div className="page__favorites-container container">
        <section className={cn('favorites', { ['favorites--empty']: isEmpty})}>
          {isEmpty ? <FavoritesEmptyScreen/> : <FavoriteList favorites={favorites} />}
        </section>
      </div>
    </main>
  );
}

export default FavoritesScreen;
