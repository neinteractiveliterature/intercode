import { Convention } from 'graphqlTypes.generated';
import OpenLayersMap, { fromLonLat } from './OpenLayersMap';
import { useMemo } from 'react';
import VectorLayer from 'ol/layer/Vector';
import { useMarkerFeatureSource } from './openLayersMapMarkers';

export type ConventionLocationMapProps = {
  location: Convention['location'];
};

function ConventionLocationMap({ location }: ConventionLocationMapProps) {
  const conventionLocation = useMemo(() => (location ? JSON.parse(location) : null), [location]);
  const coordinates = useMemo(() => fromLonLat(conventionLocation.center), [conventionLocation.center]);
  const markerFeatureSource = useMarkerFeatureSource([{ coordinates, fill: 'red', stroke: 'black' }]);
  const overlayLayers = useMemo(() => {
    return [new VectorLayer({ source: markerFeatureSource })];
  }, [markerFeatureSource]);

  return (
    <OpenLayersMap
      style={{ width: '100%', height: '500px', overflow: 'hidden' }}
      viewOptions={{ center: coordinates, zoom: 15 }}
      overlayLayers={overlayLayers}
    />
  );
}

export default ConventionLocationMap;
