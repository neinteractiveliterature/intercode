import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { propType } from 'graphql-anywhere';

import EditRunModal from './EditRunModal';
import { ConventionFields, EventFields } from './queries.gql';
import buildEventCategoryUrl from './buildEventCategoryUrl';

function EditRun({
  match, convention, events, history,
}) {
  const event = useMemo(
    () => {
      if (!match) {
        return null;
      }

      return events.find(e => e.id.toString() === match.params.eventId);
    },
    [match, events],
  );

  const initialRun = useMemo(
    () => {
      if (!match) {
        return null;
      }

      if (match.path.endsWith('/new')) {
        return {
          starts_at: null,
          title_suffix: null,
          schedule_note: null,
          rooms: [],
        };
      }

      return event.runs.find(r => r.id.toString() === match.params.runId);
    },
    [match, event],
  );

  const cancelEditing = () => {
    history.replace(buildEventCategoryUrl(event.event_category));
  };

  const [run, setRun] = useState(initialRun);
  const [prevMatch, setPrevMatch] = useState(match);

  if (prevMatch !== match) {
    // navigation happened, reset the run state
    setRun(initialRun);
    setPrevMatch(match);
  }

  return (
    <EditRunModal
      convention={convention}
      editingRunChanged={setRun}
      event={event}
      onCancel={cancelEditing}
      onDelete={cancelEditing}
      onSaveStart={() => { }}
      onSaveSucceeded={cancelEditing}
      onSaveFailed={() => { }}
      run={run}
    />
  );
}

EditRun.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      eventId: PropTypes.string.isRequired,
      runId: PropTypes.string.isRequired,
    }).isRequired,
  }),
  convention: propType(ConventionFields).isRequired,
  events: PropTypes.arrayOf(propType(EventFields)).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

EditRun.defaultProps = {
  match: null,
};

export default EditRun;
