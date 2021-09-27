import { HelpPopover } from '@neinteractiveliterature/litform';

import { isPreventNoPreferenceSignupsApplicable } from './RegistrationPolicyUtils';
import { RegistrationPolicyForRegistrationPolicyUtils } from './RegistrationPolicy';
import { useTranslation } from 'react-i18next';

export type NoPreferenceHelpPopoverProps = {
  registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils;
};

function NoPreferenceHelpPopover({
  registrationPolicy,
}: NoPreferenceHelpPopoverProps): JSX.Element {
  const { t } = useTranslation();
  const noPreferenceHelpText = t(
    'events.registrationPolicies.noPreferenceHelpText',
    'For events that have more than one registration bucket with limited slots, we can display a “no preference” option for signups. Users who sign up using that option will be placed in whatever limited-slot bucket has availability, and moved between buckets to make space as necessary.',
  );
  if (!isPreventNoPreferenceSignupsApplicable(registrationPolicy)) {
    return (
      <HelpPopover className="ms-1" iconSet="bootstrap-icons">
        <p>{noPreferenceHelpText}</p>
        <p className="mb-0">
          {t(
            'events.registrationPolicies.noPreferenceInapplicableHelpText',
            'This event doesn’t have more than one registration bucket with limited slots, so that option doesn’t apply.',
          )}
        </p>
      </HelpPopover>
    );
  }

  return <HelpPopover iconSet="bootstrap-icons">{noPreferenceHelpText}</HelpPopover>;
}

export default NoPreferenceHelpPopover;
