import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

import buildPartialInput from './buildPartialInput';
import CmsPartialForm, { partialReducer } from './CmsPartialForm';
import { CmsPartialsAdminQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import { UpdatePartial } from './mutations.gql';
import useAsyncFunction from '../../useAsyncFunction';
import useMutationCallback from '../../useMutationCallback';
import useQuerySuspended from '../../useQuerySuspended';

function EditCmsPartial({ match, history }) {
  const { data, error } = useQuerySuspended(CmsPartialsAdminQuery);
  const initialPartial = error
    ? null
    : data.cmsPartials.find(p => match.params.id === p.id.toString());
  const [partial, dispatch] = useReducer(partialReducer, initialPartial);
  const [updatePartial, updateError, updateInProgress] = useAsyncFunction(
    useMutationCallback(UpdatePartial),
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const formSubmitted = async (event) => {
    event.preventDefault();
    await updatePartial({
      variables: {
        id: initialPartial.id,
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

        <ErrorDisplay graphQLError={updateError} />

        <input
          type="submit"
          className="btn btn-primary"
          value="Save changes"
          disabled={updateInProgress}
        />
      </form>
    </>
  );
}

EditCmsPartial.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditCmsPartial;
