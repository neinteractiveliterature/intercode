import React, { useState, useCallback, useRef } from 'react';

export default React.createContext({
  getMapboxGL: null,
  mapboxAccessToken: null,
  mapboxgl: null,
});

export function useMapboxContext({ mapboxAccessToken }) {
  const [mapboxgl, setMapboxgl] = useState(null);
  const loadingPromise = useRef(null);

  const loadMapboxGL = useCallback(
    async () => {
      const [module] = await Promise.all([
        import(/* webpackChunkName: 'mapbox-gl' */ 'mapbox-gl'),
        import(/* webpackChunkName: 'mapbox-gl' */ 'mapbox-gl/dist/mapbox-gl.css'),
      ]);
      return module.default;
    },
    [],
  );

  const getMapboxGL = useCallback(
    () => {
      if (!mapboxAccessToken) {
        return null;
      }

      if (mapboxgl) {
        return mapboxgl;
      }

      if (loadingPromise.current) {
        throw loadingPromise.current;
      }

      const promise = loadMapboxGL().then((result) => {
        // eslint-disable-next-line no-param-reassign
        result.accessToken = mapboxAccessToken;
        setMapboxgl(result);
      });
      loadingPromise.current = promise;
      throw promise;
    },
    [mapboxgl, loadMapboxGL, mapboxAccessToken],
  );

  return {
    mapboxgl,
    getMapboxGL,
    mapboxAccessToken,
  };
}
