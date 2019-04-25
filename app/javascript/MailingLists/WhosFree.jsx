import React, { Suspense, useState } from 'react';
import PropTypes from 'prop-types';
import MomentPropTypes from 'react-moment-proptypes';

import ErrorDisplay from '../ErrorDisplay';
import useQuerySuspended from '../useQuerySuspended';
import TabbedMailingList from './TabbedMailingList';
import Timespan from '../Timespan';
import WhosFreeForm from './WhosFreeForm';
import { WhosFreeQuery } from './queries.gql';
import LoadingIndicator from '../LoadingIndicator';

function WhosFreeResults({ timespan }) {
  const { data, error } = useQuerySuspended(WhosFreeQuery, {
    variables: { start: timespan.start.toISOString(), finish: timespan.finish.toISOString() },
  });

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <TabbedMailingList
      emails={data.convention.mailing_lists.whos_free.emails}
      metadataFields={data.convention.mailing_lists.whos_free.metadata_fields}
      csvFilename={`Who's free - ${data.convention.name}.csv`}
    />
  );
}

WhosFreeResults.propTypes = {
  timespan: PropTypes.shape({
    start: MomentPropTypes.momentObj.isRequired,
    finish: MomentPropTypes.momentObj.isRequired,
  }).isRequired,
};

function WhosFree() {
  const [timespan, setTimespan] = useState(null);

  return (
    <>
      <h1 className="mb-4">Who&rsquo;s free?</h1>
      <WhosFreeForm onSubmit={({ start, finish }) => setTimespan(new Timespan(start, finish))} />
      {timespan && (
        <Suspense fallback={<LoadingIndicator />}>
          <WhosFreeResults timespan={timespan} />
        </Suspense>
      )}
    </>
  );
}

export default WhosFree;
