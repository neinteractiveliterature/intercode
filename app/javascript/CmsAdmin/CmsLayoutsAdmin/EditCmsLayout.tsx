import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { ActionFunction, Form, redirect, useActionData, useLoaderData, useNavigation } from 'react-router';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { buildLayoutInputFromFormData } from './buildLayoutInput';
import CmsLayoutForm from './CmsLayoutForm';
import usePageTitle from '../../usePageTitle';
import { singleCmsLayoutAdminLoader, SingleCmsLayoutAdminLoaderResult } from './loaders';
import { client } from '../../useIntercodeApolloClient';
import { UpdateLayoutDocument } from './mutations.generated';

export const action: ActionFunction = async ({ params: { id }, request }) => {
  const formData = await request.formData();

  try {
    await client.mutate({
      mutation: UpdateLayoutDocument,
      variables: {
        id: id ?? '',
        cmsLayout: buildLayoutInputFromFormData(formData),
      },
    });
  } catch (e) {
    return e;
  }
  await client.resetStore();

  return redirect(formData.get('destination')?.toString() ?? '/cms_layouts');
};

export const loader = singleCmsLayoutAdminLoader;

function EditCmsLayout() {
  const { layout: initialLayout } = useLoaderData() as SingleCmsLayoutAdminLoaderResult;
  const [layout, setLayout] = useState(initialLayout);
  const updateError = useActionData();
  const navigation = useNavigation();

  usePageTitle(`Editing “${initialLayout.name}”`);

  return (
    <>
      <Form action="." method="PATCH">
        <CmsLayoutForm layout={layout} onChange={setLayout} />

        <ErrorDisplay graphQLError={updateError as ApolloError} />

        <input
          type="submit"
          className="btn btn-primary"
          value="Save changes"
          disabled={navigation.state !== 'idle'}
          aria-label="Save changes"
        />
      </Form>
    </>
  );
}

export const Component = EditCmsLayout;
