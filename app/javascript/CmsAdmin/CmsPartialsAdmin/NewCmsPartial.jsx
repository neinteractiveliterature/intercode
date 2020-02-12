import React, { useReducer } from 'react';
import { useHistory } from 'react-router-dom';

import buildPartialInput from './buildPartialInput';
import { CmsPartialsAdminQuery } from './queries.gql';
import { CreatePartial } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import useAsyncFunction from '../../useAsyncFunction';
import { useCreateMutation } from '../../MutationUtils';
import CmsPartialForm, { partialReducer } from './CmsPartialForm';
import usePageTitle from '../../usePageTitle';

function NewCmsPartial() {
  const history = useHistory();
  const [partial, dispatch] = useReducer(partialReducer, {});
  const [createPartial, createError, createInProgress] = useAsyncFunction(
    useCreateMutation(CreatePartial, {
      query: CmsPartialsAdminQuery,
      arrayPath: ['cmsPartials'],
      newObjectPath: ['createCmsPartial', 'cms_partial'],
    }),
  );

  usePageTitle('New Partial');

  const formSubmitted = async (event) => {
    event.preventDefault();
    await createPartial({
      variables: {
        cmsPartial: buildPartialInput(partial),
      },
    });
    history.push('/cms_partials');
  };

  return (
    <>
      <form onSubmit={formSubmitted}>
        <CmsPartialForm
          partial={partial}
          dispatch={dispatch}
        />

        <ErrorDisplay graphQLError={createError} />

        <input
          type="submit"
          className="btn btn-primary"
          value="Create partial"
          disabled={createInProgress}
          aria-label="Create partial"
        />
      </form>
    </>
  );
}

export default NewCmsPartial;
