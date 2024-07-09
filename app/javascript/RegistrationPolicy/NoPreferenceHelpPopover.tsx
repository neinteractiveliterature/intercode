import { HelpPopover } from '@neinteractiveliterature/litform';

import { isPreventNoPreferenceSignupsApplicable } from './RegistrationPolicyUtils';
import { RegistrationPolicyForRegistrationPolicyUtils } from './RegistrationPolicy';
import { useTranslation } from 'react-i18next';

export type NoPreferenceHelpPopoverProps = {
  registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils;
};

function NoPreferenceHelpPopover({ registrationPolicy }: NoPreferenceHelpPopoverProps): JSX.Element {
  const { t } = useTranslation();
  const noPreferenceHelpText = t('events.registrationPolicies.noPreferenceHelpText');
  if (!isPreventNoPreferenceSignupsApplicable(registrationPolicy)) {
    return (
      <HelpPopover className="ms-1" iconSet="bootstrap-icons">
        <p>{noPreferenceHelpText}</p>
        <p className="mb-0">{t('events.registrationPolicies.noPreferenceInapplicableHelpText')}</p>
      </HelpPopover>
    );
  }

  return <HelpPopover iconSet="bootstrap-icons">{noPreferenceHelpText}</HelpPopover>;
}

export default NoPreferenceHelpPopover;
