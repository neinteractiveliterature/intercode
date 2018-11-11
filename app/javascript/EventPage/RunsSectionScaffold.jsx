import React from 'react';

import { EventPageQuery } from './queries.gql';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import RunsSection from './RunsSection';

function RunsSectionScaffold({ eventId }) {
  return (
    <QueryWithStateDisplay query={EventPageQuery} variables={{ eventId }}>
      {({ data: { convention, currentAbility, myProfile, event } }) => (
        <RunsSection
          event={event}
          currentAbility={currentAbility}
          myProfile={myProfile}
          timezoneName={convention.timezone_name}
        />
      )}
    </QueryWithStateDisplay>
  );
}

export default RunsSectionScaffold;
