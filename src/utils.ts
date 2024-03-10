import { AppRoute } from './const';
import { format } from 'date-fns';
import { Offer } from './types';
import { Point } from './components/map/types';

export function getLayoutState(pathname: AppRoute) {
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
