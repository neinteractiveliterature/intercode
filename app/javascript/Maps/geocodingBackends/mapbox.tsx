import { Feature } from 'geojson';
import { GeocodingBackend, GeocodingResult } from 'Maps/LocationSelect';
import { ReactNode } from 'react';

type MapboxAPIFeature = {
  id: string;
  place_type: string[];
  place_name: string;
  center: [number, number];
  text: string;
};

export class MapboxGeocodingResult implements GeocodingResult {
  feature: MapboxAPIFeature;

  constructor(feature: MapboxAPIFeature) {
    this.feature = feature;
  }

  getId(): string {
    return this.feature.id;
  }

  getCoordinates(): [number, number] {
    return this.feature.center;
  }

  formatLabel(): ReactNode {
    if (this.feature.place_type.length === 1 && this.feature.place_type[0] === 'address') {
      return this.feature.place_name;
    }

    return (
      <>
        {this.feature.text}{' '}
        <small className="text-muted">
          {this.feature.place_name.replace(this.feature.text, '').replace(/^,/, '').trim()}
        </small>
      </>
    );
  }

  toGeoJSONFeature(): Feature {
    return {
      // eslint-disable-next-line i18next/no-literal-string
      type: 'Feature',
      geometry: {
        // eslint-disable-next-line i18next/no-literal-string
        type: 'Point',
        coordinates: this.feature.center,
      },
      properties: {
        text: this.feature.text,
        name: this.feature.place_name,
      },
    };
  }
}

export class MapboxBackend implements GeocodingBackend<MapboxGeocodingResult> {
  mapboxAccessToken: string;

  constructor(mapboxAccessToken: string) {
    this.mapboxAccessToken = mapboxAccessToken;
  }

  async search(query: string): Promise<MapboxGeocodingResult[]> {
    const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`);
    url.searchParams.set('access_token', this.mapboxAccessToken);
    const results = await fetch(url);
    const json = await results.json();
    return json.features.map((feature: MapboxAPIFeature) => new MapboxGeocodingResult(feature));
  }

  async getTimezoneId(result: MapboxGeocodingResult): Promise<string | undefined> {
    const coordinates = result.getCoordinates();
    // eslint-disable-next-line i18next/no-literal-string
    const uri = `https://api.mapbox.com/v4/examples.4ze9z6tv/tilequery/${coordinates[0]},${coordinates[1]}.json?access_token=${this.mapboxAccessToken}`;
    const response = await fetch(uri);
    const json = await response.json();
    return json.features[0]?.properties?.TZID;
  }
}
