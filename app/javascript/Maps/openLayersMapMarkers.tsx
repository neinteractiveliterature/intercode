import { Coordinate } from 'ol/coordinate';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';

import Icon from 'ol/style/Icon';
import VectorSource from 'ol/source/Vector';
import { useEffect, useRef, useState } from 'react';

import isEqual from 'lodash/isEqual';

type MarkerProps = {
  size: number;
  svgAttributes: Record<string, string>;
};

// Adapted from geo-alt-fill icon from bootstrap-icons
function buildMarkerDataUrl({ size, svgAttributes }: MarkerProps) {
  const svg = document.createElement('svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('width', size.toString());
  svg.setAttribute('height', size.toString());
  svg.setAttribute('class', 'bi bi-geo-alt-fill');
  svg.setAttributeNS(null, 'viewBox', '0 -1 16 17');
  for (const [key, value] of Object.entries(svgAttributes)) {
    svg.setAttributeNS(null, key, value);
  }

  const path = document.createElement('path');
  path.setAttribute('d', 'M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6');
  svg.appendChild(path);

  // eslint-disable-next-line i18next/no-literal-string
  return `data:image/svg+xml;base64,${window.btoa(svg.outerHTML)}`;
}

export type BuildMarkerOptions = {
  coordinates: Coordinate;
  fill: string;
  stroke: string;
};

export function buildMarker({ coordinates, fill, stroke }: BuildMarkerOptions): Feature<Point> {
  const point = new Point(coordinates);
  const feature = new Feature(point);
  feature.setStyle(
    new Style({
      image: new Icon({
        src: buildMarkerDataUrl({ size: 48, svgAttributes: { fill, stroke, 'stroke-width': '0.5px' } }),
        anchor: [0.5, 1.0],
      }),
    }),
  );

  return feature;
}

export function buildFeatureSourceFromMarkers(markers: BuildMarkerOptions[]) {
  return new VectorSource({
    features: markers.map(buildMarker),
  });
}

export function useMarkerFeatureSource(markers: BuildMarkerOptions[]) {
  const prevMarkers = useRef(markers);
  const [featureSource, setFeatureSource] = useState<VectorSource<Feature<Point>>>(() =>
    buildFeatureSourceFromMarkers(markers),
  );

  useEffect(() => {
    if (!isEqual(prevMarkers.current, markers)) {
      prevMarkers.current = markers;
      setFeatureSource(buildFeatureSourceFromMarkers(markers));
    }
  }, [markers]);

  return featureSource;
}
