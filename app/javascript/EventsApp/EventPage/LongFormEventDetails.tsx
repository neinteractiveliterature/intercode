import React, { useMemo } from 'react';

import ErrorDisplay from '../../ErrorDisplay';
import parsePageContent from '../../parsePageContent';
import useSectionizedFormItems from './useSectionizedFormItems';
import LoadingIndicator from '../../LoadingIndicator';
import { parseTypedFormItemArray } from '../../FormAdmin/FormItemUtils';
import { useEventPageQueryQuery } from './queries.generated';

export type LongFormEventDetailsProps = {
  eventId: number;
};

function LongFormEventDetails({ eventId }: LongFormEventDetailsProps) {
  const { data, loading, error } = useEventPageQueryQuery({ variables: { eventId } });

  const { longFormItems, formResponse } = useSectionizedFormItems(
    error || loading || !data ? undefined : data.event,
  );

  const typedFormItems = useMemo(() => parseTypedFormItemArray(longFormItems ?? []), [
    longFormItems,
  ]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      {typedFormItems.map((item, index) =>
        formResponse[item.identifier ?? ''] && formResponse[item.identifier ?? ''].trim() !== '' ? (
          <section
            className="mb-4 event-details"
            id={item.identifier ?? `item${item.id}`}
            key={item.identifier ?? `item${item.id}`}
          >
            {index > 0 && <hr />}
            {item.identifier === 'description' ? null : <h4>{item.public_description}</h4>}

            {parsePageContent(formResponse[item.identifier ?? '']).bodyComponents}
          </section>
        ) : null,
      )}
    </>
  );
}

export default LongFormEventDetails;
