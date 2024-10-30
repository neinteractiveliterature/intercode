import { useId, useMemo } from 'react';
import * as React from 'react';
import {
  BootstrapFormInput,
  FormGroupWithLabel,
  MultipleChoiceInput,
  usePropertySetters,
} from '@neinteractiveliterature/litform';

import DateTimeInput from '../BuiltInFormControls/DateTimeInput';
import TimezoneSelect from '../BuiltInFormControls/TimezoneSelect';
import LocationSelect from '../Maps/LocationSelect';
import EnumTypes from '../enumTypes.json';
import { timezoneNameForConvention } from '../TimeUtils';
import ConventionLanguageInput from './ConventionLanguageInput';
import type { ConventionFormConvention } from './ConventionForm';
import { SiteMode, TimezoneMode } from '../graphqlTypes.generated';
import OpenLayersMap, { fromLonLat } from 'Maps/OpenLayersMap';
import ConventionLocationMap from 'Maps/ConventionLocationMap';

export type ConventionFormGeneralSectionProps = {
  convention: ConventionFormConvention;
  setConvention: React.Dispatch<React.SetStateAction<ConventionFormConvention>>;
  disabled: boolean;
};

function ConventionFormGeneralSection({
  convention,
  setConvention,
  disabled,
}: ConventionFormGeneralSectionProps): JSX.Element {
  const [
    setName,
    setSiteMode,
    setDomain,
    setTimezoneName,
    setStartsAt,
    setEndsAt,
    setLocation,
    setTimezoneMode,
    setLanguage,
  ] = usePropertySetters(
    setConvention,
    'name',
    'site_mode',
    'domain',
    'timezone_name',
    'starts_at',
    'ends_at',
    'location',
    'timezone_mode',
    'language',
  );

  const startId = useId();
  const endId = useId();

  const startEndFields = (
    [
      ['starts_at', 'Convention starts', convention.starts_at, setStartsAt, startId],
      ['ends_at', 'Convention ends', convention.ends_at, setEndsAt, endId],
    ] as const
  ).map(([fieldName, label, value, onChange, inputId]) => (
    <div className="col-md-6" key={fieldName}>
      <label className="form-label" htmlFor={inputId}>
        {label}
      </label>
      <DateTimeInput
        value={value}
        timezoneName={timezoneNameForConvention(convention)}
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

  const locationSelectChanged = async (newValue: { center: [number, number] } | undefined) => {
    setLocation(newValue ? JSON.stringify(newValue) : null);
    if (newValue?.center) {
      const uri = `https://api.mapbox.com/v4/examples.4ze9z6tv/tilequery/${newValue.center[0]},${newValue.center[1]}.json?access_token=${mapboxAccessToken}`;
      const response = await fetch(uri);
      const json = await response.json();
      const tzid = json.features[0]?.properties?.TZID;
      if (tzid) {
        setTimezoneName(tzid);
      }
    }
  };

  return (
    <>
      <BootstrapFormInput
        name="name"
        label="Name"
        value={convention.name ?? ''}
        onTextChange={setName}
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
          {
            value: 'event_series',
            label: 'Site behaves as a series of standalone events',
          },
        ]}
        value={convention.site_mode}
        onChange={(newValue: string) => setSiteMode(newValue as SiteMode)}
        disabled={disabled}
      />

      <ConventionLanguageInput value={convention.language} onChange={setLanguage} disabled={disabled} />

      <BootstrapFormInput
        name="domain"
        label="Convention domain name"
        value={convention.domain ?? ''}
        onTextChange={setDomain}
        disabled={disabled}
      />

      <MultipleChoiceInput
        caption="Date and time display mode"
        choices={EnumTypes.TimezoneMode.enumValues.map((enumValue) => ({
          value: enumValue.name,
          label: enumValue.description,
        }))}
        value={convention.timezone_mode}
        onChange={(newValue: string) => setTimezoneMode(newValue as TimezoneMode)}
        disabled={disabled}
      />

      {convention.timezone_mode !== 'user_local' && (
        <>
          <FormGroupWithLabel label="Location">
            {(id) => (
              <>
                <LocationSelect
                  inputId={id}
                  value={conventionLocation}
                  onChange={(value) => {
                    locationSelectChanged(value ?? undefined);
                  }}
                  isDisabled={disabled}
                  isClearable
                />
                {conventionLocation && (
                  <div className="mt-2">
                    <ConventionLocationMap location={convention.location} />
                    {/* <MapboxMap center={conventionLocation.center} markerLocation={conventionLocation.center} /> */}
                  </div>
                )}
              </>
            )}
          </FormGroupWithLabel>

          <TimezoneSelect label="Time zone" value={convention.timezone_name} onChange={setTimezoneName} />
        </>
      )}

      <div className="row mb-3">{startEndFields}</div>
    </>
  );
}

export default ConventionFormGeneralSection;
