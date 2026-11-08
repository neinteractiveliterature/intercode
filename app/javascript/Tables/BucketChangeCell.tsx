import { useTranslation } from 'react-i18next';

import { EventForFormatBucket, formatBucket } from '../EventsApp/SignupAdmin/SignupUtils';
import { SignupChangeType } from 'EventsApp/SignupAdmin/RunSignupChangesTable';

export type BucketChangeType = {
  signupChange: SignupChangeType;
  event: EventForFormatBucket;
};

// (only needs getValue out of the cell context the table gives a cell, which makes it easy to render on its own)
function BucketChangeCell({ getValue }: { getValue: () => BucketChangeType }): React.JSX.Element {
  const value = getValue();
  const { t } = useTranslation();

  if (!value) {
    return <></>;
  }

  const { signupChange, event } = value;

  const oldBucket = signupChange.previous_signup_change
    ? formatBucket(
        { ...signupChange.previous_signup_change, requested_bucket: signupChange.signup.requested_bucket },
        event,
        t,
      )
    : null;
  const newBucket = formatBucket({ ...signupChange, requested_bucket: signupChange.signup.requested_bucket }, event, t);

  return (
    <>
      {oldBucket && oldBucket !== newBucket && (
        <>
          <s>{oldBucket}</s>
          <br />
        </>
      )}
      {newBucket}
    </>
  );
}

export default BucketChangeCell;
