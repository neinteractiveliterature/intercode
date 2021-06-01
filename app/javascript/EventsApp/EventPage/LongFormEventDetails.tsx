import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import parsePageContent from '../../parsePageContent';
import useSectionizedFormItems from './useSectionizedFormItems';
import { useEventPageQuery } from './queries.generated';

export type LongFormEventDetailsProps = {
  eventId: number;
};

function LongFormEventDetails({ eventId }: LongFormEventDetailsProps) {
  const { data, loading, error } = useEventPageQuery({ variables: { eventId } });

  const { longFormItems, formResponse } = useSectionizedFormItems(
    error || loading || !data ? undefined : data.event,
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      {longFormItems.map((item, index) =>
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
