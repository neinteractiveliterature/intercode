import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

import buildPageInput from './buildPageInput';
import CmsPageForm, { pageReducer } from './CmsPageForm';
import { CmsPagesAdminQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import { CreatePage } from './mutations.gql';
import useAsyncFunction from '../../useAsyncFunction';
import useQuerySuspended from '../../useQuerySuspended';
import { useCreateMutation } from '../../MutationUtils';
import usePageTitle from '../../usePageTitle';

function NewCmsPage({ history }) {
  const { data, error } = useQuerySuspended(CmsPagesAdminQuery);
  const [page, dispatch] = useReducer(pageReducer, {});
  const [createPage, createError, createInProgress] = useAsyncFunction(
    useCreateMutation(CreatePage, {
      query: CmsPagesAdminQuery,
      arrayPath: ['cmsPages'],
      newObjectPath: ['createPage', 'page'],
    }),
  );

  usePageTitle('New page');

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
        />
      </form>
    </>
  );
}

NewCmsPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default NewCmsPage;
