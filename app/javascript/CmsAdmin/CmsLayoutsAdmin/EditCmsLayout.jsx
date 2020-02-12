import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useMutation, useQuery } from 'react-apollo-hooks';
import { useHistory, useParams } from 'react-router-dom';

import buildLayoutInput from './buildLayoutInput';
import CmsLayoutForm, { layoutReducer } from './CmsLayoutForm';
import { CmsLayoutsAdminQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import { UpdateLayout } from './mutations.gql';
import useAsyncFunction from '../../useAsyncFunction';
import usePageTitle from '../../usePageTitle';
import PageLoadingIndicator from '../../PageLoadingIndicator';

function EditCmsLayoutForm({ initialLayout }) {
  const history = useHistory();
  const [layout, dispatch] = useReducer(layoutReducer, initialLayout);
  const [updateMutate] = useMutation(UpdateLayout);
  const [updateLayout, updateError, updateInProgress] = useAsyncFunction(updateMutate);
  const apolloClient = useApolloClient();

  usePageTitle(`Editing “${initialLayout.name}”`);

  const formSubmitted = async (event) => {
    event.preventDefault();
    await updateLayout({
      variables: {
        id: initialLayout.id,
        cmsLayout: buildLayoutInput(layout),
      },
    });
    await apolloClient.resetStore();
    history.push('/cms_layouts');
  };

  return (
    <>
      <form onSubmit={formSubmitted}>
        <CmsLayoutForm
          layout={layout}
          dispatch={dispatch}
        />

        <ErrorDisplay graphQLError={updateError} />

        <input
          type="submit"
          className="btn btn-primary"
          value="Save changes"
          disabled={updateInProgress}
          aria-label="Save changes"
        />
      </form>
    </>
  );
}

EditCmsLayoutForm.propTypes = {
  initialLayout: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

function EditCmsLayout() {
  const { id } = useParams();
  const { data, loading, error } = useQuery(CmsLayoutsAdminQuery);
  const initialLayout = error || loading
    ? null
    : data.cmsLayouts.find((layout) => id === layout.id.toString());

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return <EditCmsLayoutForm initialLayout={initialLayout} />;
}

export default EditCmsLayout;
