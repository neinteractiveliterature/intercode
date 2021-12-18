import { useState } from 'react';
import * as React from 'react';
import { ApolloError, useApolloClient } from '@apollo/client';
import { useNavigate, useNavigationType } from 'react-router-dom';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import buildLayoutInput from './buildLayoutInput';
import CmsLayoutForm from './CmsLayoutForm';
import useAsyncFunction from '../../useAsyncFunction';
import usePageTitle from '../../usePageTitle';
import { useCmsLayoutsAdminQuery } from './queries.generated';
import { LoadSingleValueFromCollectionWrapper } from '../../GraphqlLoadingWrappers';
import { useUpdateLayoutMutation } from './mutations.generated';
import { Action } from 'history';

export default LoadSingleValueFromCollectionWrapper(
  useCmsLayoutsAdminQuery,
  (data, id) => data.cmsParent.cmsLayouts.find((layout) => id === layout.id.toString()),
  function EditCmsLayout({ value: initialLayout }) {
    const navigate = useNavigate();
    const navigationType = useNavigationType();
    const [layout, setLayout] = useState(initialLayout);
    const [updateMutate] = useUpdateLayoutMutation();
    const [updateLayout, updateError, updateInProgress] = useAsyncFunction(updateMutate);
    const apolloClient = useApolloClient();

    usePageTitle(`Editing “${initialLayout.name}”`);

    const formSubmitted = async (event: React.FormEvent) => {
      event.preventDefault();
      await updateLayout({
        variables: {
          id: initialLayout.id,
          cmsLayout: buildLayoutInput(layout),
        },
      });
      await apolloClient.resetStore();
      if (navigationType === Action.Push) {
        navigate(-1);
      } else {
        navigate('/cms_layouts');
      }
    };

    return (
      <>
        <form onSubmit={formSubmitted}>
          <CmsLayoutForm layout={layout} onChange={setLayout} />

          <ErrorDisplay graphQLError={updateError as ApolloError} />

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
  },
);
