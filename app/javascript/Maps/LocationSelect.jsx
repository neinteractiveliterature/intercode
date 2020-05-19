import React, { useContext } from 'react';
import AsyncSelect from 'react-select/async';

import MapboxContext from '../MapboxContext';

function LocationSelect({ ...props }) {
  const { mapboxAccessToken } = useContext(MapboxContext);
  const loadOptions = async (inputValue) => {
    const uri = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(inputValue)}.json?access_token=${mapboxAccessToken}`;
    const results = await fetch(uri);
    const json = await results.json();
    return json.features;
  };

  return (
    <AsyncSelect
      loadOptions={loadOptions}
      formatOptionLabel={(option) => {
        if (option.place_type.length === 1 && option.place_type[0] === 'address') {
          return option.place_name;
        }

        return (
          <>
            {option.text}
            {' '}
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
