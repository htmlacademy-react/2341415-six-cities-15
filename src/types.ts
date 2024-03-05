export type OfferType = string;

export type CityName = string;

export type City = {
  name: CityName;
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
};

export type OfferLocation = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type Offer = {
  id: string;
  title: string;
  type: OfferType;
  price: number;
  previewImage: string;
  city: City;
  location: OfferLocation;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
};

export type Goods = string;

export type Host = {
  name: string;
  avatarUrl: string;
  isPro: boolean;
};

export type OfferImages = string;

export type OfferCard = {
  id: string;
  title: string;
  type: OfferType;
  price: number;
  previewImage: string;
  city: City;
  location: OfferLocation;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  description: string;
  bedrooms: number;
  goods: Goods[];
  host: Host;
  images: OfferImages[];
  maxAdults: number;
};

export type User = {
  name: string;
  avatarUrl: string;
  isPro: boolean;
};

export type Comment = {
  id: string;
  date: Date;
  user: User;
  comment: string;
  rating: number;
};
