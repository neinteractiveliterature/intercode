import { Convention } from 'graphqlTypes.generated';
import OpenLayersMap, { fromLonLat } from './OpenLayersMap';
import { CSSProperties, useMemo } from 'react';
import VectorLayer from 'ol/layer/Vector';
import { useMarkerFeatureSource } from './openLayersMapMarkers';
import { Feature } from 'geojson';
import { getCoordinates } from './geoJSONUtils';

export type ConventionLocationMapProps = {
  location: Convention['location'];
  style?: CSSProperties;
};

function ConventionLocationMap({ location, style }: ConventionLocationMapProps) {
  const conventionLocation = useMemo<Feature | null>(() => (location ? JSON.parse(location) : null), [location]);
  const coordinates = useMemo(
    () => (conventionLocation ? fromLonLat(getCoordinates(conventionLocation)) : null),
    [conventionLocation],
  );
  const markerFeatureSource = useMarkerFeatureSource(
    coordinates ? [{ coordinates, fill: 'red', stroke: 'black' }] : [],
  );
  const overlayLayers = useMemo(() => {
    return [new VectorLayer({ source: markerFeatureSource })];
  }, [markerFeatureSource]);

  return (
    <OpenLayersMap
      style={{ width: '100%', height: '500px', overflow: 'hidden', ...style }}
      viewOptions={{ center: coordinates ?? undefined, zoom: 15 }}
      overlayLayers={overlayLayers}
    />
  );
}

export default ConventionLocationMap;
