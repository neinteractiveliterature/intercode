import { Feature } from 'geojson';
import { ReactNode } from 'react';
import { GeocodingResult } from './LocationSelect';

export class GeoJSONGeocodingResult implements GeocodingResult {
  feature: Feature;

  constructor(feature: Feature) {
    this.feature = feature;
  }

  getId(): string {
    return this.feature.id?.toString() ?? '';
  }

  getCoordinates(): number[] {
    return getCoordinates(this.feature);
  }

  formatLabel(): ReactNode {
    return this.feature.properties?.name;
  }

  toGeoJSONFeature(): Feature {
    return this.feature;
  }
}

export function getCoordinates(feature: Feature) {
  const geometry = feature.geometry;
  if (geometry.type === 'Point') {
    return geometry.coordinates;
  } else {
    throw new Error(`Cannot get coordinates from ${geometry.type}`);
  }
}
