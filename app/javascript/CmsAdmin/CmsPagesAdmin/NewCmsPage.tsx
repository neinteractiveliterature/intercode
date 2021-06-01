import { useState } from 'react';
import * as React from 'react';
import { ApolloError } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import buildPageInput from './buildPageInput';
import CmsPageForm, { PageFormFields } from './CmsPageForm';
import { CmsPagesAdminQuery } from './queries';
import { CreatePage } from './mutations';
import useAsyncFunction from '../../useAsyncFunction';
import { useCreateMutation } from '../../MutationUtils';
import usePageTitle from '../../usePageTitle';
import { useCmsPagesAdminQuery } from './queries.generated';

function NewCmsPage() {
  const history = useHistory();
  const { data, loading, error } = useCmsPagesAdminQuery();
  const [page, setPage] = useState<PageFormFields>({
    hidden_from_search: false,
  });
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

  const formSubmitted = async (event: React.FormEvent) => {
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
          onChange={setPage}
          cmsLayouts={data!.cmsLayouts}
          cmsParent={data!.cmsParent}
        />

        <ErrorDisplay graphQLError={createError as ApolloError} />

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
