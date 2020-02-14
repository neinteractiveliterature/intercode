import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MomentPropTypes from 'react-moment-proptypes';
import { useQuery } from 'react-apollo-hooks';

import ErrorDisplay from '../ErrorDisplay';
import TabbedMailingList from './TabbedMailingList';
import Timespan from '../Timespan';
import WhosFreeForm from './WhosFreeForm';
import { WhosFreeQuery } from './queries.gql';
import LoadingIndicator from '../LoadingIndicator';
import usePageTitle from '../usePageTitle';

function WhosFreeResults({ timespan }) {
  const { data, loading, error } = useQuery(WhosFreeQuery, {
    variables: { start: timespan.start.toISOString(), finish: timespan.finish.toISOString() },
  });

  if (loading) {
    return <LoadingIndicator />;
  }

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

  usePageTitle('Who‘s free');

  return (
    <>
      <h1 className="mb-4">Who&rsquo;s free?</h1>
      <WhosFreeForm onSubmit={({ start, finish }) => setTimespan(new Timespan(start, finish))} />
      {timespan && <WhosFreeResults timespan={timespan} />}
    </>
  );
}

export default WhosFree;
