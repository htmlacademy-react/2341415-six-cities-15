import { useEffect, useState, MutableRefObject, useRef, EffectCallback } from 'react';
import { Map, TileLayer } from 'leaflet';
import { City } from '../../types';

function useMap(
  mapRef: MutableRefObject<HTMLElement | null>,
  city: City
): Map | null {
  const [map, setMap] = useState<Map | null>(null);
  const isRenderedRef = useRef<boolean>(false);

  const effectCallback: EffectCallback = () => {
    const { latitude, longitude, zoom } = city.location;

    if (mapRef.current !== null && !isRenderedRef.current) {
      const instance = new Map(
        mapRef.current,
        {
          center: {
            lat: latitude,
            lng: longitude
          },
          zoom
        }
      );

      const layer = new TileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }
      );

      instance.addLayer(layer);

      setMap(instance);
      isRenderedRef.current = true;
    }
  };

  useEffect(effectCallback, [mapRef, city]);

  return map;
}

export default useMap;
