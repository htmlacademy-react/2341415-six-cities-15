import { CityName } from '../types';

type Location = {
  latitude: number;
  longitude: number;
  zoom: number;
}

const cityLocation: Record<CityName, Location> = {
  ['Paris']: { latitude: 48.85661, longitude: 2.351499, zoom: 13 },
  ['Cologne']: { latitude: 50.938361, longitude: 6.959974, zoom: 13 },
  ['Brussels']: { latitude: 50.846557, longitude: 4.351697, zoom: 13 },
  ['Amsterdam']: { latitude: 52.37454, longitude: 4.897976, zoom: 13 },
  ['Hamburg']: { latitude: 53.550341, longitude: 10.000654, zoom: 13 },
  ['Dusseldorf']: { latitude: 51.225402, longitude: 6.776314, zoom: 13 },
};

export { cityLocation };
