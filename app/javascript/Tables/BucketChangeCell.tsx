import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  EventForFormatBucket,
  formatBucket,
  SignupForFormatBucket,
} from '../EventsApp/SignupAdmin/SignupUtils';

export type BucketChangeCellProps = {
  value: SignupForFormatBucket & {
    previous_signup_change?: SignupForFormatBucket;
    run: {
      event: EventForFormatBucket;
    };
  };
};

const BucketChangeCell = ({ value }: BucketChangeCellProps) => {
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
};

export default BucketChangeCell;
