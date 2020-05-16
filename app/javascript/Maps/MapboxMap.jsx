import React, { useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import MapboxContext from '../MapboxContext';
import PageLoadingIndicator from '../PageLoadingIndicator';

function MapboxMap({
  center, zoom, markerLocation, setCenter, setZoom,
}) {
  const containerRef = useRef();
  const mapRef = useRef();
  const markerRef = useRef();
  const { getMapboxGL, mapboxAccessToken } = useContext(MapboxContext);
  const mapboxgl = getMapboxGL();

  useEffect(
    () => {
      if (mapboxgl == null) {
        return undefined;
      }

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/nbudin/cka9s8y8k2oxd1ioa3j640r77',
      });

      map.on('move', () => {
        if (setCenter) {
          setCenter(map.getCenter());
        }
        if (setZoom) {
          setZoom(map.getZoom());
        }
      });

      mapRef.current = map;

      return () => { map.remove(); };
    },
    [setCenter, setZoom, mapboxgl],
  );

  useEffect(
    () => {
      if (mapRef.current) {
        mapRef.current.jumpTo({ center, zoom: zoom ?? 15 });
      }
    },
    [center, zoom],
  );

  useEffect(
    () => {
      if (!mapRef.current) {
        return;
      }

      if (markerLocation) {
        let needsAdd = false;
        if (!markerRef.current) {
          markerRef.current = new mapboxgl.Marker();
          needsAdd = true;
        }

        markerRef.current.setLngLat(markerLocation);

        if (needsAdd) {
          markerRef.current.addTo(mapRef.current);
        }
      } else if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    },
    [markerLocation, mapboxgl],
  );

  return (
    <div ref={containerRef} style={{ height: '30rem' }}>
      { /* eslint-disable-next-line no-nested-ternary */ }
      {mapboxgl ? null : (
        mapboxAccessToken ? <PageLoadingIndicator visible /> : (
          <div className="alert alert-warning">
            Cannot load Mapbox without an access token.  To set up Intercode with a Mapbox
            access token, add a
            {' '}
            <code>MAPBOX_ACCESS_TOKEN</code>
            {' '}
            environment variable in
            {' '}
            <code>.env.local.development</code>
            {' '}
            and restart the Rails server.
          </div>
        )
      )}
    </div>
  );
}

MapboxMap.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  markerLocation: PropTypes.arrayOf(PropTypes.number),
  setCenter: PropTypes.func,
  setZoom: PropTypes.func,
};

MapboxMap.defaultProps = {
  center: null,
  zoom: null,
  markerLocation: null,
  setCenter: null,
  setZoom: null,
};

export default MapboxMap;
