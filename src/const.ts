import { CityName } from './types';

export const Setting = {
  OffersCount: 5
};

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN'
}

export enum AppRoute {
  Main = '/',
  Login = '/login',
  Favorites = '/favorites',
  Offer = '/offer/',
  OfferId = ':id',
}

export const MAX_RATING = 5;

export const MAIN_PAGE_MAP_HEIGHT = 746;
export const MAIN_PAGE_MAP_WIGHT = 512;

export const OFFER_PAGE_MAP_HEIGHT = 579;
export const OFFER_PAGE_MAP_WIGHT = 1144;

export const CITIES: readonly CityName[] = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'];

export const DEFAULT_CITY = CITIES[0];

export enum SortVariants {
  Popular = 'Popular',
  PriceLowToHigh = 'Price: low to high',
  PriceHighToLow = 'Price: high to low',
  TopRatedFirst = 'Top rated first'
}

export const DEFAULT_SORTING_ORDER = SortVariants.Popular;

