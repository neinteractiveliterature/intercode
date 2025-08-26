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
}: PreventNoPreferenceSignupRowProps): React.JSX.Element {
  const { t } = useTranslation();
  const renderPreventNoPreferenceSignupsDescription = () => {
    if (!isPreventNoPreferenceSignupsApplicable(registrationPolicy)) {
      return (
        <span>
          <>
            {t('events.registrationPolicies.noPreferenceInapplicable')}
            <NoPreferenceHelpPopover registrationPolicy={registrationPolicy} />
          </>
        </span>
      );
    }

    if (registrationPolicy.prevent_no_preference_signups) {
      return (
        <span>
          <>
            {t('events.registrationPolicies.noPreferenceDisabled')}
            <NoPreferenceHelpPopover registrationPolicy={registrationPolicy} />
          </>
        </span>
      );
    }

    return (
      <span>
        <>
          {t('events.registrationPolicies.noPreferenceEnabled')}
          <NoPreferenceHelpPopover registrationPolicy={registrationPolicy} />
        </>
      </span>
    );
  };

  if (preset || !isPreventNoPreferenceSignupsApplicable(registrationPolicy)) {
    return (
      <tr>
        <td>{t('events.registrationPolicies.noPreferenceEnabled')}</td>
        <td colSpan={columnCount - 1}>{renderPreventNoPreferenceSignupsDescription()}</td>
      </tr>
    );
  }

  const boolValue = registrationPolicy.prevent_no_preference_signups;
  const choiceSetValue = boolValue == null ? null : boolValue.toString();

  return (
    <tr>
      <td className="text-nowrap">
        <>
          {t('signups.noPreference')}
          <NoPreferenceHelpPopover registrationPolicy={registrationPolicy} />
        </>
      </td>
      <td colSpan={columnCount - 1}>
        <ChoiceSet
          name="prevent_no_preference_signups"
          choices={[
            {
              label: t('events.registrationPolicies.enableNoPreference'),
              value: 'false',
            },
            {
              label: t('events.registrationPolicies.disableNoPreference'),
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
