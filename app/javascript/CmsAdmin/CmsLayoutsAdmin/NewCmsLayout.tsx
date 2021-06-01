import { useState } from 'react';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import buildLayoutInput from './buildLayoutInput';
import { CmsLayoutsAdminQuery } from './queries';
import { CreateLayout } from './mutations';
import useAsyncFunction from '../../useAsyncFunction';
import { useCreateMutation } from '../../MutationUtils';
import CmsLayoutForm from './CmsLayoutForm';
import usePageTitle from '../../usePageTitle';
import { CmsLayout } from '../../graphqlTypes.generated';

function NewCmsLayout() {
  const history = useHistory();
  const [layout, setLayout] = useState<
    Pick<CmsLayout, 'name' | 'admin_notes' | 'navbar_classes' | 'content'>
  >({});
  const [createLayout, createError, createInProgress] = useAsyncFunction(
    useCreateMutation(CreateLayout, {
      query: CmsLayoutsAdminQuery,
      arrayPath: ['cmsLayouts'],
      newObjectPath: ['createCmsLayout', 'cms_layout'],
    }),
  );

  usePageTitle('New Layout');

  const formSubmitted = async (event: React.FormEvent) => {
    event.preventDefault();
    await createLayout({
      variables: {
        cmsLayout: buildLayoutInput(layout),
      },
    });
    history.push('/cms_layouts');
  };

  return (
    <form onSubmit={formSubmitted}>
      <CmsLayoutForm layout={layout} onChange={setLayout} />

      <ErrorDisplay graphQLError={createError as ApolloError} />

      <input
        type="submit"
        className="btn btn-primary"
        value="Create layout"
        disabled={createInProgress}
        aria-label="Create layout"
      />
    </form>
  );
}

export default NewCmsLayout;
