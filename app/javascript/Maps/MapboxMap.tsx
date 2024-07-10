import { useContext, useRef, useEffect } from 'react';
import * as React from 'react';
import type { LngLat, Map, Marker } from 'mapbox-gl';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';

import MapboxContext from '../MapboxContext';

export type MapboxMapProps = {
  center?: LngLat;
  zoom?: number;
  markerLocation?: LngLat;
  setCenter?: React.Dispatch<LngLat>;
  setZoom?: React.Dispatch<number>;
  height?: string;
};

function MapboxMap({ center, zoom, markerLocation, setCenter, setZoom, height }: MapboxMapProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const { getMapboxGL, mapboxAccessToken } = useContext(MapboxContext);
  const mapboxgl = getMapboxGL();

  useEffect(() => {
    if (mapboxgl == null || containerRef.current == null) {
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

    return () => {
      map.remove();
    };
  }, [setCenter, setZoom, mapboxgl]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.jumpTo({ center, zoom: zoom ?? 15 });
    }
  }, [center, zoom]);

  useEffect(() => {
    if (!mapRef.current || !mapboxgl) {
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
  }, [markerLocation, mapboxgl]);

  return (
    <div ref={containerRef} style={{ height: height ?? '30rem' }}>
      { }
      {mapboxgl ? null : mapboxAccessToken ? (
        <PageLoadingIndicator visible iconSet="bootstrap-icons" />
      ) : (
        <div className="alert alert-warning">
          Cannot load Mapbox without an access token. To set up Intercode with a Mapbox access token, add a{' '}
          <code>MAPBOX_ACCESS_TOKEN</code> environment variable in <code>.env.local.development</code> and restart the
          Rails server.
        </div>
      )}
    </div>
  );
}

export default MapboxMap;
