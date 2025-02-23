import { useTranslation } from 'react-i18next';

import { EventForFormatBucket, formatBucket } from '../EventsApp/SignupAdmin/SignupUtils';
import { CellContext } from '@tanstack/react-table';
import { SignupChangeType } from 'EventsApp/SignupAdmin/RunSignupChangesTable';

export type BucketChangeType = {
  signupChange: SignupChangeType;
  event: EventForFormatBucket;
};

function BucketChangeCell<TData, TValue extends BucketChangeType>({
  getValue,
}: CellContext<TData, TValue>): JSX.Element {
  const value = getValue();
  const { t } = useTranslation();

  if (!value) {
    return <></>;
  }

  const { signupChange, event } = value;

  const oldBucket = signupChange.previous_signup_change
    ? formatBucket(
        { ...signupChange.previous_signup_change, requested_bucket_key: signupChange.signup.requested_bucket_key },
        event,
        t,
      )
    : null;
  const newBucket = formatBucket(
    { ...signupChange, requested_bucket_key: signupChange.signup.requested_bucket_key },
    event,
    t,
  );

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
