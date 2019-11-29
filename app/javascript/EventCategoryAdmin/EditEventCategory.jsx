import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';

import buildEventCategoryInput from './buildEventCategoryInput';
import { EventCategoryAdminQuery } from './queries.gql';
import EventCategoryForm from './EventCategoryForm';
import ErrorDisplay from '../ErrorDisplay';
import { UpdateEventCategory } from './mutations.gql';
import useQuerySuspended from '../useQuerySuspended';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';

function EditEventCategory({ match, history }) {
  const { data, error } = useQuerySuspended(EventCategoryAdminQuery);
  const [updateMutate] = useMutation(UpdateEventCategory);
  const [update, updateError, updateInProgress] = useAsyncFunction(updateMutate);

  const { id: eventCategoryId } = match.params;
  const initialEventCategory = useMemo(
    () => (error
      ? null
      : data.convention.event_categories.find((c) => c.id.toString() === eventCategoryId)),
    [data, error, eventCategoryId],
  );
  const [eventCategory, setEventCategory] = useState(initialEventCategory);

  usePageTitle(useValueUnless(() => `Editing “${initialEventCategory.name}”`, error));

  const updateClicked = async () => {
    await update({
      variables: {
        id: eventCategory.id,
        eventCategory: buildEventCategoryInput(eventCategory),
      },
    });

    history.push('/event_categories');
  };

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <h1 className="mb-4">Edit event category</h1>

      <EventCategoryForm
        value={eventCategory}
        onChange={setEventCategory}
        forms={data.convention.forms}
        ticketName={data.convention.ticket_name}
        ticketMode={data.convention.ticket_mode}
        disabled={updateInProgress}
      />

      <ErrorDisplay graphQLError={updateError} />

      <button
        type="button"
        className="btn btn-primary"
        onClick={updateClicked}
        disabled={updateInProgress}
      >
        Save changes
      </button>
    </>
  );
}

EditEventCategory.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditEventCategory;
