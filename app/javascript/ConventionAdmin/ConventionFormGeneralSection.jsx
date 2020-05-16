import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import DateTimeInput from '../BuiltInFormControls/DateTimeInput';
import TimezoneSelect from '../BuiltInFormControls/TimezoneSelect';
import { useChangeDispatchers } from '../ComposableFormUtils';
import useUniqueId from '../useUniqueId';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import LocationSelect from '../Maps/LocationSelect';
import FormGroupWithLabel from '../BuiltInFormControls/FormGroupWithLabel';
import MapboxMap from '../Maps/MapboxMap';
import MapboxContext from '../MapboxContext';

function ConventionFormGeneralSection({ convention, dispatch, disabled }) {
  const { mapboxAccessToken } = useContext(MapboxContext);
  const [
    changeName, changeSiteMode, changeDomain, changeTimezoneName, changeStartsAt, changeEndsAt,
    changeLocation,
  ] = useChangeDispatchers(
    dispatch,
    ['name', 'site_mode', 'domain', 'timezone_name', 'starts_at', 'ends_at', 'location'],
  );
  const startId = useUniqueId('starts-at-');
  const endId = useUniqueId('ends-at-');

  const startEndFields = [
    ['starts_at', 'Convention starts', changeStartsAt, startId],
    ['ends_at', 'Convention ends', changeEndsAt, endId],
  ].map(([name, label, onChange, inputId]) => (
    <div className="col-md-6" key={name}>
      <label htmlFor={inputId}>{label}</label>
      <DateTimeInput
        value={convention[name]}
        timezoneName={convention.timezone_name}
        onChange={onChange}
        id={inputId}
        disabled={disabled}
      />
    </div>
  ));

  const conventionLocation = useMemo(
    () => (convention.location ? JSON.parse(convention.location) : null),
    [convention.location],
  );

  const setLocation = async (location) => {
    changeLocation(location ? JSON.stringify(location) : null);
    if (location?.center) {
      const uri = `https://api.mapbox.com/v4/examples.4ze9z6tv/tilequery/${location.center[0]},${location.center[1]}.json?access_token=${mapboxAccessToken}`;
      const response = await fetch(uri);
      const json = await response.json();
      const tzid = json.features[0]?.properties?.TZID;
      if (tzid) {
        changeTimezoneName(tzid);
      }
    }
  };

  return (
    <>
      <BootstrapFormInput
        name="name"
        label="Name"
        value={convention.name || ''}
        onTextChange={changeName}
        disabled={disabled}
      />

      <MultipleChoiceInput
        caption="Site mode"
        choices={[
          {
            value: 'convention',
            label: 'Site behaves as a convention with multiple events',
          },
          {
            value: 'single_event',
            label: 'Site behaves as a single standalone event',
          },
        ]}
        value={convention.site_mode}
        onChange={changeSiteMode}
        disabled={disabled}
      />

      <BootstrapFormInput
        name="domain"
        label="Convention domain name"
        value={convention.domain || ''}
        onTextChange={changeDomain}
        disabled={disabled}
      />

      <FormGroupWithLabel label="Location">
        {(id) => (
          <>
            <LocationSelect
              inputId={id}
              value={conventionLocation}
              onChange={setLocation}
              disabled={disabled}
              isClearable
            />
            {conventionLocation && (
              <div className="mt-2">
                <MapboxMap
                  center={conventionLocation.center}
                  markerLocation={conventionLocation.center}
                />
              </div>
            )}
          </>
        )}
      </FormGroupWithLabel>

      <TimezoneSelect
        name="timezone_name"
        label="Time zone"
        value={convention.timezone_name}
        onChange={changeTimezoneName}
        disabled={disabled}
      />

      <div className="row form-group">
        {startEndFields}
      </div>
    </>
  );
}

ConventionFormGeneralSection.propTypes = {
  convention: PropTypes.shape({
    name: PropTypes.string,
    domain: PropTypes.string,
    location: PropTypes.string,
    timezone_name: PropTypes.string,
    site_mode: PropTypes.string,
    starts_at: PropTypes.string,
    ends_at: PropTypes.string,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

ConventionFormGeneralSection.defaultProps = {
  disabled: false,
};

export default ConventionFormGeneralSection;
