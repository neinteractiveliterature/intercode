import { useState } from 'react';
import * as React from 'react';
import { ApolloError } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  ErrorDisplay,
  LoadQueryWrapper,
  useCreateMutationWithReferenceArrayUpdater,
} from '@neinteractiveliterature/litform';

import buildPageInput from './buildPageInput';
import CmsPageForm, { PageFormFields } from './CmsPageForm';
import usePageTitle from '../../usePageTitle';
import { CmsPageFieldsFragmentDoc, useCmsPagesAdminQuery } from './queries.generated';
import { CreatePageMutationData, useCreatePageMutation } from './mutations.generated';

export default LoadQueryWrapper(useCmsPagesAdminQuery, function NewCmsPage({ data }) {
  const navigate = useNavigate();
  const [page, setPage] = useState<PageFormFields>({
    hidden_from_search: false,
  });
  const [createPage, { error: createError, loading: createInProgress }] = useCreateMutationWithReferenceArrayUpdater(
    useCreatePageMutation,
    data.cmsParent,
    'cmsPages',
    (data: CreatePageMutationData) => data.createPage.page,
    CmsPageFieldsFragmentDoc,
    'CmsPageFields',
  );

  usePageTitle('New page');

  const formSubmitted = async (event: React.FormEvent) => {
    event.preventDefault();
    await createPage({
      variables: {
        page: buildPageInput(page),
      },
    });
    navigate('/cms_pages');
  };

  return (
    <>
      <form onSubmit={formSubmitted}>
        <CmsPageForm page={page} onChange={setPage} cmsLayouts={data.cmsParent.cmsLayouts} cmsParent={data.cmsParent} />

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
});
