import { useRef, useEffect, CSSProperties } from 'react';
import { Icon, Marker, layerGroup } from 'leaflet';
import useMap from './use-map';
import { Point } from './types';
import { URL_MARKER_DEFAULT, URL_MARKER_CURRENT } from './const';
import 'leaflet/dist/leaflet.css';
import { City } from '../../types';

type MapProps = {
  city: City;
  points: Point[];
  selectedPointId: string | undefined;
  style: CSSProperties;
};

const defaultCustomIcon = new Icon({
  iconUrl: URL_MARKER_DEFAULT,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const currentCustomIcon = new Icon({
  iconUrl: URL_MARKER_CURRENT,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

function CityMap(props: MapProps): JSX.Element {
  const { city, points, selectedPointId, style } = props;

  const mapRef = useRef(null);
  const map = useMap(mapRef, city);

  useEffect(() => {
    if (map) {
      const markerLayer = layerGroup().addTo(map);

      const selectedPoint = points.find((point) => point.id === selectedPointId);

      points.forEach((point) => {
        const marker = new Marker({
          lat: point.lat,
          lng: point.lng
        });


        marker
          .setIcon(
            selectedPoint !== undefined && point.id === selectedPoint.id
              ? currentCustomIcon
              : defaultCustomIcon
          )
          .addTo(markerLayer);
      });

      return () => {
        map.removeLayer(markerLayer);
      };
    }
  }, [map, points, selectedPointId]);

  return <div style={style} ref={mapRef}></div>;
}

export default CityMap;
