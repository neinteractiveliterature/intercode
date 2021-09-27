import { useTranslation } from 'react-i18next';

import {
  EventForFormatBucket,
  formatBucket,
  SignupForFormatBucket,
} from '../EventsApp/SignupAdmin/SignupUtils';

export type BucketChangeCellProps = {
  value: SignupForFormatBucket & {
    previous_signup_change?: SignupForFormatBucket | null;
    run: {
      event: EventForFormatBucket;
    };
  };
};

function BucketChangeCell({ value }: BucketChangeCellProps): JSX.Element {
  const { t } = useTranslation();
  const oldBucket = value.previous_signup_change
    ? formatBucket(value.previous_signup_change, value.run.event, t)
    : null;
  const newBucket = formatBucket(value, value.run.event, t);

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
