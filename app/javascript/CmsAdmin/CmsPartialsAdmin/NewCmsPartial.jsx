import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

import buildPartialInput from './buildPartialInput';
import { CmsPartialsAdminQuery } from './queries.gql';
import { CreatePartial } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import useAsyncFunction from '../../useAsyncFunction';
import useQuerySuspended from '../../useQuerySuspended';
import { useCreateMutation } from '../../MutationUtils';
import CmsPartialForm, { partialReducer } from './CmsPartialForm';
import usePageTitle from '../../usePageTitle';

function NewCmsPartial({ history }) {
  const { data, error } = useQuerySuspended(CmsPartialsAdminQuery);
  const [partial, dispatch] = useReducer(partialReducer, {});
  const [createPartial, createError, createInProgress] = useAsyncFunction(
    useCreateMutation(CreatePartial, {
      query: CmsPartialsAdminQuery,
      arrayPath: ['cmsPartials'],
      newObjectPath: ['createCmsPartial', 'cms_partial'],
    }),
  );

  usePageTitle('New Partial');

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

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
          cmsPartials={data.cmsPartials}
          cmsParent={data.cmsParent}
        />

        <ErrorDisplay graphQLError={createError} />

        <input
          type="submit"
          className="btn btn-primary"
          value="Create partial"
          disabled={createInProgress}
        />
      </form>
    </>
  );
}

NewCmsPartial.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default NewCmsPartial;
