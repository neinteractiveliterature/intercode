import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import useUniqueId from '../../useUniqueId';
import FieldRequiredFeedback from './FieldRequiredFeedback';
import MarkdownInput from '../../BuiltInFormControls/MarkdownInput';
import RequiredIndicator from './RequiredIndicator';
import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import { parseIntOrNull } from '../../ComposableFormUtils';

function getDefaultAgeRestrictionsDescription(minimumAge) {
  if (!minimumAge) {
    return 'No age restrictions.';
  }

  return `Must be ${minimumAge} years or older.`;
}

function AgeRestrictionsInput(props) {
  const {
    formItem, onChange, onInteract, valueInvalid,
  } = props;
  const value = props.value || {};

  const descriptionId = useUniqueId(`${formItem.identifier}-description-`);

  const userInteracted = useCallback(
    () => onInteract(formItem.identifier),
    [onInteract, formItem.identifier],
  );

  const descriptionChanged = useCallback(
    (newDescription) => {
      onChange({ ...value, age_restrictions_description: newDescription });
      userInteracted();
    },
    [onChange, userInteracted, value],
  );

  const minimumAgeChanged = useCallback(
    (newMinimumAgeString) => {
      const newMinimumAge = parseIntOrNull(newMinimumAgeString);

      if (
        !value.age_restrictions_description
        || value.age_restrictions_description.trim() === ''
        || value.age_restrictions_description
          === getDefaultAgeRestrictionsDescription(value.minimum_age)
      ) {
        onChange({
          ...value,
          age_restrictions_description: getDefaultAgeRestrictionsDescription(newMinimumAge),
          minimum_age: newMinimumAge,
        });
      } else {
        onChange({ ...value, minimum_age: newMinimumAge });
      }

      userInteracted();
    },
    [onChange, userInteracted, value],
  );

  return (
    <fieldset className="card my-2">
      <div className="card-header py-0">
        { /* eslint-disable-next-line react/no-danger */}
        <legend className="col-form-label" dangerouslySetInnerHTML={{ __html: formItem.properties.caption }} />
      </div>

      <div className="card-body pb-1">
        <div className="form-group">
          <label htmlFor={descriptionId}>
            Publicly visible age restrictions text
            <RequiredIndicator formItem={formItem} />
          </label>
          <MarkdownInput
            value={value.age_restrictions_description || ''}
            onChange={descriptionChanged}
            onBlur={userInteracted}
            lines={1}
            formControlClassName={classNames({ 'is-invalid': valueInvalid })}
          >
            <FieldRequiredFeedback valueInvalid={valueInvalid} />
          </MarkdownInput>
        </div>

        <BootstrapFormInput
          value={value.minimum_age ? value.minimum_age.toString() : ''}
          onTextChange={minimumAgeChanged}
          type="number"
          min="0"
          label="Minimum age"
          helpText={(
            <>
              If specified, the signups list will warn you if someone too young to play has
              signed up.
              {' '}
              <strong>The site does not enforce age restrictions; you must do so yourself.</strong>
            </>
          )}
        />
      </div>
    </fieldset>
  );
}

AgeRestrictionsInput.propTypes = {
  formItem: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    properties: PropTypes.shape({
      caption: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  value: PropTypes.shape({
    age_restrictions_description: PropTypes.string,
    minimum_age: PropTypes.number,
  }),
  onChange: PropTypes.func.isRequired,
  onInteract: PropTypes.func.isRequired,
  valueInvalid: PropTypes.bool.isRequired,
};

AgeRestrictionsInput.defaultProps = {
  value: null,
};

export default AgeRestrictionsInput;
