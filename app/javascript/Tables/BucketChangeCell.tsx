import { useTranslation } from 'react-i18next';

import { formatBucket } from '../EventsApp/SignupAdmin/SignupUtils';
import { SignupChange } from 'graphqlTypes.generated';
import { CellContext } from '@tanstack/react-table';

function BucketChangeCell<TData extends SignupChange, TValue>({ cell }: CellContext<TData, TValue>): JSX.Element {
  const value = cell.row.original;
  const { t } = useTranslation();

  if (!value) {
    return <></>;
  }

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
