import React from 'react';
import PropTypes from 'prop-types';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import DateTimeInput from '../BuiltInFormControls/DateTimeInput';
import TimezoneSelect from '../BuiltInFormControls/TimezoneSelect';
import { useChangeDispatchers } from '../ComposableFormUtils';

function ConventionFormGeneralSection({ convention, dispatch }) {
  const [
    changeName, changeDomain, changeTimezoneName, changeStartsAt, changeEndsAt,
  ] = useChangeDispatchers(
    dispatch,
    ['name', 'domain', 'timezone_name', 'starts_at', 'ends_at'],
  );

  const startEndFields = [
    ['starts_at', 'Convention starts', changeStartsAt],
    ['ends_at', 'Convention ends', changeEndsAt],
  ].map(([name, label, onChange]) => (
    <div className="col-md-6" key={name}>
      {label}
      <DateTimeInput
        value={convention[name]}
        timezoneName={convention.timezone_name}
        onChange={onChange}
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
      />

      <BootstrapFormInput
        name="domain"
        label="Convention domain name"
        value={convention.domain || ''}
        onTextChange={changeDomain}
      />

      <TimezoneSelect
        name="timezone_name"
        label="Time zone"
        value={convention.timezone_name}
        onChange={changeTimezoneName}
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
};

export default ConventionFormGeneralSection;
