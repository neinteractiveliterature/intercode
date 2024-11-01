import { Feature } from 'geojson';
import { ReactNode } from 'react';
import { GroupBase } from 'react-select';
import AsyncSelect, { AsyncProps } from 'react-select/async';

export interface GeocodingResult {
  getId(): string;
  getCoordinates(): number[];
  formatLabel(): ReactNode;
  toGeoJSONFeature(): Feature;
}

export interface GeocodingBackend<Result extends GeocodingResult> {
  search(query: string): Promise<Result[]>;
  getTimezoneId(result: Result): Promise<string | undefined>;
}

export type LocationSelectProps<Result extends GeocodingResult> = Omit<
  AsyncProps<Result, false, GroupBase<Result>>,
  'loadOptions' | 'formatOptionLabel' | 'getOptionValue'
> & {
  backend: GeocodingBackend<Result>;
};

function LocationSelect<Result extends GeocodingResult>({ ...props }: LocationSelectProps<Result>): JSX.Element {
  return (
    <AsyncSelect<Result>
      loadOptions={(query) => props.backend.search(query)}
      formatOptionLabel={(option) => option.formatLabel()}
      getOptionValue={(option) => option.getId()}
      {...props}
    />
  );
}

export default LocationSelect;
