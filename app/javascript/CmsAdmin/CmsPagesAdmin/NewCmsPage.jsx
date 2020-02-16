import React, { useReducer } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import buildPageInput from './buildPageInput';
import CmsPageForm, { pageReducer } from './CmsPageForm';
import { CmsPagesAdminQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import { CreatePage } from './mutations.gql';
import useAsyncFunction from '../../useAsyncFunction';
import { useCreateMutation } from '../../MutationUtils';
import usePageTitle from '../../usePageTitle';
import PageLoadingIndicator from '../../PageLoadingIndicator';

function NewCmsPage() {
  const history = useHistory();
  const { data, loading, error } = useQuery(CmsPagesAdminQuery);
  const [page, dispatch] = useReducer(pageReducer, {});
  const [createPage, createError, createInProgress] = useAsyncFunction(
    useCreateMutation(CreatePage, {
      query: CmsPagesAdminQuery,
      arrayPath: ['cmsPages'],
      newObjectPath: ['createPage', 'page'],
    }),
  );

  usePageTitle('New page');

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const formSubmitted = async (event) => {
    event.preventDefault();
    await createPage({
      variables: {
        page: buildPageInput(page),
      },
    });
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

        <ErrorDisplay graphQLError={createError} />

        <input
          type="submit"
          className="btn btn-primary"
          value="Create page"
          disabled={createInProgress}
          aria-label="Create page"
        />
      </form>
    </>
  );
}

export default NewCmsPage;
