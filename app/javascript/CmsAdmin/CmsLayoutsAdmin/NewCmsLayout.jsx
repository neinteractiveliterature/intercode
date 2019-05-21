import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

import buildLayoutInput from './buildLayoutInput';
import { CmsLayoutsAdminQuery } from './queries.gql';
import { CreateLayout } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import useAsyncFunction from '../../useAsyncFunction';
import useQuerySuspended from '../../useQuerySuspended';
import { useCreateMutation } from '../../MutationUtils';
import CmsLayoutForm, { layoutReducer } from './CmsLayoutForm';
import usePageTitle from '../../usePageTitle';

function NewCmsLayout({ history }) {
  const { data, error } = useQuerySuspended(CmsLayoutsAdminQuery);
  const [layout, dispatch] = useReducer(layoutReducer, {});
  const [createLayout, createError, createInProgress] = useAsyncFunction(
    useCreateMutation(CreateLayout, {
      query: CmsLayoutsAdminQuery,
      arrayPath: ['cmsLayouts'],
      newObjectPath: ['createCmsLayout', 'cms_layout'],
    }),
  );

  usePageTitle('New Layout');

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const formSubmitted = async (event) => {
    event.preventDefault();
    await createLayout({
      variables: {
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
          cmsLayouts={data.cmsLayouts}
          cmsParent={data.cmsParent}
        />

        <ErrorDisplay graphQLError={createError} />

        <input
          type="submit"
          className="btn btn-primary"
          value="Create layout"
          disabled={createInProgress}
        />
      </form>
    </>
  );
}

NewCmsLayout.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default NewCmsLayout;
