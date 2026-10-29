import { useState } from 'react';

import { Form, redirect, useActionData, useLoaderData, useNavigation } from 'react-router';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { buildLayoutInputFromFormData } from './buildLayoutInput';
import CmsLayoutForm from './CmsLayoutForm';
import usePageTitle from '../../usePageTitle';
import { singleCmsLayoutAdminLoader } from './loaders';
import { apolloClientContext } from '../../AppContexts';
import { UpdateLayoutDocument } from './mutations.generated';
import type { Route } from './+types/EditCmsLayout';

export const clientAction = async ({ params: { id }, request, context }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
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

export const clientLoader = singleCmsLayoutAdminLoader;

function EditCmsLayout() {
  const { layout: initialLayout } = useLoaderData<typeof clientLoader>();
  const [layout, setLayout] = useState(initialLayout);
  const updateError = useActionData<typeof clientAction>();
  const navigation = useNavigation();

  usePageTitle(`Editing “${initialLayout.name}”`);

  return (
    <>
      <Form action="." method="PATCH">
        <CmsLayoutForm layout={layout} onChange={setLayout} />

        <ErrorDisplay graphQLError={updateError} />

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

export default EditCmsLayout;
