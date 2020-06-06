import React, { useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';
import { useParams, useHistory } from 'react-router-dom';

import buildPartialInput from './buildPartialInput';
import CmsPartialForm, { partialReducer } from './CmsPartialForm';
import { CmsPartialsAdminQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import { UpdatePartial } from './mutations.gql';
import useAsyncFunction from '../../useAsyncFunction';
import usePageTitle from '../../usePageTitle';
import PageLoadingIndicator from '../../PageLoadingIndicator';

function EditCmsPartialForm({ initialPartial }) {
  const history = useHistory();
  const [partial, dispatch] = useReducer(partialReducer, initialPartial);
  const [updateMutate] = useMutation(UpdatePartial);
  const [updatePartial, updateError, updateInProgress] = useAsyncFunction(updateMutate);
  const apolloClient = useApolloClient();

  usePageTitle(`Editing “${initialPartial.name}”`);

  const formSubmitted = async (event) => {
    event.preventDefault();
    await updatePartial({
      variables: {
        id: initialPartial.id,
        cmsPartial: buildPartialInput(partial),
      },
    });
    await apolloClient.resetStore();
    if (history.length > 1) {
      history.goBack();
    } else {
      history.push('/cms_partials');
    }
  };

  return (
    <>
      <form onSubmit={formSubmitted}>
        <CmsPartialForm
          partial={partial}
          dispatch={dispatch}
        />

        <ErrorDisplay graphQLError={updateError} />

        <input
          type="submit"
          className="btn btn-primary"
          value="Save changes"
          aria-label="Save changes"
          disabled={updateInProgress}
        />
      </form>
    </>
  );
}

EditCmsPartialForm.propTypes = {
  initialPartial: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

function EditCmsPartial() {
  const { id } = useParams();
  const { data, loading, error } = useQuery(CmsPartialsAdminQuery);
  const initialPartial = useMemo(
    () => (
      loading || error
        ? null
        : data.cmsPartials.find((p) => id === p.id.toString())
    ),
    [data, id, loading, error],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  return <EditCmsPartialForm initialPartial={initialPartial} />;
}

export default EditCmsPartial;
