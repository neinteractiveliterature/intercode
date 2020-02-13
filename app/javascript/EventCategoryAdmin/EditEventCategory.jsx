import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-apollo-hooks';
import { useHistory, useParams } from 'react-router-dom';

import buildEventCategoryInput from './buildEventCategoryInput';
import { EventCategoryAdminQuery } from './queries.gql';
import EventCategoryForm from './EventCategoryForm';
import ErrorDisplay from '../ErrorDisplay';
import { UpdateEventCategory } from './mutations.gql';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';

function EditEventCategoryForm({ initialEventCategory, convention }) {
  const history = useHistory();
  const [updateMutate] = useMutation(UpdateEventCategory);
  const [update, updateError, updateInProgress] = useAsyncFunction(updateMutate);

  const [eventCategory, setEventCategory] = useState(initialEventCategory);

  usePageTitle(`Editing “${initialEventCategory.name}”`);

  const updateClicked = async () => {
    await update({
      variables: {
        id: eventCategory.id,
        eventCategory: buildEventCategoryInput(eventCategory),
      },
    });

    history.push('/event_categories');
  };

  return (
    <>
      <h1 className="mb-4">Edit event category</h1>

      <EventCategoryForm
        value={eventCategory}
        onChange={setEventCategory}
        departments={convention.departments}
        forms={convention.forms}
        ticketName={convention.ticket_name}
        ticketMode={convention.ticket_mode}
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

EditEventCategoryForm.propTypes = {
  convention: PropTypes.shape({
    departments: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    forms: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    ticket_name: PropTypes.string.isRequired,
    ticket_mode: PropTypes.string.isRequired,
  }).isRequired,
  initialEventCategory: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

function EditEventCategory() {
  const { id } = useParams();
  const { data, loading, error } = useQuery(EventCategoryAdminQuery);

  const initialEventCategory = useMemo(
    () => (error || loading
      ? null
      : data.convention.event_categories.find((c) => c.id.toString() === id)),
    [data, error, loading, id],
  );

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <EditEventCategoryForm
      initialEventCategory={initialEventCategory}
      convention={data.convention}
    />
  );
}

export default EditEventCategory;
