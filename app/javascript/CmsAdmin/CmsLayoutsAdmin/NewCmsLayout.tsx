import { useState } from 'react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay, useCreateMutationWithReferenceArrayUpdater } from '@neinteractiveliterature/litform';

import buildLayoutInput from './buildLayoutInput';
import CmsLayoutForm from './CmsLayoutForm';
import usePageTitle from '../../usePageTitle';
import { CmsLayout } from '../../graphqlTypes.generated';
import { CreateLayoutMutationData, useCreateLayoutMutation } from './mutations.generated';
import { CmsLayoutFieldsFragmentDoc } from './queries.generated';
import { useCmsLayoutsAdminLoader } from './loaders';

function NewCmsLayout(): JSX.Element {
  const data = useCmsLayoutsAdminLoader();
  const navigate = useNavigate();
  const [layout, setLayout] = useState<Pick<CmsLayout, 'name' | 'admin_notes' | 'navbar_classes' | 'content'>>({});
  const [createLayout, { error: createError, loading: createInProgress }] = useCreateMutationWithReferenceArrayUpdater(
    useCreateLayoutMutation,
    data.cmsParent,
    'cmsLayouts',
    (data: CreateLayoutMutationData) => data.createCmsLayout.cms_layout,
    CmsLayoutFieldsFragmentDoc,
  );

  usePageTitle('New Layout');

  const formSubmitted = async (event: React.FormEvent) => {
    event.preventDefault();
    await createLayout({
      variables: {
        cmsLayout: buildLayoutInput(layout),
      },
    });
    navigate('/cms_layouts');
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

export const Component = NewCmsLayout;
