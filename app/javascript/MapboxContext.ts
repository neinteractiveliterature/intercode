import { createContext, useState, useCallback, useRef } from 'react';
import type MapboxGL from 'mapbox-gl';

export type MapboxInterface = {
  Map: typeof MapboxGL.Map;
  Marker: typeof MapboxGL.Marker;
};

export type MapboxContextValue = {
  getMapboxGL: () => MapboxInterface | undefined;
  mapboxAccessToken?: string;
};

export default createContext<MapboxContextValue>({
  getMapboxGL: () => undefined,
  mapboxAccessToken: undefined,
});

export type UseMapboxContextOptions = {
  mapboxAccessToken?: string;
};

export function useMapboxContext({ mapboxAccessToken }: UseMapboxContextOptions): MapboxContextValue {
  const [mapboxgl, setMapboxgl] = useState<MapboxInterface>();
  const loadingPromise = useRef<Promise<unknown>>();

  const loadMapboxGL = useCallback(async () => {
    const [module] = await Promise.all([
      import(/* webpackChunkName: 'mapbox-gl' */ 'mapbox-gl'),
      // @ts-expect-error TypeScript doesn't like dynamic imports of CSS
      import(/* webpackChunkName: 'mapbox-gl' */ 'mapbox-gl/dist/mapbox-gl.css'),
    ]);
    return module.default;
  }, []);

  const getMapboxGL = useCallback(() => {
    if (!mapboxAccessToken) {
      return undefined;
    }

    if (mapboxgl) {
      return mapboxgl;
    }

    if (loadingPromise.current) {
       
      throw loadingPromise.current;
    }

    const promise = loadMapboxGL().then((result) => {
       
      result.accessToken = mapboxAccessToken;
      setMapboxgl({
        Map: result.Map,
        Marker: result.Marker,
      });
    });
    loadingPromise.current = promise;
     
    throw promise;
  }, [mapboxgl, loadMapboxGL, mapboxAccessToken]);

  return {
    getMapboxGL,
    mapboxAccessToken,
  };
}
