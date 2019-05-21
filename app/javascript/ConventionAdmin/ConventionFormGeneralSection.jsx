import React from 'react';
import PropTypes from 'prop-types';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import DateTimeInput from '../BuiltInFormControls/DateTimeInput';
import TimezoneSelect from '../BuiltInFormControls/TimezoneSelect';
import { useChangeDispatchers } from '../ComposableFormUtils';
import useUniqueId from '../useUniqueId';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';

function ConventionFormGeneralSection({ convention, dispatch, disabled }) {
  const [
    changeName, changeSiteMode, changeDomain, changeTimezoneName, changeStartsAt, changeEndsAt,
  ] = useChangeDispatchers(
    dispatch,
    ['name', 'site_mode', 'domain', 'timezone_name', 'starts_at', 'ends_at'],
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
    timezone_name: PropTypes.string,
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
