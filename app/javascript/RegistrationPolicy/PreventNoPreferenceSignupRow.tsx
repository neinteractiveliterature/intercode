import * as React from 'react';
import { ChoiceSet } from '@neinteractiveliterature/litform';

import { isPreventNoPreferenceSignupsApplicable } from './RegistrationPolicyUtils';
import NoPreferenceHelpPopover from './NoPreferenceHelpPopover';
import { RegistrationPolicyPreset } from '../FormAdmin/FormItemUtils';
import { RegistrationPolicyForRegistrationPolicyUtils } from './RegistrationPolicy';
import { useTranslation } from 'react-i18next';

export type PreventNoPreferenceSignupRowProps = {
  columnCount: number;
  onChange: React.Dispatch<string>;
  preset?: RegistrationPolicyPreset;
  registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils;
};

function PreventNoPreferenceSignupRow({
  columnCount,
  onChange,
  preset,
  registrationPolicy,
}: PreventNoPreferenceSignupRowProps): JSX.Element {
  const { t } = useTranslation();
  const renderPreventNoPreferenceSignupsDescription = () => {
    if (!isPreventNoPreferenceSignupsApplicable(registrationPolicy)) {
      return (
        <span>
          {t(
            'events.registrationPolicies.noPreferenceInapplicable',
            '“No preference” option is inapplicable',
          )}
          <NoPreferenceHelpPopover registrationPolicy={registrationPolicy} />
        </span>
      );
    }

    if (registrationPolicy.prevent_no_preference_signups) {
      return (
        <span>
          {t(
            'events.registrationPolicies.noPreferenceDisabled',
            '“No preference” option will not be available',
          )}
          <NoPreferenceHelpPopover registrationPolicy={registrationPolicy} />
        </span>
      );
    }

    return (
      <span>
        {t(
          'events.registrationPolicies.noPreferenceEnabled',
          '“No preference” option will be available',
        )}
        <NoPreferenceHelpPopover registrationPolicy={registrationPolicy} />
      </span>
    );
  };

  if (preset || !isPreventNoPreferenceSignupsApplicable(registrationPolicy)) {
    return (
      <tr>
        <td>
          {t(
            'events.registrationPolicies.noPreferenceEnabled',
            '“No preference” option will be available',
          )}
        </td>
        <td colSpan={columnCount - 1}>{renderPreventNoPreferenceSignupsDescription()}</td>
      </tr>
    );
  }

  const boolValue = registrationPolicy.prevent_no_preference_signups;
  const choiceSetValue = boolValue == null ? null : boolValue.toString();

  return (
    <tr>
      <td className="text-nowrap">
        {t('signups.noPreference', 'No preference')}
        <NoPreferenceHelpPopover registrationPolicy={registrationPolicy} />
      </td>
      <td colSpan={columnCount - 1}>
        <ChoiceSet
          name="prevent_no_preference_signups"
          choices={[
            {
              label: t(
                'events.registrationPolicies.enableNoPreference',
                'Show "no preference" option',
              ),
              value: 'false',
            },
            {
              label: t(
                'events.registrationPolicies.disableNoPreference',
                'Don’t show "no preference" option',
              ),
              value: 'true',
            },
          ]}
          choiceClassName="form-check-inline"
          value={choiceSetValue}
          onChange={onChange}
        />
      </td>
    </tr>
  );
}

export default PreventNoPreferenceSignupRow;
