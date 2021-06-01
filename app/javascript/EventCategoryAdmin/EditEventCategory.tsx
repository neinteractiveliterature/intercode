import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import buildEventCategoryInput from './buildEventCategoryInput';
import EventCategoryForm from './EventCategoryForm';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';
import { LoadSingleValueFromCollectionWrapper } from '../GraphqlLoadingWrappers';
import { useEventCategoryAdminQuery } from './queries.generated';
import { useUpdateEventCategoryMutation } from './mutations.generated';

export default LoadSingleValueFromCollectionWrapper(
  useEventCategoryAdminQuery,
  (data, id) => data.convention.event_categories.find((c) => c.id.toString() === id),
  function EditEventCategoryForm({ value: initialEventCategory, data: { convention } }) {
    const history = useHistory();
    const [updateMutate] = useUpdateEventCategoryMutation();
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

        <ErrorDisplay graphQLError={updateError as ApolloError} />

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
  },
);
