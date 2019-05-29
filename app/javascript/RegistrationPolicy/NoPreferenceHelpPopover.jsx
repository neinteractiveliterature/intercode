import React from 'react';

import HelpPopover from '../UIComponents/HelpPopover';
import { isPreventNoPreferenceSignupsApplicable } from './RegistrationPolicyUtils';
import { RegistrationPolicyPropType } from './RegistrationPolicy';

const NO_PREFERENCE_HELP_TEXT = 'For events that have more than one registration bucket with '
+ 'limited slots, we can display a "no preference" option for signups. Users who sign up '
+ ' using that option will be placed in whatever limited-slot bucket has availability, and moved '
+ 'between buckets to make space as necessary.';

function NoPreferenceHelpPopover({ registrationPolicy }) {
  if (!isPreventNoPreferenceSignupsApplicable(registrationPolicy)) {
    return (
      <HelpPopover className="ml-1">
        <p>{NO_PREFERENCE_HELP_TEXT}</p>
        <p className="mb-0">
          This event doesn&apos;t have more than one registration bucket with limited slots, so
          that option doesn&apos;t apply.
        </p>
      </HelpPopover>
    );
  }

  return (
    <HelpPopover>{NO_PREFERENCE_HELP_TEXT}</HelpPopover>
  );
}

NoPreferenceHelpPopover.propTypes = {
  registrationPolicy: RegistrationPolicyPropType.isRequired,
};

export default NoPreferenceHelpPopover;
