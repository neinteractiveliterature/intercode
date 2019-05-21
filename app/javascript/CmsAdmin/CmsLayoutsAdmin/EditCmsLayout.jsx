import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

import buildLayoutInput from './buildLayoutInput';
import CmsLayoutForm, { layoutReducer } from './CmsLayoutForm';
import { CmsLayoutsAdminQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import { UpdateLayout } from './mutations.gql';
import useAsyncFunction from '../../useAsyncFunction';
import useMutationCallback from '../../useMutationCallback';
import useQuerySuspended from '../../useQuerySuspended';
import useValueUnless from '../../useValueUnless';
import usePageTitle from '../../usePageTitle';

function EditCmsLayout({ match, history }) {
  const { data, error } = useQuerySuspended(CmsLayoutsAdminQuery);
  const initialLayout = error
    ? null
    : data.cmsLayouts.find(p => match.params.id === p.id.toString());
  const [layout, dispatch] = useReducer(layoutReducer, initialLayout);
  const [updateLayout, updateError, updateInProgress] = useAsyncFunction(
    useMutationCallback(UpdateLayout),
  );

  usePageTitle(useValueUnless(() => `Editing “${initialLayout.name}”`, error));

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const formSubmitted = async (event) => {
    event.preventDefault();
    await updateLayout({
      variables: {
        id: initialLayout.id,
        cmsLayout: buildLayoutInput(layout),
      },
    });
    history.push('/cms_layouts');
  };

  return (
    <>
      <form onSubmit={formSubmitted}>
        <CmsLayoutForm
          layout={layout}
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

EditCmsLayout.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditCmsLayout;
