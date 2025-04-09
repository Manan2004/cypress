import { useEffect } from 'react';
import Leaflet from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
import { useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import styles from './Map.module.scss';

const { MapContainer } = ReactLeaflet;

function MapClickHandler({ onClick }) {
  // A hook from react-leaflet
  useMapEvents({
    click: (e) => {
      if (onClick) {
        onClick(e);
      }
    }
  });
  return null;
}

const Map = ({ children, className, width, height, onClick, ...rest }) => {
  let mapClassName = styles.map;

  if ( className ) {
    mapClassName = `${mapClassName} ${className}`;
  }

  useEffect(() => {
    (async function init() {
      delete Leaflet.Icon.Default.prototype._getIconUrl;
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
        iconUrl: 'leaflet/images/marker-icon.png',
        shadowUrl: 'leaflet/images/marker-shadow.png',
      });
    })();
  }, []);

  return (
    <MapContainer className={mapClassName} style={{ width, height }} {...rest}>
      {onClick && <MapClickHandler onClick={onClick} />}
      {children(ReactLeaflet, Leaflet)}
    </MapContainer>
  )
}

export default Map;