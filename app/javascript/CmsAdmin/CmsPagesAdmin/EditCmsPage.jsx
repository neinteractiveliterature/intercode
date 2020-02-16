import React, { useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';

import { useHistory, useParams } from 'react-router-dom';
import buildPageInput from './buildPageInput';
import CmsPageForm, { pageReducer } from './CmsPageForm';
import { CmsPagesAdminQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import { UpdatePage } from './mutations.gql';
import useAsyncFunction from '../../useAsyncFunction';
import usePageTitle from '../../usePageTitle';
import PageLoadingIndicator from '../../PageLoadingIndicator';

function EditCmsPageForm({ initialPage, cmsLayouts, cmsParent }) {
  const history = useHistory();
  const [page, dispatch] = useReducer(pageReducer, initialPage);
  const [updateMutate] = useMutation(UpdatePage);
  const [updatePage, updateError, updateInProgress] = useAsyncFunction(updateMutate);
  const apolloClient = useApolloClient();

  usePageTitle(`Edit “${initialPage.name}”`);

  const formSubmitted = async (event) => {
    event.preventDefault();
    await updatePage({
      variables: {
        id: initialPage.id,
        page: buildPageInput(page),
      },
    });
    await apolloClient.resetStore();
    history.push('/cms_pages');
  };

  return (
    <>
      <form onSubmit={formSubmitted}>
        <CmsPageForm
          page={page}
          dispatch={dispatch}
          cmsLayouts={cmsLayouts}
          cmsParent={cmsParent}
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

EditCmsPageForm.propTypes = {
  initialPage: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  cmsLayouts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  cmsParent: PropTypes.shape({}).isRequired,
};

function EditCmsPage() {
  const { id } = useParams();
  const { data, loading, error } = useQuery(CmsPagesAdminQuery);
  const initialPage = useMemo(
    () => (error || loading
      ? null
      : data.cmsPages.find((p) => id === p.id.toString())),
    [error, loading, data, id],
  );

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <EditCmsPageForm
      initialPage={initialPage}
      cmsLayouts={data.cmsLayouts}
      cmsParent={data.cmsParent}
    />
  );
}

export default EditCmsPage;
