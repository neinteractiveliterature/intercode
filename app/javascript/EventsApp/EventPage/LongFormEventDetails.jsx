import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';

import ErrorDisplay from '../../ErrorDisplay';
import { EventPageQuery } from './queries.gql';
import parsePageContent from '../../parsePageContent';
import useSectionizedFormItems from './useSectionizedFormItems';
import LoadingIndicator from '../../LoadingIndicator';

function LongFormEventDetails({ eventId }) {
  const { data, loading, error } = useQuery(EventPageQuery, { variables: { eventId } });

  const { longFormItems, formResponse } = useSectionizedFormItems(
    error || loading ? null : data.event,
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return longFormItems.map((item, index) => (
    formResponse[item.identifier] && formResponse[item.identifier].trim() !== ''
      ? (
        <section className="mb-4 event-details" id={item.identifier} key={item.identifier}>
          {index > 0 && <hr />}
          {
            item.identifier === 'description'
              ? null
              : <h4>{item.public_description}</h4>
          }

          {parsePageContent(formResponse[item.identifier]).bodyComponents}
        </section>
      )
      : null
  ));
}

LongFormEventDetails.propTypes = {
  eventId: PropTypes.number.isRequired,
};

export default LongFormEventDetails;
