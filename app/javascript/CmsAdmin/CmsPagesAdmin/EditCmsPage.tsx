import { useState } from 'react';
import * as React from 'react';
import { ApolloError, useApolloClient } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { useNavigate, useNavigationType } from 'react-router-dom';
import buildPageInput from './buildPageInput';
import CmsPageForm from './CmsPageForm';
import useAsyncFunction from '../../useAsyncFunction';
import usePageTitle from '../../usePageTitle';
import { LoadSingleValueFromCollectionWrapper } from '../../GraphqlLoadingWrappers';
import { useCmsPagesAdminQuery } from './queries.generated';
import { useUpdatePageMutation } from './mutations.generated';
import { Action } from 'history';

export default LoadSingleValueFromCollectionWrapper(
  useCmsPagesAdminQuery,
  (data, id) => data.cmsParent.cmsPages.find((p) => id === p.id.toString()),
  function EditCmsPageForm({ value: initialPage, data: { cmsParent } }) {
    const navigate = useNavigate();
    const navigationType = useNavigationType();
    const [page, setPage] = useState(initialPage);
    const [updateMutate] = useUpdatePageMutation();
    const [updatePage, updateError, updateInProgress] = useAsyncFunction(updateMutate);
    const apolloClient = useApolloClient();

    usePageTitle(`Edit “${initialPage.name}”`);

    const formSubmitted = async (event: React.FormEvent) => {
      event.preventDefault();
      await updatePage({
        variables: {
          id: initialPage.id,
          page: buildPageInput(page),
        },
      });
      await apolloClient.resetStore();
      if (navigationType === Action.Push) {
        navigate(-1);
      } else {
        navigate('/cms_pages');
      }
    };

    return (
      <>
        <form onSubmit={formSubmitted}>
          <CmsPageForm page={page} onChange={setPage} cmsLayouts={cmsParent.cmsLayouts} cmsParent={cmsParent} />

          <ErrorDisplay graphQLError={updateError as ApolloError} />

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
  },
);
