import { AppRoute } from './const';
import { format } from 'date-fns';
import { Offer } from './types';
import { Point } from './components/map/types';
import { SortVariants } from './const';
import { SerializedError } from '@reduxjs/toolkit';

export function getLayoutState(pathname: AppRoute, favoritesCount: number) {
  let rootClassName = '';
  let linkClassName = '';
  let shouldRenderUser = true;
  let shouldRenderFooter = false;


  if(pathname === AppRoute.Main) {
    rootClassName = ' page--gray page--main';
    linkClassName = ' header__logo-link--active';
  } else if(pathname === AppRoute.Login) {
    rootClassName = ' page--gray page--login';
    shouldRenderUser = false;
  } else if(pathname === AppRoute.Favorites){
    shouldRenderFooter = true;
    if(!favoritesCount) {
      rootClassName = ' page--favorites-empty';
      shouldRenderFooter = false;
    }
  }

  return { rootClassName, linkClassName, shouldRenderUser, shouldRenderFooter };
}

export function getRatingPercentage(rating: number, maxRating: number) {
  return Math.round(rating / maxRating * 100);
}

export function formatCommentDate(date: Date): string {
  return format(date, 'MMMM yyyy');
}

export function offerToPoint(offer: Offer): Point {
  const { id, location, title } = offer;

  return {
    id,
    title,
    lat: location.latitude,
    lng: location.longitude,
  };
}

export function isNotFoundError(err: SerializedError): boolean {
  return err.message?.includes('404') ?? false;
}

type Comparator = (offer1: Offer, offer2: Offer) => number;

export const comparators: Record<SortVariants, Comparator> = {
  [SortVariants.Popular]: () => 0,
  [SortVariants.PriceHighToLow]: (offer1, offer2) => offer2.price - offer1.price,
  [SortVariants.PriceLowToHigh]: (offer1, offer2) => offer1.price - offer2.price,
  [SortVariants.TopRatedFirst]: (offer1, offer2) => offer2.rating - offer1.rating,
};
