import { HelpPopover } from '@neinteractiveliterature/litform';

import { isPreventNoPreferenceSignupsApplicable } from './RegistrationPolicyUtils';
import { RegistrationPolicyForRegistrationPolicyUtils } from './RegistrationPolicy';

const NO_PREFERENCE_HELP_TEXT =
  'For events that have more than one registration bucket with ' +
  'limited slots, we can display a "no preference" option for signups. Users who sign up ' +
  ' using that option will be placed in whatever limited-slot bucket has availability, and moved ' +
  'between buckets to make space as necessary.';

export type NoPreferenceHelpPopoverProps = {
  registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils;
};

function NoPreferenceHelpPopover({ registrationPolicy }: NoPreferenceHelpPopoverProps) {
  if (!isPreventNoPreferenceSignupsApplicable(registrationPolicy)) {
    return (
      <HelpPopover className="ms-1" iconSet="bootstrap-icons">
        <p>{NO_PREFERENCE_HELP_TEXT}</p>
        <p className="mb-0">
          This event doesn&apos;t have more than one registration bucket with limited slots, so that
          option doesn&apos;t apply.
        </p>
      </HelpPopover>
    );
  }

  return <HelpPopover iconSet="bootstrap-icons">{NO_PREFERENCE_HELP_TEXT}</HelpPopover>;
}

export default NoPreferenceHelpPopover;
