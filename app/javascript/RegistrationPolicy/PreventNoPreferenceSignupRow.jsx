import React from 'react';
import PropTypes from 'prop-types';

import { isPreventNoPreferenceSignupsApplicable } from './RegistrationPolicyUtils';
import NoPreferenceHelpPopover from './NoPreferenceHelpPopover';
import ChoiceSet from '../BuiltInFormControls/ChoiceSet';

function PreventNoPreferenceSignupRow({
  columnCount, onChange, preset, registrationPolicy,
}) {
  const renderPreventNoPreferenceSignupsDescription = () => {
    if (!isPreventNoPreferenceSignupsApplicable(registrationPolicy)) {
      return (
        <span>
          &quot;No preference&quot; option is inapplicable

          <NoPreferenceHelpPopover registrationPolicy={registrationPolicy} />
        </span>
      );
    }

    if (registrationPolicy.prevent_no_preference_signups) {
      return (
        <span>
          &quot;No preference&quot; option will not be available

          <NoPreferenceHelpPopover registrationPolicy={registrationPolicy} />
        </span>
      );
    }

    return (
      <span>
        &quot;No preference&quot; option will be available

        <NoPreferenceHelpPopover registrationPolicy={registrationPolicy} />
      </span>
    );
  };

  if (
    preset
    || !isPreventNoPreferenceSignupsApplicable(registrationPolicy)
  ) {
    return (
      <tr>
        <td>No preference</td>
        <td colSpan={columnCount - 1}>
          {renderPreventNoPreferenceSignupsDescription()}
        </td>
      </tr>
    );
  }

  const boolValue = registrationPolicy.prevent_no_preference_signups;
  const choiceSetValue = (boolValue == null ? null : boolValue.toString());

  return (
    <tr>
      <td className="text-nowrap">
        No preference

        <NoPreferenceHelpPopover registrationPolicy={registrationPolicy} />
      </td>
      <td colSpan={columnCount - 1}>
        <ChoiceSet
          name="prevent_no_preference_signups"
          choices={[
            { label: 'Show "no preference" option', value: 'false' },
            { label: 'Don\'t show "no preference" option', value: 'true' },
          ]}
          choiceClassName="form-check-inline"
          value={choiceSetValue}
          onChange={onChange}
        />
      </td>
    </tr>
  );
}

PreventNoPreferenceSignupRow.propTypes = {
  columnCount: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  preset: PropTypes.shape({}),
  registrationPolicy: PropTypes.shape({
    prevent_no_preference_signups: PropTypes.bool,
  }).isRequired,
};

PreventNoPreferenceSignupRow.defaultProps = {
  preset: null,
};

export default PreventNoPreferenceSignupRow;
