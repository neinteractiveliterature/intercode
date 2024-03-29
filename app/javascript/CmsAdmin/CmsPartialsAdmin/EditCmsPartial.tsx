import { useState } from 'react';
import * as React from 'react';
import { ApolloError, useApolloClient } from '@apollo/client';
import { useNavigate, useNavigationType } from 'react-router-dom';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import buildPartialInput from './buildPartialInput';
import CmsPartialForm from './CmsPartialForm';
import useAsyncFunction from '../../useAsyncFunction';
import usePageTitle from '../../usePageTitle';
import { LoadSingleValueFromCollectionWrapper } from '../../GraphqlLoadingWrappers';
import { useCmsPartialsAdminQuery } from './queries.generated';
import { useUpdatePartialMutation } from './mutations.generated';
import { Action } from 'history';

export default LoadSingleValueFromCollectionWrapper(
  useCmsPartialsAdminQuery,
  (data, id) => data.cmsParent.cmsPartials.find((p) => id === p.id.toString()),
  function EditCmsPartialForm({ value: initialPartial }) {
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
  },
);
