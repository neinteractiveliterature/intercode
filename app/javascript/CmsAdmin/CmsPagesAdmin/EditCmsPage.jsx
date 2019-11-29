import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useMutation } from 'react-apollo-hooks';

import buildPageInput from './buildPageInput';
import CmsPageForm, { pageReducer } from './CmsPageForm';
import { CmsPagesAdminQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import { UpdatePage } from './mutations.gql';
import useAsyncFunction from '../../useAsyncFunction';
import useQuerySuspended from '../../useQuerySuspended';
import useValueUnless from '../../useValueUnless';
import usePageTitle from '../../usePageTitle';

function EditCmsPage({ match, history }) {
  const { data, error } = useQuerySuspended(CmsPagesAdminQuery);
  const initialPage = error ? null : data.cmsPages.find((p) => match.params.id === p.id.toString());
  const [page, dispatch] = useReducer(pageReducer, initialPage);
  const [updateMutate] = useMutation(UpdatePage);
  const [updatePage, updateError, updateInProgress] = useAsyncFunction(updateMutate);
  const apolloClient = useApolloClient();

  usePageTitle(useValueUnless(() => `Edit “${initialPage.name}”`, error));

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

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
          cmsLayouts={data.cmsLayouts}
          cmsParent={data.cmsParent}
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

EditCmsPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditCmsPage;
