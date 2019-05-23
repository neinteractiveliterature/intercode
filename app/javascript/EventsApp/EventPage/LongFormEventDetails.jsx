import React from 'react';
import PropTypes from 'prop-types';

import ErrorDisplay from '../../ErrorDisplay';
import { EventPageQuery } from './queries.gql';
import parsePageContent from '../../parsePageContent';
import useSectionizedFormItems from './useSectionizedFormItems';
import useQuerySuspended from '../../useQuerySuspended';

function LongFormEventDetails({ eventId }) {
  const { data, error } = useQuerySuspended(EventPageQuery, { variables: { eventId } });

  const { longFormItems, formResponse } = useSectionizedFormItems(error ? null : data.event);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return longFormItems.map(item => (
    formResponse[item.identifier] && formResponse[item.identifier].trim() !== ''
      ? (
        <section className="my-4 event-details" id={item.identifier} key={item.identifier}>
          <hr />

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
