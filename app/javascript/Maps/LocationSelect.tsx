import { useContext } from 'react';
import AsyncSelect, { Props } from 'react-select/async';

import MapboxContext from '../MapboxContext';

type MapboxAPIFeature = {
  id: string;
  place_type: string[];
  place_name: string;
  text: string;
};

export type LocationSelectProps = Omit<
  Props<MapboxAPIFeature, false>,
  'loadOptions' | 'formatOptionLabel' | 'getOptionValue'
>;

function LocationSelect({ ...props }: LocationSelectProps): JSX.Element {
  const { mapboxAccessToken } = useContext(MapboxContext);
  const loadOptions = async (inputValue: string) => {
    const uri = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      inputValue,
    )}.json?access_token=${mapboxAccessToken}`;
    const results = await fetch(uri);
    const json = await results.json();
    return json.features as MapboxAPIFeature[];
  };

  return (
    <AsyncSelect<MapboxAPIFeature>
      loadOptions={loadOptions}
      formatOptionLabel={(option) => {
        if (option.place_type.length === 1 && option.place_type[0] === 'address') {
          return option.place_name;
        }

        return (
          <>
            {option.text}{' '}
            <small className="text-muted">
              {option.place_name.replace(option.text, '').replace(/^,/, '').trim()}
            </small>
          </>
        );
      }}
      getOptionValue={(option) => option.id}
      {...props}
    />
  );
}

export default LocationSelect;
