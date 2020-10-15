import React, { useContext, useMemo } from 'react';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import DateTimeInput from '../BuiltInFormControls/DateTimeInput';
import TimezoneSelect from '../BuiltInFormControls/TimezoneSelect';
import useUniqueId from '../useUniqueId';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import LocationSelect from '../Maps/LocationSelect';
import FormGroupWithLabel from '../BuiltInFormControls/FormGroupWithLabel';
import MapboxMap from '../Maps/MapboxMap';
import MapboxContext from '../MapboxContext';
import EnumTypes from '../enumTypes.json';
import { timezoneNameForConvention } from '../TimeUtils';
import ConventionLanguageInput from './ConventionLanguageInput';
import type { ConventionFormConvention } from './ConventionForm';
import { usePartialState, usePartialStateFactory } from '../usePartialState';
import { SiteMode, TimezoneMode } from '../graphqlTypes.generated';

export type ConventionFormGeneralSectionProps = {
  convention: ConventionFormConvention;
  setConvention: React.Dispatch<React.SetStateAction<ConventionFormConvention>>;
  disabled: boolean;
};

function ConventionFormGeneralSection({
  convention,
  setConvention,
  disabled,
}: ConventionFormGeneralSectionProps) {
  const { mapboxAccessToken } = useContext(MapboxContext);
  const factory = usePartialStateFactory(convention, setConvention);
  const [name, setName] = usePartialState(factory, 'name');
  const [siteMode, setSiteMode] = usePartialState(factory, 'site_mode');
  const [domain, setDomain] = usePartialState(factory, 'domain');
  const [timezoneName, setTimezoneName] = usePartialState(factory, 'timezone_name');
  const [startsAt, setStartsAt] = usePartialState(factory, 'starts_at');
  const [endsAt, setEndsAt] = usePartialState(factory, 'ends_at');
  const [location, setLocation] = usePartialState(factory, 'location');
  const [timezoneMode, setTimezoneMode] = usePartialState(factory, 'timezone_mode');
  const [language, setLanguage] = usePartialState(factory, 'language');

  const startId = useUniqueId('starts-at-');
  const endId = useUniqueId('ends-at-');

  const startEndFields = ([
    ['starts_at', 'Convention starts', startsAt, setStartsAt, startId],
    ['ends_at', 'Convention ends', endsAt, setEndsAt, endId],
  ] as const).map(([fieldName, label, value, onChange, inputId]) => (
    <div className="col-md-6" key={fieldName}>
      <label htmlFor={inputId}>{label}</label>
      <DateTimeInput
        value={value}
        timezoneName={timezoneNameForConvention(convention)}
        onChange={onChange}
        id={inputId}
        disabled={disabled}
      />
    </div>
  ));

  const conventionLocation = useMemo(() => (location ? JSON.parse(location) : null), [location]);

  const locationSelectChanged = async (newValue: any) => {
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
        value={name ?? ''}
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
        ]}
        value={siteMode}
        onChange={(newValue: string) => setSiteMode(newValue as SiteMode)}
        disabled={disabled}
      />

      <ConventionLanguageInput value={language} onChange={setLanguage} disabled={disabled} />

      <BootstrapFormInput
        name="domain"
        label="Convention domain name"
        value={domain ?? ''}
        onTextChange={setDomain}
        disabled={disabled}
      />

      <MultipleChoiceInput
        caption="Date and time display mode"
        choices={EnumTypes.TimezoneMode.enumValues.map((enumValue) => ({
          value: enumValue.name,
          label: enumValue.description,
        }))}
        value={timezoneMode}
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
                  onChange={locationSelectChanged}
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

          <TimezoneSelect label="Time zone" value={timezoneName} onChange={setTimezoneName} />
        </>
      )}

      <div className="row form-group">{startEndFields}</div>
    </>
  );
}

export default ConventionFormGeneralSection;
