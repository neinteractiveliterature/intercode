import { GeocodingBackend } from 'Maps/LocationSelect';
import { FeatureCollection } from 'geojson';
import { GeoJSONGeocodingResult } from 'Maps/geoJSONUtils';

const PHOTON_BASE_URL = 'https://photon.komoot.io/api/';

export class PhotonBackend implements GeocodingBackend<GeoJSONGeocodingResult> {
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getTimezoneId(_result: GeoJSONGeocodingResult): Promise<string | undefined> {
    // TODO
    return undefined;
  }

  async search(query: string): Promise<GeoJSONGeocodingResult[]> {
    const url = new URL(PHOTON_BASE_URL);
    url.searchParams.set('q', query);
    const results = await fetch(url);
    const json = (await results.json()) as FeatureCollection;
    return json.features.map((feature) => new GeoJSONGeocodingResult(feature));
  }
}
