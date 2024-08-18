import { useState } from 'react';
import * as React from 'react';
import { ApolloError, useApolloClient } from '@apollo/client';
import { useLoaderData, useNavigate, useNavigationType } from 'react-router-dom';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import buildPartialInput from './buildPartialInput';
import CmsPartialForm from './CmsPartialForm';
import useAsyncFunction from '../../useAsyncFunction';
import usePageTitle from '../../usePageTitle';
import { useUpdatePartialMutation } from './mutations.generated';
import { Action } from 'history';
import { singleCmsPartialAdminLoader, SingleCmsPartialAdminLoaderResult } from './loaders';

export const loader = singleCmsPartialAdminLoader;

function EditCmsPartialForm() {
  const { partial: initialPartial } = useLoaderData() as SingleCmsPartialAdminLoaderResult;
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const [partial, setPartial] = useState(initialPartial);
  const [updateMutate] = useUpdatePartialMutation();
  const [updatePartial, updateError, updateInProgress] = useAsyncFunction(updateMutate);
  const apolloClient = useApolloClient();

  usePageTitle(`Editing “${initialPartial.name}”`);

  const formSubmitted = async (event: React.FormEvent) => {
    event.preventDefault();
    await updatePartial({
      variables: {
        id: initialPartial.id,
        cmsPartial: buildPartialInput(partial),
      },
    });
    await apolloClient.resetStore();
    if (navigationType === Action.Push) {
      navigate(-1);
    } else {
      navigate('/cms_partials');
    }
  };

  return (
    <>
      <form onSubmit={formSubmitted}>
        <CmsPartialForm partial={partial} onChange={setPartial} />

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
}

export const Component = EditCmsPartialForm;
